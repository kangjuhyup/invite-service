import '@mantine/core/styles.css';
import '@mantine/dropzone/styles.css';
import { MantineProvider } from '@mantine/core';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { AppProps } from 'next/app';

const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <MantineProvider>
      <GoogleOAuthProvider clientId={googleClientId}>
        <Component {...pageProps} />
      </GoogleOAuthProvider>
    </MantineProvider>
  );
}
