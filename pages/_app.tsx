import '../styles/globals.css'
import Head from 'next/head';
import { AppProps } from 'next/app'
import Layout from '../components/Layout.js'
import { ThemeProvider } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import { CacheProvider, EmotionCache } from '@emotion/react'
import theme from '../src/theme'
import createEmotionCache from '../src/createEmotionCache'
import { SessionProvider } from "next-auth/react"
import { 
  WagmiConfig, 
  createClient, 
  configureChains,
} from 'wagmi'
import { alchemyProvider } from 'wagmi/providers/alchemy'
import { publicProvider } from 'wagmi/providers/public'
import { InjectedConnector } from 'wagmi/connectors/injected'
import { MetaMaskConnector } from 'wagmi/connectors/metaMask'
import { WalletConnectConnector } from 'wagmi/connectors/walletConnect'
import { getSupportedChains } from '../src/utilities.jsx'

const alchemyId = process.env.NEXT_PUBLIC_ALCHEMY_ID

const { chains, provider, webSocketProvider } = configureChains(
  getSupportedChains(), [
  alchemyProvider({ alchemyId }),
  publicProvider(),
])

// Set up client
const client = createClient({
  autoConnect: true,
  connectors: [
    new MetaMaskConnector({ chains }),
    new WalletConnectConnector({
      chains,
      options: {
        qrcode: true,
      },
    }),
    new InjectedConnector({
      chains,
      options: { name: 'Injected' },
    }),
  ],
  provider,
  webSocketProvider,
})

// Client-side cache, shared for the whole session of the user in the browser.
const clientSideEmotionCache = createEmotionCache();

interface MyAppProps extends AppProps {
  emotionCache?: EmotionCache;
}


function MyApp(props:MyAppProps) {
  const { Component, emotionCache = clientSideEmotionCache, 
    pageProps: { session, ...pageProps } } = props;
  return (
    <WagmiConfig client={client}>
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
    </WagmiConfig>
  )
}

export default MyApp