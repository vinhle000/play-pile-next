import { NextResponse } from 'next/server';
import User from '@/lib/models/userModel';
import { connectDB } from '@/lib/db';
import { auth } from '@/auth';

connectDB();

export default async function handler(req, res) {
  try {
    const session = await auth();
    console.log('SESSION -----> ', session);

    if (!session) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    if (req.method === 'GET') {
      const user = await User.findById(session.user.id);
      console.debug('able to get user -----> ', user);

      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      return res.status(200).json({ user });
    } else {
      return res.status(405).json({ message: 'Method Not Allowed' });
    }
  } catch (error) {
    console.error('Error occurred getting user by id:', error);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
}
