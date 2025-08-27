// pages/_app.tsx
import type { AppProps } from 'next/app';
import LoadingSpinner from '../components/LoadingSpinner';
import '../styles/globals.css';

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <LoadingSpinner />
      <Component {...pageProps} />
    </>
  );
}

export default MyApp;