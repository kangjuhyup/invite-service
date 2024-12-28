'use client';

import '@mantine/core/styles.css';
import '@mantine/dropzone/styles.css';
import { AppShell, MantineProvider } from '@mantine/core';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { AppProps } from 'next/app';
import { LoginProvider } from '@/common/login.provider';
import Header from '@/components/header';

const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <MantineProvider>
      <GoogleOAuthProvider clientId={googleClientId}>
        <LoginProvider>
          <AppShell
            header={{ height: 60 }}
            footer={{ height: 50 }}
            padding="md"
          >
            <AppShell.Header>
              <Header />
            </AppShell.Header>
            <AppShell.Main>
              <Component {...pageProps} />
            </AppShell.Main>
          </AppShell>
        </LoginProvider>
      </GoogleOAuthProvider>
    </MantineProvider>
  );
}
