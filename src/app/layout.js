import '../styles/globals.css';
import { SessionProvider } from 'next-auth/react';
import NavigationBar from '@/components/NavigationBar';

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <SessionProvider>
          <div className="min-h-screen">
            <NavigationBar />
            <main>{children}</main>
          </div>
        </SessionProvider>
      </body>
    </html>
  );
}
