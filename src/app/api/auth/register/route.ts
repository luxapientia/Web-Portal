import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { registrationSchema } from '@/schemas/auth.schema';
import bcrypt from 'bcryptjs';
import { UserCollection } from '@/models/User';
import redis from '@/lib/redis';
import { writeFile } from 'fs/promises';
import { join } from 'path';

// Configure upload directory
const uploadDir = join(process.cwd(), 'public', 'uploads');

export async function POST(request: Request) {
  try {
    // Parse multipart form data
    const formData = await request.formData();
    
    // Extract form fields
    const data = {
      fullName: formData.get('fullName'),
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

    const db = await getDb();
    const { email, password, fullName, phone, idPassport, invitationCode } = validationResult.data;

    // Check if email is verified
    const isEmailVerified = await redis.get(`email_verified:${email}`);
    if (!isEmailVerified) {
      return NextResponse.json(
        { error: 'Email not verified' },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await db.collection(UserCollection).findOne({
      $or: [
        { email },
        { phone },
        { idPassport }
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
    for (const [key, file] of Object.entries(files)) {
      const timestamp = Date.now();
      const filename = `${key}_${timestamp}_${file.name}`;
      const filepath = join(uploadDir, filename);

      // Convert File to Buffer and save
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      await writeFile(filepath, buffer);

      // Store relative path
      savedFiles[key] = `/uploads/${filename}`;
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user document
    const newUser = {
      fullName,
      email,
      phone,
      password: hashedPassword,
      idPassport,
      invitationCode,
      isEmailVerified: true,
      isPhoneVerified: false,
      isIdVerified: false,
      role: 'user',
      status: 'pending',
      idDocuments: savedFiles,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // Insert user into database
    const result = await db.collection(UserCollection).insertOne(newUser);

    if (!result.acknowledged) {
      throw new Error('Failed to create user');
    }

    // Clear email verification status
    await redis.del(`email_verified:${email}`);

    // Return success response (excluding password)
    const { password: _, ...userWithoutPassword } = newUser;
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