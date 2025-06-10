import { NextRequest, NextResponse } from 'next/server';
import { UserModel } from '@/models/User';
import { ObjectId } from 'mongodb';
import { writeFile, unlink } from 'fs/promises';
import { join } from 'path';
import sharp from 'sharp';
import { AppConfigModel } from '@/models/AppConfig';
import { mkdir } from 'fs/promises';
import { authOptions } from '@/config';
import { getServerSession } from 'next-auth';


// Configure upload directory
const uploadDir = join(process.cwd(), 'public', 'uploads', 'avatars');

// Ensure upload directory exists
async function ensureUploadDirExists() {
  try {
    await mkdir(uploadDir, { recursive: true });
  } catch (error) {
    console.error('Error creating upload directory:', error);
  }
}

// Call this when the module is loaded
ensureUploadDirExists();

/**
 * Avatar upload API route
 * Handles uploading and updating user avatar
 * 
 * Note: Authentication is handled by the middleware
 */
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = session.user.id;
    
    // Parse multipart form data
    const formData = await request.formData();

    // Extract avatar file
    const avatarFile = formData.get('avatar') as File | null;
    
    if (!avatarFile) {
      return NextResponse.json(
        { error: 'No avatar file provided' },
        { status: 400 }
      );
    }
    
    // Connect to database
    
    // Find the user
    const user = await UserModel.findOne({ _id: new ObjectId(userId) });
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    
    // Handle avatar upload
    try {
      // Get allowed image types from app config
      const appConfig = await AppConfigModel.findOne({});
      const allowedImgUploadTypes = appConfig?.image_upload_types || [
        'image/jpeg', 'image/png', 'image/webp', 'image/jpg'
      ];
      
      // Validate file type
      if (!allowedImgUploadTypes.includes(avatarFile.type)) {
        return NextResponse.json(
          { error: `Unsupported file type: ${avatarFile.type}` },
          { status: 400 }
        );
      }
      
      // Generate filename
      const timestamp = Date.now();
      const extension = avatarFile.name.split('.').pop();
      const filename = `avatar_${userId}_${timestamp}.${extension}`;
      const filepath = join(uploadDir, filename);
      
      // Process and save the file
      const arrayBuffer = await avatarFile.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      
      let compressedBuffer: Buffer;
      
      switch (avatarFile.type) {
        case 'image/png':
          compressedBuffer = await sharp(buffer)
            .resize(400, 400, { fit: 'cover' })
            .png({ compressionLevel: 9 })
            .toBuffer();
          break;
        
        case 'image/jpeg':
        case 'image/jpg':
          compressedBuffer = await sharp(buffer)
            .resize(400, 400, { fit: 'cover' })
            .jpeg({ quality: 90, mozjpeg: true })
            .toBuffer();
          break;
        
        case 'image/webp':
          compressedBuffer = await sharp(buffer)
            .resize(400, 400, { fit: 'cover' })
            .webp({ quality: 90 })
            .toBuffer();
          break;
        
        default:
          compressedBuffer = buffer;
      }
      
      await writeFile(filepath, compressedBuffer);
      
      // Delete old avatar file if it exists
      // Note: This is a simplified approach. In production, you might want to use a storage service
      // that handles file deletion automatically or implement a more robust cleanup mechanism.
      if (user.avatar && user.avatar.startsWith('/uploads/avatars/')) {
        try {
          const oldFilePath = join(process.cwd(), 'public', user.avatar);
          // You could use unlink from fs/promises to delete the file
          await unlink(oldFilePath);
          console.log(`Previous avatar could be deleted: ${oldFilePath}`);
        } catch (error) {
          console.error('Error deleting old avatar:', error);
          // Continue even if deletion fails
        }
      }
      
      // Store the avatar path
      const avatarUrl = `/uploads/avatars/${filename}`;
      
      // Update user in database
      const result = await UserModel.updateOne(
        { _id: new ObjectId(userId) },
        { 
          $set: { 
            image: avatarUrl,
            updatedAt: new Date()
          } 
        }
      );
      
      if (result.modifiedCount === 0) {
        return NextResponse.json(
          { error: 'Failed to update avatar' },
          { status: 500 }
        );
      }
      
      return NextResponse.json({
        success: true,
        message: 'Avatar updated successfully',
        avatarUrl: avatarUrl,
      });
      
    } catch (error) {
      console.error('Avatar upload error:', error);
      return NextResponse.json(
        { error: 'Failed to upload avatar' },
        { status: 500 }
      );
    }
    
  } catch (error) {
    console.error('Avatar upload error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}