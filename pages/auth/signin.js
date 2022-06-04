import React, { useState } from 'react';
import {
  Avatar,
  Typography,
  Grid,
  TextField,
  Button,
  Container
} from '@mui/material'
import LockOutlinedIcon from '@mui/icons-material/LockOutlined'
import GitHubIcon from '@mui/icons-material/GitHub'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faDiscord } from '@fortawesome/free-brands-svg-icons'
import { getCsrfToken, getProviders } from 'next-auth/react'
import { useRouter } from 'next/router'
import {useTheme} from '@mui/material/styles'
import { useSession } from "next-auth/react"
import LoadingPage from '../../components/LoadingPage.jsx'


const Signin = ({ csrfToken, providers }) => {
  const { status } = useSession()
  const { query } = useRouter()
  const theme = useTheme()
  const callbackUrl = query.callbackUrl

  const [email, setEmail] = useState("");

  if (status === "loading") {
    return <LoadingPage />
  }

  const getIcon = (provider) => {
    if (provider.name === "GitHub") return <GitHubIcon />
    if (provider.name === "Discord") {
      return <FontAwesomeIcon icon={faDiscord} />
    }
    return ''
  }

  return (
    <div sx={{
      textAlign: 'center',
      marginTop: theme.spacing(4),
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',    
    }}>

      <Grid 
        container 
        direction="column"
        alignItems="center"
        justifyContent="center"
        sx={{ marginTop: theme.spacing(8), marginBottom: theme.spacing(4)}}
      >
        <Grid item xs={12}>
          <Avatar sx={{
            margin: theme.spacing(1),
            backgroundColor: theme.palette.secondary.main,
          }}>
            <LockOutlinedIcon />
          </Avatar>
        </Grid>
        <Grid item xs={12}>
          <Typography component="h1" variant="h5">
            Sign In
          </Typography>
        </Grid>
      </Grid>

      <Container maxWidth="xs">
      {Object.values(providers).map((provider) => {
        return (
          <div key={provider.id}>
          {provider.type === "oauth" && (
            <form action={provider.signinUrl} method="POST">
              <input type="hidden" name="csrfToken" value={csrfToken} />
              {callbackUrl && (
                <input type="hidden" name="callbackUrl" value={callbackUrl} />
              )}
            <Grid container spacing={2} >               
              <Grid item xs={12}>
                <Button
                    type="submit"
                    variant="outlined"
                    fullWidth
                    sx={{ marginBottom: theme.spacing(1)}}
                    >
                    Sign in with {provider.name}&nbsp;{getIcon(provider)}
                </Button>
              </Grid>
            </Grid>
            </form>
          )}
          {provider.type === "email" && (
            <form action={provider.signinUrl} method="POST">
              <input type="hidden" name="csrfToken" value={csrfToken} />
              <Grid 
                container 
                sx={{ marginTop: theme.spacing(4)}}
              >               
                <Grid item xs={12}>
                  <Typography variant="overline" display="block" gutterBottom>
                    Or sign in with email
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                    <TextField
                        id={`input-email-for-${provider.id}-provider`}
                        autoFocus
                        name="email"
                        type="email"
                        variant="outlined"
                        required
                        inputProps={{
                          maxLength: 64,
                        }}
                        fullWidth
                        label="Email address"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        />
                </Grid>

                <Grid item xs={12}>
                  <Button
                      type="submit"
                      variant="contained"
                      color="primary"
                      fullWidth
                      sx={{ marginTop: theme.spacing(1)}}
                    >
                      Sign in with {provider.name}
                  </Button>
                </Grid>
              </Grid>
            </form>
          )}
          {provider.type === "credentials" && (
            <form action={provider.callbackUrl} method="POST">
              <input type="hidden" name="csrfToken" value={csrfToken} />
              {Object.keys(provider.credentials).map((credential) => {
                return (
                  <div key={`input-group-${provider.id}`}>
                    <label
                      className="section-header"
                      htmlFor={`input-${credential}-for-${provider.id}-provider`}
                    >
                      {provider.credentials[credential].label ?? credential}
                    </label>
                    <input
                      name={credential}
                      id={`input-${credential}-for-${provider.id}-provider`}
                      type={provider.credentials[credential].type ?? "text"}
                      placeholder={
                        provider.credentials[credential].placeholder ?? ""
                      }
                      {...provider.credentials[credential]}
                    />
                  </div>
                )
              })}
              <button type="submit">Sign in with {provider.name}</button>
            </form>
          )}
          </div>
        );
      })}

    </Container>
    </div>


  );
}

export default Signin;


export async function getServerSideProps(context) {
    const providers = await getProviders()
    const csrfToken = await getCsrfToken(context)
    return {
      props: {
        providers,
        csrfToken
      },
    }
  }