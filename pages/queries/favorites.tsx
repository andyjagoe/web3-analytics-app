import {
  Container
} from '@mui/material'
import {useTheme} from '@mui/material/styles'
import type { NextPage } from 'next'
import Head from 'next/head'
import { useSession } from "next-auth/react"
import MyTabs from '../../components/MyTabs.jsx'
import LoadingPage from '../../components/LoadingPage.jsx'
import { useRouter } from 'next/router'
import PageNav from '../../components/PageNav.jsx'


const FavoriteQueries: NextPage = () => {
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
    <Container maxWidth={false}>
      <Head>
        <title>Web3 Analytics - My Favorite Queries</title>
        <meta name="description" content="My favorite queries for apps that use decentralized web3 analytics." />
      </Head>

      <PageNav category="Queries" />

      <MyTabs tabType="QUERIES" tabSelected={1} />

    </Container>
  )
}

export default FavoriteQueries;