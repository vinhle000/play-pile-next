import '../styles/globals.css';
import { SessionProvider } from 'next-auth/react';
import UserGamesProvider from './providers/UserGamesProvider';
import ColumnsProvider from './providers/ColumnsProvider';
import NavigationBar from '@/components/NavigationBar';

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <SessionProvider>
          <UserGamesProvider>
            <ColumnsProvider>
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
