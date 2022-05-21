import '../styles/globals.css'
import Head from 'next/head';
import { AppProps } from 'next/app'
import Layout from '../components/layout'
import { ThemeProvider } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import { CacheProvider, EmotionCache } from '@emotion/react';
import theme from '../src/theme';
import createEmotionCache from '../src/createEmotionCache';
import { SessionProvider } from "next-auth/react"


// Client-side cache, shared for the whole session of the user in the browser.
const clientSideEmotionCache = createEmotionCache();

interface MyAppProps extends AppProps {
  emotionCache?: EmotionCache;
}


function MyApp(props:MyAppProps) {
  const { Component, emotionCache = clientSideEmotionCache, 
    pageProps: { session, ...pageProps } } = props;
  return (
    <SessionProvider session={session}>
      <CacheProvider value={emotionCache}>
        <Head>
          <meta name="viewport" content="initial-scale=1, width=device-width" />
        </Head>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </ThemeProvider>
      </CacheProvider>
    </SessionProvider>
  )
}

export default MyApp