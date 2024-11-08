import NextAuth from 'next-auth';
import Google from 'next-auth/providers/google';
import Discord from 'next-auth/providers/discord';
import Twitch from 'next-auth/providers/twitch';
import { connectDB } from '@/lib/db';
import User from '@/lib/models/userModel';

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [Google, Discord, Twitch],
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    async signIn({ profile }) {
      console.log(' signin - BEFORE db connect  ');
      await connectDB();

      let existingUser = await User.findOne({ email: profile.email }).lean();

      if (!existingUser) {
        const newUser = await User.create({ email: profile.email }).lean();
        // NOTE: May have caused slow down and timeout longer than vercel allows. Removing for if necessary.
        Column.create({
          userId: newUser._id,
          title: 'Backlog',
          onBoard: true,
          position: 0,
        });
      }
      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        await connectDB();
        const existingUser = await User.findOne({ email: user.email }).lean();
        if (existingUser) {
          token.id = existingUser._id.toString(); // Convert ObjectId to string
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (token?.id) {
        session.user.id = token.id;
      }
      return session;
    },
    async redirect({ url, baseUrl }) {
      return baseUrl + '/board';
    },
  },
});
