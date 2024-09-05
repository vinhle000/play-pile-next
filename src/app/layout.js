import '../styles/globals.css';
import ClientSessionProvider from './providers/ClientSessionProvider.jsx';
import UserGamesProvider from './providers/UserGamesProvider';
import ColumnsProvider from './providers/ColumnsProvider';
import { getColumns, getColumnsOnBoard } from '@/lib/utils/column-utils';
import {
  getUserGamesInPlayPile,
  getUserGamesOnBoard,
} from '@/lib/utils/user-game-utils';
import NavigationBar from '@/components/NavigationBar';
import mongoose from 'mongoose';
import { auth } from '@/auth';

export default async function RootLayout({ children }) {
  const session = await auth();

  let initialColumns = [];
  let initialColumnsOnBoard = [];
  let initialUserGames = [];
  let initialUserGamesOnBoard = {};
  if (session) {
    const userId = new mongoose.Types.ObjectId(session.user.id);

    initialColumns = await getColumns(userId);
    initialColumnsOnBoard = await getColumnsOnBoard(userId);
    initialUserGames = await getUserGamesInPlayPile(userId);
    initialUserGamesOnBoard = await getUserGamesOnBoard(userId);
  }

  return (
    <html lang="en">
      <body>
        <ClientSessionProvider session={session}>
          <UserGamesProvider
            initialUserGames={initialUserGames}
            initialUserGamesOnBoard={initialUserGamesOnBoard}
          >
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
        </ClientSessionProvider>
      </body>
    </html>
  );
}
