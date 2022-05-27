import {
  Avatar,
  Breadcrumbs,
  Typography,
  Grid,
  Button,
  TextField,
} from '@mui/material'
import {
    useAccount,
    useConnect,
    useDisconnect,
    useNetwork,
    useContractWrite,
    chain
} from 'wagmi'
import Web3Analytics from "../../src/Web3Analytics.json"
import AppRegistrationIcon from '@mui/icons-material/AppRegistration'
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet'
import Alert from '@mui/material/Alert'
import {useTheme} from '@mui/material/styles'
import type { NextPage } from 'next'
import Head from 'next/head'
import { useSession, signIn } from "next-auth/react"
import Link from '../../src/Link'
import LoadingPage from '../../components/LoadingPage.jsx'
import { useRouter } from 'next/router'


const NewApp: NextPage = () => {
    const theme = useTheme()
    const { data: account } = useAccount()
    const { 
        connect, 
        connectors, 
        error: connectError, 
        isConnecting, 
        pendingConnector 
    } = useConnect()
    const {
        activeChain,
        chains,
        isLoading,
        pendingChainId,
        switchNetwork,
    } = useNetwork()
    const { 
        data: registerAppData, 
        error: registerAppError,
        isError: isRegisterAppError,
        isLoading: registerAppLoading,
        write: registerAppWrite } = useContractWrite(
        {
          addressOrName: process.env.NEXT_PUBLIC_WEB3ANALYTICS as string,
          contractInterface: Web3Analytics,
        },
        'registerApp',
        {
            onSuccess(data) {
                console.log('Success', data)
                //write to database to associated app with user

                //redirect to new app page
                router.push('/apps/mine')
            },
        }
    )
    const { disconnect } = useDisconnect()
    const router = useRouter()
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
            <title>Web3 Analytics - New App</title>
            <meta name="description" content="Create a new decentralized web3 analytics app." />
        </Head>

        <Breadcrumbs aria-label="breadcrumb" sx={{ marginTop: theme.spacing(4)}}>
            <Link color="inherit" href="/">Home</Link>
            <Link color="inherit" href="/apps/popular">Apps</Link>
            <Typography color="textPrimary">New</Typography>
        </Breadcrumbs>

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
                {account? <AppRegistrationIcon />:<AccountBalanceWalletIcon />}
            </Avatar>
            </Grid>
            <Grid item xs={12}>
            <Typography component="h1" variant="h5">
                {account? "Register App":"Connect Wallet"}
            </Typography>
            </Grid>
        </Grid>

            {!account &&
                (<Grid container spacing={2}>
                    <Grid item xs={12}>
                        {connectors.map((connector) => (
                            <Button
                                disabled={!connector.ready}
                                fullWidth
                                variant="outlined"
                                key={connector.id}
                                onClick={() => connect(connector)}
                            >
                            {connector.name}
                            {!connector.ready && ' (unsupported)'}
                            {isConnecting &&
                                connector.id === pendingConnector?.id &&
                                ' (connecting)'}
                            </Button>
                        ))}

                        {connectError && 
                        <Alert severity="error" sx={{marginTop: theme.spacing(4)}}>
                            {connectError.message}
                        </Alert>
                        }
                    </Grid>
                </Grid>
                )
            }

            {account &&
                (<>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <TextField
                                name="address"
                                variant="outlined"
                                disabled
                                fullWidth
                                id="address"
                                label="Address"
                                helperText="We recommend you create a new wallet address for your app."                                
                                value={account?.address}
                                inputProps={{ style: { fontSize: "0.95rem" } }}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                name="network"
                                variant="outlined"
                                disabled
                                fullWidth
                                error={!chains.find(({ id }) => id 
                                    === activeChain?.id) ? true:false
                                }
                                id="network"
                                label="Network"
                                helperText={activeChain?.id !== chain.polygon.id ? 
                                    "Network not supported. Switch to a supported network.":""
                                }
                                value={activeChain?.name}
                                inputProps={{ style: { fontSize: "0.95rem" } }}
                            />
                        </Grid>
                        {!chains.find(({ id }) => id === activeChain?.id) && (
                            <Grid item xs={12}>
                                <Typography variant="overline" display="block" gutterBottom>
                                    Supported networks
                                </Typography>
                                {chains.map((x) => (
                                    <Button
                                        disabled={!switchNetwork || x.id === activeChain?.id}
                                        fullWidth
                                        variant="outlined"
                                        key={x.id}
                                        onClick={() => switchNetwork?.(x.id)}
                                    >
                                    Switch to {x.name}
                                    {isLoading && pendingChainId === x.id && ' (switching)'}
                                    </Button>
                                ))}
                            </Grid>
                        )}
                        {chains.find(({ id }) => id === activeChain?.id) && (
                            <Grid item xs={12}>
                                <Button
                                    fullWidth
                                    disabled={registerAppLoading}
                                    variant="contained"
                                    onClick={() => registerAppWrite() }
                                >
                                    Register App
                                </Button>
                            </Grid>
                        )}
                        <Grid item xs={12}>
                            <Button
                                fullWidth
                                variant="outlined"
                                color="error"
                                onClick={() => disconnect()}
                            >
                                Disconnect
                            </Button>
                        </Grid>
                    </Grid>

                    {isRegisterAppError && registerAppError && (
                        <Alert severity="error" sx={{marginTop: theme.spacing(4)}}>
                            {registerAppError.message}
                        </Alert>
                    )}
                </>
                )
            }

        </div>
    )}

export default NewApp;