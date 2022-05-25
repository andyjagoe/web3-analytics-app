import {useTheme} from '@mui/material/styles'
import type { NextPage } from 'next'
import Head from 'next/head'
import { useSession } from "next-auth/react"
import MyTabs from '../../components/MyTabs.jsx'
import PageNav from '../../components/PageNav.jsx'
import LoadingPage from '../../components/LoadingPage.jsx'


const TrendingApps: NextPage = () => {
  const { data: session, status } = useSession()
  const theme = useTheme();

  if (status === "loading") {
    return <LoadingPage />
  }

  return (
    <div>
      <Head>
        <title>Web3 Analytics - Trending Apps</title>
        <meta name="description" content="Trending apps that use decentralized web3 analytics." />
      </Head>

      <PageNav category="Apps" />

      <MyTabs tabType="APPS" tabSelected={1} />     

    </div>
  )
}

export default TrendingApps;