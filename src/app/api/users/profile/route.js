import { auth } from '@/auth';
import { NextResponse } from 'next/server';
import User from '@/lib/models/userModel';
import { connectDB } from '@/lib/db';
import mongoose from 'mongoose';
export const dynamic = 'force-dynamic';

export async function GET(request) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json(
        { message: 'Not Authorized, no session' },
        { status: 401 },
      );
    }
    const userId = new mongoose.Types.ObjectId(session.user.id);
    await connectDB();
    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json(
        { message: 'User does not exist' },
        { status: 403 },
      );
    }

    return NextResponse.json(user, { status: 200 }); // Modify to only include necessary info
  } catch (error) {
    console.error('Error getting User info:', error);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}
