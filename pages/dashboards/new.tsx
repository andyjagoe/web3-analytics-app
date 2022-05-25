import {
  Breadcrumbs,
  Typography,
} from '@mui/material'
import {useTheme} from '@mui/material/styles'
import type { NextPage } from 'next'
import Head from 'next/head'
import { useSession, signIn } from "next-auth/react"
import Link from '../../src/Link'
import LoadingPage from '../../components/LoadingPage.jsx'


const NewDashboard: NextPage = () => {
  const theme = useTheme()
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
        signIn()
    },
  })

  if (status === "loading") {
    return <LoadingPage />
  }

  return (
    <div>
      <Head>
        <title>Web3 Analytics - New Dashboard</title>
        <meta name="description" content="Create a new dashboard for a decentralized web3 analytics app." />
      </Head>

      <Breadcrumbs aria-label="breadcrumb" sx={{ marginTop: theme.spacing(4)}}>
          <Link color="inherit" href="/">Home</Link>
          <Link color="inherit" href="/dashboards/popular">Dashboards</Link>
          <Typography color="textPrimary">New</Typography>
      </Breadcrumbs>
    </div>
  )
}

export default NewDashboard;