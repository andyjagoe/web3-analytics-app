import { useEffect, useState } from 'react'
import {
  Avatar,
  Breadcrumbs,
  Typography,
  Grid,
  Button,
  TextField,
  Container,
} from '@mui/material'
import LoadingButton from '@mui/lab/LoadingButton'
import {
    useAccount,
    useConnect,
    useDisconnect,
    useNetwork,
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
import validUrl from 'valid-url'


const NewApp: NextPage = () => {
    const theme = useTheme()
    const [isAppRegistered, setIsAppRegistered] = useState(false)
    const [urlError, setUrlError] = useState(false)
    const [appName, setAppName] = useState("")
    const [appURL, setAppURL] = useState("")
    const [previousSigner, setPreviousSigner] = useState({})
    const [registerAppLoading, setRegisterAppLoading] = useState(false)
    const [disable, setDisabled] = useState(false)
    const [loading, setLoading] = useState(false)
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
    const { disconnect } = useDisconnect()
    const router = useRouter()
    const { data: session, status } = useSession({
        required: true,
        onUnauthenticated() {
            signIn()
        },
    })
    

    useEffect(() => {
        if (signer && signer !== previousSigner) checkRegistration()
        setDisabled(formValidation())
    }, [signer, appName, appURL])


    const formValidation = () => {   
        if (checkUrl()
            || appName == ""
            ) {
          return true
        } else {
          return false
        }
    }


    const checkUrl = () => {
        if (appURL !== "" && !validUrl.isWebUri(appURL)) {
            setUrlError(true)
            return true
        }
        setUrlError(false)
        return false
    }


    const checkRegistration = async () => {
        if (!signer || !process.env.NEXT_PUBLIC_WEB3ANALYTICS) return        
        const contract = new ethers.Contract(
            process.env.NEXT_PUBLIC_WEB3ANALYTICS,
            Web3Analytics,
            signer
        )
        try {
            setIsAppRegistered(await contract.isAppRegistered(account?.address))
        } catch (error) {
            console.log(error)
        }
        setPreviousSigner(signer)
    }

    const registerAppOnChain = async () => {
        if (!signer || !process.env.NEXT_PUBLIC_WEB3ANALYTICS) return

        setRegisterAppLoading(true)
        setLoading(true)

        const contract = new ethers.Contract(
            process.env.NEXT_PUBLIC_WEB3ANALYTICS,
            Web3Analytics,
            signer
        )

        try {
            const tx = await contract.registerApp(appName, appURL)
            await tx.wait()
    
            const response = await registerAppInDb(account?.address as string, appName, 0)
            if (response) router.push(`/users/${session?.user?.id}/app/${response.data.slug}`)
            
            setRegisterAppLoading(false)
            setLoading(false)    
        } catch (error) {
            console.log(error)
            setRegisterAppLoading(false)
            setLoading(false)    
        }

    }


    const registerAppInDb = async (address:string, name:string, retries:number) => {
        const response = await axios({
            method: 'put',
            url: '/api/apps',
            data: {
                sk: address,
                name: name,
            }
        })
        if (response.status === 201) return response
        if ((retries < 5) && (response.status === 500 || response.status === 504)) {
            registerAppInDb(address, name, retries++)
        }
        
        return null
    }
    
    const isDisabled = () => {
        if (isAppRegistered) return true
        if (registerAppLoading) return true
        if (disable) return true
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
                                autoFocus
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
                                error={urlError}
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
                                <LoadingButton
                                    fullWidth
                                    disabled={isDisabled()}
                                    variant="contained"
                                    loading={loading}
                                    onClick={() => registerAppOnChain() }
                                >
                                    Register App
                                </LoadingButton>
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

                </>
                )
            }

        </Container>
        </div>
    )}

export default NewApp;