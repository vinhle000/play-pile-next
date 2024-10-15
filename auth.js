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
      await connectDB();
      let existingUser = await User.findOne({ email: profile.email });

      if (!existingUser) {
        const newUser = await User.create({ email: profile.email });
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
        session.user.id = token.id;
      }
      return session;
    },
    async redirect({ url, baseUrl }) {
      return baseUrl + '/board';
    },
  },
});
