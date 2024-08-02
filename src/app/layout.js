import '../styles/globals.css';
import { SessionProvider } from 'next-auth/react';
import UserGamesProvider from './providers/UserGamesProvider';
import NavigationBar from '@/components/NavigationBar';

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <SessionProvider>
          <UserGamesProvider>
            <div className="min-h-screen">
              <NavigationBar />
              <main>{children}</main>
            </div>
          </UserGamesProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
