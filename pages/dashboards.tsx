import * as React from 'react'
import {
  Breadcrumbs,
  Typography,
} from '@mui/material'
import {useTheme} from '@mui/material/styles'
import type { NextPage } from 'next'
import Head from 'next/head'
import { useSession } from "next-auth/react"
import Link from '../src/Link'
import MyTabs from '../components/MyTabs.jsx'


const Dashboards: NextPage = () => {
  const { data: session, status } = useSession()
  const theme = useTheme();

  return (
    <div>
      <Head>
        <title>Web3 Analytics - Dashboards</title>
        <meta name="description" content="Popular and trending dashboards for apps using decentralized web3 analytics." />
      </Head>

      <Breadcrumbs aria-label="breadcrumb" sx={{ marginTop: theme.spacing(4)}}>
        <Link color="inherit" href="/">Home</Link>
        <Typography color="textPrimary">Dashboards</Typography>
      </Breadcrumbs>

      <MyTabs tabType="DASHBOARDS" />

    </div>
  )
}

export default Dashboards;