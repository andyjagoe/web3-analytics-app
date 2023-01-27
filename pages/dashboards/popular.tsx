import {
  Container
} from '@mui/material'
import {useTheme} from '@mui/material/styles'
import type { NextPage } from 'next'
import Head from 'next/head'
import { useSession } from "next-auth/react"
import MyTabs from '../../components/MyTabs.jsx'
import LoadingPage from '../../components/LoadingPage.jsx'
import PageNav from '../../components/PageNav.jsx'


const PopularDashboards: NextPage = () => {
  const { data: session, status } = useSession()
  const theme = useTheme();

  if (status === "loading") {
    return <LoadingPage />
  }

  return (
    <Container maxWidth={false}>
      <Head>
        <title>Web3 Analytics - Popular Dashboards</title>
        <meta name="description" content="Popular dashboards for apps that use decentralized web3 analytics." />
      </Head>

      <PageNav category="Dashboards" />

      <MyTabs tabType="DASHBOARDS" tabSelected={0} />     

    </Container>
  )
}

export default PopularDashboards;