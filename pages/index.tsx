import {
  Typography,
  Grid,
  Stack,
  Button,
  Link
} from '@mui/material'
import {useTheme} from '@mui/material/styles'
import type { NextPage } from 'next'
import Head from 'next/head'
import { useSession } from "next-auth/react"
import styles from '../styles/Home.module.css' assert { type: 'css' }
import { useRouter } from 'next/router'
import Image from 'next/image'
import dashboardPic from '../public/static/images/dashboard.png'
import queryPic from '../public/static/images/query.png'
import queryTwoPic from '../public/static/images/query2.png'


const Home: NextPage = () => {
  const { data: session, status } = useSession()
  const theme = useTheme();
  const router = useRouter()

  return (
    <div>
      <Head>
        <title>Web3 Analytics</title>
        <meta name="description" content="A decentralized analytics platform where users own their data." />
      </Head>

      <Typography 
        component="h1" 
        variant="h2"             
        sx={{ 
          marginTop: theme.spacing(8),
          textAlign: 'center'
        }}
      >
        Privacy Preserving Analytics
      </Typography>
      <Typography variant="subtitle1" className={styles.description}>
        Product insights that everyone can trust.
      </Typography>
      <Grid 
        container 
        direction="row" 
        sx={{ 
          marginTop: theme.spacing(4),           
        }}>
          <Grid item xs={12} sx={{ textAlign: 'center'}} width='100%'>
            <Button
                variant="contained"
                size="large"
                onClick={() => {router.push('/apps/new')}}
            >
                Get Started
            </Button>
            <Link 
              variant="button" 
              color="textPrimary" 
              href="https://web3-analytics.gitbook.io/product-docs/"
              target="_blank"
              sx={{ margin: '20px 20px', textDecoration: 'none' }}
            >
              Learn more
            </Link>
          </Grid>
          <Grid item xs={12} sx={{padding: theme.spacing(2), textAlign: 'center'}} width='100%'>
          </Grid>
        </Grid>
        

      <Grid 
        container 
        direction="row" 
        sx={{ 
          marginTop: theme.spacing(10),           
        }}>
        <Grid item sm={12} md={4} sx={{ padding: theme.spacing(4), backgroundColor: '#F3F6F9'}} width='100%'>
          <Stack spacing={0}>
            <Typography variant="body2" gutterBottom>
              <strong>Build Trust</strong>
            </Typography>
            <Typography variant="h4" gutterBottom>  
              Dashboards for Everyone               
            </Typography>
            <Typography variant="body2" gutterBottom>
              Make your off-chain data as transparent as your on-chain data. Sharing is easier when anyone can create queries and dashboards because all data is open.
            </Typography>            
          </Stack>
        </Grid>
        <Grid item sm={12} md={8} sx={{ backgroundColor: '#F3F6F9'}}>
          <div style={{ 
            borderRadius: '2%', 
            overflow: 'hidden', 
            margin: theme.spacing(4)
          }}>
            <Image
              src={dashboardPic}
              alt="Sample Dashboard"
            />
          </div>
        </Grid>
      </Grid>

      <Grid 
        container 
        direction="row-reverse" 
        sx={{ 
          marginTop: theme.spacing(5),           
        }}>

        <Grid item sm={12} md={4} sx={{ padding: theme.spacing(4)}} width='100%'>
          <Stack spacing={0}>
            <Typography variant="body2" gutterBottom>
              <strong>A Public Good</strong>
            </Typography>
            <Typography variant="h4" gutterBottom>
              Users own their data
            </Typography>
            <Typography variant="body2" gutterBottom>
              An anonymous keypair is generated for every app and used to securely write data to a decentralized data store. Anyone can read this data, but only the user who created it can delete it.
            </Typography>            
          </Stack>
        </Grid>
        <Grid item sm={12} md={8}>
          <div style={{ 
            borderRadius: '2%', 
            overflow: 'hidden', 
            margin: theme.spacing(4)
          }}>
            <Image
              src={queryTwoPic}
              alt="Sample Query For Specific User"
            />
          </div>
        </Grid>        
    </Grid>

    <Grid 
      container 
      direction="row" 
      sx={{ 
        marginTop: theme.spacing(5),           
      }}>
      <Grid item sm={12} md={4} sx={{ padding: theme.spacing(4), backgroundColor: '#255c99'}} width='100%'>
        <Stack spacing={0}>
          <Typography variant="body2" gutterBottom sx={{color: '#fff'}}>
            <strong>Decentralized</strong>
          </Typography>
          <Typography variant="h4" gutterBottom sx={{color: '#fff'}}>
            Aggregate across clients
          </Typography>
          <Typography variant="body2" gutterBottom sx={{color: '#fff'}}>
            Does your protocol have competitive clients from separate teams? Web3 Analytics can aggregate impressions, clicks, and conversions across all clients and ensure everyone can trust the data.
          </Typography>            
        </Stack>
      </Grid>
      <Grid item sm={12} md={8} sx={{ backgroundColor: '#255c99'}}>
        <div style={{ 
          borderRadius: '2%', 
          overflow: 'hidden', 
          margin: theme.spacing(4)
        }}>
          <Image
            src={queryPic}
            alt="Sample Query"
          />
        </div>
      </Grid>
    </Grid>


    </div>
  )
}

export default Home;