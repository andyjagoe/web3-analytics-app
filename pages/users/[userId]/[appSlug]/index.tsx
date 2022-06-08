import {
  Breadcrumbs,
  Typography,
  Grid,
} from '@mui/material'
import Link from '../../../../src/Link'
import {useTheme} from '@mui/material/styles'
import type { NextPage } from 'next'
import Head from 'next/head'
import { useRouter } from 'next/router'
import useUser from "../../../../hooks/useUser.jsx"

  
const AppPage: NextPage = () => {
  const theme = useTheme()
  const router = useRouter()
  const { userId, appSlug } = router.query
  const {myUser} = useUser(userId)

  return (
    <div>
      <Head>
        <title>Web3 Analytics</title>
        <meta name="description" content="A decentralized analytics platform where users own their data." />
      </Head>

      <Grid container direction="row" sx={{ marginTop: theme.spacing(4), alignItems: 'center'}}>
      <Grid item xs={12}>
        <Grid container>
          <Breadcrumbs aria-label="breadcrumb">
            <Link color="inherit" href="/">Home</Link>
            <Link color="inherit" href={`/users/${userId}`}>
              {myUser?.Item?.name? myUser.Item.name:userId}
            </Link>
            <Typography color="textPrimary">{ appSlug }</Typography>
          </Breadcrumbs>
        </Grid>
      </Grid>
    </Grid>

    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Typography variant="body2">
        </Typography>              
        <Typography component="h1" variant="h3">
        </Typography>
      </Grid>
    </Grid>

    <Typography variant="subtitle1">
      App page: { appSlug }
    </Typography>

    </div>
  )
}

export default AppPage;