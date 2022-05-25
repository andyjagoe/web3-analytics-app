import * as React from 'react'
import {Grid,
  Typography,
  Button,
  } from '@mui/material'
import {useTheme} from '@mui/material/styles'
import type { NextPage } from 'next'
import Head from 'next/head'
import { useSession } from "next-auth/react"
import styles from '../styles/Home.module.css' assert { type: 'css' }

const Home: NextPage = () => {
  const { data: session, status } = useSession()
  const theme = useTheme();

  return (
    <div>
      <Head>
        <title>Web3 Analytics</title>
        <meta name="description" content="A decentralized analytics platform where users own their data." />
      </Head>

      <Typography 
        component="h1" 
        variant="h2"             
        sx={{ 
          marginTop: theme.spacing(8),
          textAlign: 'center'
        }}
      >
        Analytics for Web3
      </Typography>
      <Typography variant="subtitle1" className={styles.description}>
        Decentralized. And users own their data.
      </Typography>

    </div>
  )
}

export default Home;