import NextAuth from 'next-auth';
import Google from 'next-auth/providers/google';
import Discord from 'next-auth/providers/discord';
import Twitch from 'next-auth/providers/twitch';
import { connectDB } from '@/lib/db';
import User from '@/lib/models/userModel';

console.log(' nextauth_url   ---->', process.env.NEXTAUTH_URL);
export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [Google, Discord, Twitch],
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    async signIn({ profile }) {
      console.log(' signin - BEFORE db connect  ');
      await connectDB();
      console.log(' signin - AFTER db connect  ');
      let existingUser = await User.findOne({ email: profile.email }).lean();

      if (!existingUser) {
        console.log(' signin - no existing user  ');
        const newUser = await User.create({ email: profile.email }).lean();
        console.log(' signin - new user created! ---> ', newUser);
        //   Column.create({
        //     userId: newUser._id,
        //     title: 'Backlog',
        //     onBoard: true,
        //     position: 0,
        //   });
      }
      return true;
    },
    async jwt({ token, user }) {
      console.log(' jwt - user -->', user);
      console.log(' jwt - token -->', token);
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
      console.log(' session  - args -->', session.user.email);
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
