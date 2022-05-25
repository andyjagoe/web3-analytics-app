import * as React from 'react'
import {
  Breadcrumbs,
  Typography,
} from '@mui/material'
import {useTheme} from '@mui/material/styles'
import type { NextPage } from 'next'
import Head from 'next/head'
import { useSession } from "next-auth/react"
import Link from '../../src/Link'
import MyTabs from '../../components/MyTabs.jsx'
import LoadingPage from '../../components/LoadingPage.jsx'
import { useRouter } from 'next/router'


const FavoriteApps: NextPage = () => {
  const theme = useTheme();
  const router = useRouter()
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      router.push(`/`)
    },
  })

  if (status === "loading") {
    return <LoadingPage />
  }

  return (
    <div>
      <Head>
        <title>Web3 Analytics - My Favorite Apps</title>
        <meta name="description" content="My favorite apps that use decentralized web3 analytics." />
      </Head>

      <Breadcrumbs aria-label="breadcrumb" sx={{ marginTop: theme.spacing(4)}}>
        <Link color="inherit" href="/">Home</Link>
        <Typography color="textPrimary">Apps</Typography>
      </Breadcrumbs>

      <MyTabs tabType="APPS" tabSelected={2} />

    </div>
  )
}

export default FavoriteApps;