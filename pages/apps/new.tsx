import { useEffect, useState } from 'react'
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
    useSigner,
} from 'wagmi'
import { ethers } from "ethers"
import Web3Analytics from "../../schema/Web3Analytics.json"
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
import axios from 'axios'


const NewApp: NextPage = () => {
    const theme = useTheme()
    const [isAppRegistered, setIsAppRegistered] = useState(false);
    const [appName, setAppName] = useState("");
    const [appURL, setAppURL] = useState("");
    const { data: signer } = useSigner()
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
                //write to database to associate app with user

                //redirect to new app page
                //router.push('/apps/mine')
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
    

    useEffect(() => {
        if (signer) checkRegistration()
    }, [signer]);


    const checkRegistration = async () => {
        if (!signer || !process.env.NEXT_PUBLIC_WEB3ANALYTICS) return        
        const contract = new ethers.Contract(
            process.env.NEXT_PUBLIC_WEB3ANALYTICS,
            Web3Analytics,
            signer
        )
        setIsAppRegistered(await contract.isAppRegistered(account?.address))
    }

    const putApp = async (address:string) => {
        const response = await axios({
            method: 'put',
            url: '/api/app',
            data: {
                sk: address,
                name: appName,
                url: appURL,
            }
        })
        console.log(response)
        if (response.status === 201) {
            //Success. Go to new app page
            //TODO: Insert username in between /apps and /slug
            //router.push(`/apps/${response.data.slug}`)
            console.log("success")
        }
    }
    
    const isDisabled = () => {
        if (isAppRegistered) return true
        if (registerAppLoading) return true
        return false
    }


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
                                name="name"
                                variant="outlined"
                                fullWidth
                                id="name"
                                label="App name"
                                value={appName}
                                onChange={e => setAppName(e.target.value)}
                                inputProps={{ style: { fontSize: "0.95rem" } }}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                name="url"
                                variant="outlined"
                                fullWidth
                                id="url"
                                label="App URL"
                                value={appURL}
                                onChange={e => setAppURL(e.target.value)}
                                inputProps={{ style: { fontSize: "0.95rem" } }}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                name="address"
                                variant="outlined"
                                disabled
                                error={isAppRegistered}
                                fullWidth
                                id="address"
                                label="Address"
                                helperText={isAppRegistered? 
                                    "App already registered for this address. Please choose another.":
                                    "We recommend creating a dedicated wallet address for apps."}                         
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
                                helperText={!chains.find(({ id }) => id === activeChain?.id) ?                                     
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
                                    disabled={isDisabled()}
                                    variant="contained"
                                    onClick={() => putApp(account?.address as string) }
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