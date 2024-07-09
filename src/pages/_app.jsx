import '../styles/globals.css';
import { SessionProvider } from 'next-auth/react';
// import { UserProvider } from '../contexts/UserContext';
// import { UserPlayPileGamesProvider } from '../contexts/UserPlayPileGamesContext';
// import { ColumnsProvider } from '../contexts/ColumnsContext';
import NavigationBar from '@/components/NavigationBar';

function MyApp({ Component, pageProps }) {
  return (
    <div className="min-h-screen">
      <SessionProvider session={pageProps.session}>
        {/* <UserProvider> */}
          {/* <UserPlayPileGamesProvider> */}
            {/* <ColumnsProvider> */}
              <NavigationBar />
              <Component {...pageProps} />
            {/* </ColumnsProvider> */}
          {/* </UserPlayPileGamesProvider> */}
        {/* </UserProvider> */}
      </SessionProvider>
    </div>
  );
}

export default MyApp;