import { useEffect, useState } from 'react'
import {
  Breadcrumbs,
  Typography,
  Container,
  Grid,
  Avatar,
  TextField,
  Link
} from '@mui/material'
import LoadingButton from '@mui/lab/LoadingButton'
import QueryStatsIcon from '@mui/icons-material/QueryStats'
import {useTheme} from '@mui/material/styles'
import type { NextPage } from 'next'
import Head from 'next/head'
import { useSession, signIn } from "next-auth/react"
import LoadingPage from '../../components/LoadingPage.jsx'
import { useRouter } from 'next/router'
import axios from 'axios'


const NewQuery: NextPage = () => {
  const [appName, setAppName] = useState("")
  const [disable, setDisabled] = useState(true)
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const theme = useTheme()
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
        signIn()
    },
  })

  const formValidation = () => {   
    if (appName == ""
        ) {
      return true
    } else {
      return false
    }
  }

  useEffect(() => {
    setDisabled(formValidation())
  }, [appName])

  if (status === "loading") {
    return <LoadingPage />
  }

  const createQuery = async () => {
    setLoading(true)

    try {
      const response = await axios({
        method: 'put',
        url: '/api/queries',
        data: {
            name: appName
        }
      })
      if (response.status === 201) {
        router.push(`/users/${session?.user?.id}/query/${response.data.slug}`)
      }
    } catch (error) {
        console.log(error)
        setLoading(false)
    }

    setLoading(false)
  }


  return (
    <div>
      <Head>
        <title>Web3 Analytics - New Query</title>
        <meta name="description" content="Create a new query for a decentralized web3 analytics app." />
      </Head>

      <Breadcrumbs aria-label="breadcrumb" sx={{ marginTop: theme.spacing(4)}}>
          <Link 
              color="inherit"
              onClick={() => {router.push('/')}} 
          >
              Home
          </Link>
          <Link 
              color="inherit" 
              onClick={() => {router.push('/queries/popular')}} 
          >
              Queries
          </Link>
          <Typography color="textPrimary">New</Typography>
      </Breadcrumbs>

      <Container maxWidth="xs">
        <Grid 
            container 
            direction="column"
            alignItems="center"
            justifyContent="center"
            sx={{ marginTop: theme.spacing(4), marginBottom: theme.spacing(2)}}
        >
            <Grid item xs={12}>
            <Avatar sx={{
                margin: theme.spacing(1),
                backgroundColor: theme.palette.secondary.main,
            }}>
                <QueryStatsIcon />
            </Avatar>
            </Grid>
            <Grid item xs={12}>
            <Typography component="h1" variant="h5">
                New Query
            </Typography>
            </Grid>
        </Grid>

        <Grid container spacing={2}>
          <Grid item xs={12}>
              <TextField
                  autoFocus
                  name="name"
                  variant="outlined"
                  fullWidth
                  id="name"
                  label="Query name"
                  value={appName}
                  onChange={e => setAppName(e.target.value)}
                  inputProps={{ style: { fontSize: "0.95rem" } }}
              />
          </Grid>
          <Grid item xs={12}>
              <LoadingButton
                  fullWidth
                  disabled={disable}
                  variant="contained"
                  loading={loading}
                  onClick={() => createQuery() }
              >
                  Create Query
              </LoadingButton>
          </Grid>

        </Grid>

      </Container>

    </div>
  )
}

export default NewQuery;