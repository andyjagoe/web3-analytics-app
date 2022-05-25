import {useTheme} from '@mui/material/styles'
import type { NextPage } from 'next'
import Head from 'next/head'
import { useSession } from "next-auth/react"
import MyTabs from '../../components/MyTabs.jsx'
import LoadingPage from '../../components/LoadingPage.jsx'
import PageNav from '../../components/PageNav.jsx'
import { useRouter } from 'next/router'


const PopularApps: NextPage = () => {
  const { data: session, status } = useSession()
  const router = useRouter()
  const theme = useTheme()
  const pathArray = router.asPath.split("/")

  if (status === "loading") {
    return <LoadingPage />
  }

  return (
    <div>
      <Head>
        <title>Web3 Analytics - Popular Apps</title>
        <meta name="description" content="Popular apps that use decentralized web3 analytics." />
      </Head>

      <PageNav category="Apps" />

      <MyTabs tabType="APPS" tabSelected={0} />     

    </div>
  )
}

export default PopularApps;