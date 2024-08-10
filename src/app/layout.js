import '../styles/globals.css';
import { SessionProvider } from 'next-auth/react';
import UserGamesProvider from './providers/UserGamesProvider';
import ColumnsProvider from './providers/ColumnsProvider';
import { getColumns, getColumnsOnBoard } from '@/lib/utils/column-utils';
import NavigationBar from '@/components/NavigationBar';
import mongoose from 'mongoose';
import { auth } from '@/auth';

export default async function RootLayout({ children }) {
  const session = await auth();

  let initialColumns = [];
  let initialColumnsOnBoard = [];
  if (session) {
    const userId = new mongoose.Types.ObjectId(session.user.id);

    initialColumns = await getColumns(userId);
    initialColumnsOnBoard = await getColumnsOnBoard(userId);
  }

  return (
    <html lang="en">
      <body>
        <SessionProvider>
          <UserGamesProvider>
            <ColumnsProvider
              initialColumns={initialColumns}
              initialColumnsOnBoard={initialColumnsOnBoard}
            >
              <div className="min-h-screen">
                <NavigationBar />
                <main>{children}</main>
              </div>
            </ColumnsProvider>
          </UserGamesProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
