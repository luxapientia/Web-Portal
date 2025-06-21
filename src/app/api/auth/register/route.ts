import { NextResponse } from 'next/server';
import { registrationSchema } from '@/schemas/auth.schema';
import bcrypt from 'bcryptjs';
import { UserModel } from '@/models/User';
import redis from '@/lib/redis';
import { writeFile } from 'fs/promises';
import { join } from 'path';
import sharp from 'sharp';
import { AppConfigModel } from '@/models/AppConfig';
import { generateRandomInvitationCode } from '@/utils/generate-code';
import { config } from '@/config';
import { WalletModel } from '@/models/Wallet';
import { encryptPrivateKey } from '@/utils/encrypt';
import { walletService } from '@/services/Wallet';

// Configure upload directory
const uploadDir = join(process.cwd(), 'public');

export async function POST(request: Request) {
  try {
    // Parse multipart form data
    const formData = await request.formData();

    // Extract form fields
    const data = {
      name: formData.get('name'),
      email: formData.get('email'),
      phone: formData.get('phone'),
      password: formData.get('password'),
      idPassport: formData.get('idPassport'),
      invitationCode: formData.get('invitationCode'),
      otp: formData.get('otp'),
    };

    // Validate form data
    const validationResult = registrationSchema.safeParse(data);
    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Invalid registration data', details: validationResult.error.errors },
        { status: 400 }
      );
    }

    const { email, password, name, phone, idPassport, invitationCode } = validationResult.data;

    // Check if email is verified
    const isEmailVerified = await redis.get(`email_verified:${email}`);
    if (!isEmailVerified) {
      return NextResponse.json(
        { error: 'Email not verified' },
        { status: 400 }
      );
    }

    // Check if user already exists
    const userCount = await UserModel.countDocuments();

    
    // Check if user already exists
    const existingUser = await UserModel.findOne({
      $or: [
        { email },
        { phone },
        { idPassport },
      ]
    });

    if (existingUser) {
      let field = 'account';
      if (existingUser.email === email) field = 'email';
      else if (existingUser.phone === phone) field = 'phone number';
      else if (existingUser.idPassport === idPassport) field = 'ID/Passport';

      return NextResponse.json(
        { error: `An account with this ${field} already exists` },
        { status: 400 }
      );
    }

    let isFirstUser: boolean = false;

    if (userCount > 0) {
      //Check if user with the invitation code is existed
      const invitingUser = await UserModel.findOne({
        myInvitationCode: invitationCode
      })

      if (!invitingUser) {
        return NextResponse.json(
          { error: 'No user with the invitation code' },
          { status: 400 }
        );
      }
    } else {
      isFirstUser = true;
    }


    // Handle file uploads
    const files = {
      idFront: formData.get('idFront') as File,
      idBack: formData.get('idBack') as File,
      selfie: formData.get('selfie') as File,
    };

    // Validate files
    if (!files.idFront || !files.idBack || !files.selfie) {
      return NextResponse.json(
        { error: 'All required files must be uploaded' },
        { status: 400 }
      );
    }
    // Save files
    const savedFiles: Record<string, string> = {};

    const appConfig = await AppConfigModel.findOne({});
    const allowedImgUploadTypes = appConfig?.image_upload_types;

    for (const [key, file] of Object.entries(files)) {
      const timestamp = Date.now();
      const extension = file.name.split('.').pop();
      const filename = `${key}_${timestamp}.${extension}`;
      const filepath = join(uploadDir, filename);

      // Validate allowed MIME types
      if (!allowedImgUploadTypes.includes(file.type)) {
        return NextResponse.json({ error: `Unsupported file type: ${file.type}` }, { status: 400 });
      }

      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      let compressedBuffer: Buffer;

      switch (file.type) {
        case 'image/png':
          compressedBuffer = await sharp(buffer)
            .png({ compressionLevel: 9 }) // Lossless PNG
            .toBuffer();
          break;

        case 'image/jpeg':
          compressedBuffer = await sharp(buffer)
            .jpeg({ quality: 90, mozjpeg: true }) // Near-lossless JPEG
            .toBuffer();
          break;

        case 'image/webp':
          compressedBuffer = await sharp(buffer)
            .webp({ quality: 90, lossless: true }) // Lossless WebP
            .toBuffer();
          break;

        case 'image/jpg':
          compressedBuffer = await sharp(buffer)
            .jpeg({ quality: 90, mozjpeg: true }) // Near-lossless JPEG
            .toBuffer();
          break;

        default:
          compressedBuffer = buffer; // Fallback (shouldn't happen due to MIME check)
      }

      await writeFile(filepath, compressedBuffer);
      savedFiles[key] = `/uploads/${filename}`;
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    let myInvitationCode = "";
    let invitationCodeExists = true;
    while (invitationCodeExists) {
      myInvitationCode = generateRandomInvitationCode();
      const existingInvitationCode = await UserModel.findOne({
        myInvitationCode
      });
      if (!existingInvitationCode) {
        invitationCodeExists = false;
      }
    }

    // Create user document
    const newUser = {
      name,
      email,
      phone,
      password: hashedPassword,
      idPassport,
      invitationCode,
      isEmailVerified: true,
      isPhoneVerified: false,
      isIdVerified: false,
      role: isFirstUser ? 'admin' : 'user',
      status: 'active',
      idDocuments: savedFiles,
      createdAt: new Date(),
      updatedAt: new Date(),
      myInvitationCode
    };

    // Insert user into database
    const result = await UserModel.create(newUser);

    if (!result) {
      return NextResponse.json(
        { error: 'Failed to register user' },
        { status: 500 }
      );
    }

    // Create wallet
    const supportedChains = Object.keys(config.wallet.supportedChains);
    for (const chain of supportedChains) {
      const wallet = await walletService.generateWalletCredentials(chain);
      const supportedTokens = config.wallet.supportedChains[chain as keyof typeof config.wallet.supportedChains].supportedTokens.map(val => val.token);
      for (const token of supportedTokens) {
        await WalletModel.create({
          userId: result._id,
          address: wallet.address,
          privateKeyEncrypted: encryptPrivateKey(wallet.privateKey),
          chain: chain,
          token: token
        });
      }
    }
    // Clear email verification status
    await redis.del(`email_verified:${email}`);

    // Return success response (excluding password)
    const { ...userWithoutPassword } = newUser;
    return NextResponse.json(
      {
        message: 'Registration successful',
        user: {
          id: result.insertedId,
          ...userWithoutPassword,
        }
      },
      { status: 201 }
    );

  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 