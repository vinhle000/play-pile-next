import NextAuth from 'next-auth';
import Google from 'next-auth/providers/google';
import Credentials from 'next-auth/providers/credentials';
import { connectDB } from '@/lib/db';
import User from '@/lib/models/userModel';
import Column from '@/lib/models/columnModel';

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [Google],
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
  async jwt({ token, user }) {
    if (user) {
      const existingUser = await User.findOne({ email: user.email });
      token.id = existingUser._id;
    }
    return token;
  },
  async session({ session, token }) {
    session.user.id = token.id;
    return session;
  },
});
