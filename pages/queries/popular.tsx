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


const PopularQueries: NextPage = () => {
  const { data: session, status } = useSession()
  const theme = useTheme();

  return (
    <div>
      <Head>
        <title>Web3 Analytics - Popular Queries</title>
        <meta name="description" content="Popular queries for apps that use decentralized web3 analytics." />
      </Head>

      <Breadcrumbs aria-label="breadcrumb" sx={{ marginTop: theme.spacing(4)}}>
        <Link color="inherit" href="/">Home</Link>
        <Typography color="textPrimary">Queries</Typography>
      </Breadcrumbs>

      <MyTabs tabType="QUERIES" tabSelected={0} />     

    </div>
  )
}

export default PopularQueries;