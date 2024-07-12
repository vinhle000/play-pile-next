import NextAuth from 'next-auth';
import Google from 'next-auth/providers/google';
import Credentials from 'next-auth/providers/credentials';
import { connectDB } from '@/lib/db';
import User from '@/lib/models/userModel';
import Column from '@/lib/models/columnModel';
import mongoose from 'mongoose';

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [Google],
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    async signIn({ user, account, profile }) {
      await connectDB();
      let existingUser = await User.findOne({ email: profile.email });

      if (!existingUser) {
        const newUser = await User.create({ email: profile.email });

        // Create initial three columns for the user.
        const defaultColumnTitles = ['Backlog', 'Playing', 'Done'];

        for (const [index, title] of defaultColumnTitles.entries()) {
          await Column.create({
            userId: newUser._id,
            title: title,
            onBoard: true,
            position: index,
          });
        }
      }
      return true;
    },
    async jwt({ token, user, account }) {
      if (user) {
        await connectDB();
        const existingUser = await User.findOne({ email: user.email });
        if (existingUser) {
          token.id = existingUser._id.toString(); // Convert ObjectId to string
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (token?.id) {
        try {
          // Convert string back to ObjectId, otherwise set to null
          session.user.id = new mongoose.Types.ObjectId(token.id);
        } catch (error) {
          console.error('Error converting to ObjectId:', error);
          session.user.id = null;
        }
      }
      return session;
    },
  },
});
