import {
    Breadcrumbs,
    Typography,
    Grid,
    Avatar,
    Container
} from '@mui/material'
import Link from '../../../src/Link'
import {useTheme} from '@mui/material/styles'
import type { NextPage } from 'next'
import Head from 'next/head'
import { useRouter } from 'next/router'
import useUser from "../../../hooks/useUser.jsx"

  
  const UserPage: NextPage = () => {
  const theme = useTheme()
  const router = useRouter()
  const { userId } = router.query
  const {myUser} = useUser(userId)

  return (
    <Container>
      <Head>
        <title>Web3 Analytics - {myUser?.Item?.name? myUser.Item.name:userId}</title>
        <meta name="description" content="A decentralized analytics platform where users own their data." />
      </Head>

      <Grid 
        container 
        direction="row" 
        sx={{ marginTop: theme.spacing(4), marginLeft: theme.spacing(2), alignItems: 'center'
      }}>
      <Grid item xs={12}>
        <Grid container>
          <Breadcrumbs aria-label="breadcrumb">
            <Link color="inherit" href="/">Home</Link>
            <Typography color="textPrimary">
              {myUser?.Item?.name? myUser.Item.name:userId}
            </Typography>
          </Breadcrumbs>
        </Grid>
      </Grid>
    </Grid>

    <Grid 
        container 
        direction="column"
        alignItems="center"
        justifyContent="center"
        sx={{ marginTop: theme.spacing(8), marginBottom: theme.spacing(4)}}
      >
        <Grid item xs={12}>
          <Avatar 
            sx={{
              margin: theme.spacing(1),
              height: theme.spacing(10),
              width: theme.spacing(10)
            }}
            src={myUser?.Item?.image? myUser.Item.image:''}
          >
          </Avatar>
        </Grid>
        <Grid item xs={12}>
          <Typography component="h1" variant="h5">
            {myUser?.Item?.name? myUser.Item.name:userId}
          </Typography>
        </Grid>
      </Grid>

    </Container>
  )
}

export default UserPage;