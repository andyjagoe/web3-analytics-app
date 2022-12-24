import * as React from 'react'
import {
    Breadcrumbs,
    Typography,
    Grid,
    Button,
    Link
  } from '@mui/material'
import { Add } from '@mui/icons-material'
import { useRouter } from 'next/router'
import {useTheme} from '@mui/material/styles'

const PageNav = ({category}) => {
    const theme = useTheme()
    const router = useRouter()
    const pathArray = router.asPath.split("/")

    return (
      <Grid container direction="row" sx={{ marginTop: theme.spacing(4), alignItems: 'center'}}>
        <Grid item xs={9}>
          <Grid container>
            <Breadcrumbs aria-label="breadcrumb">
              <Link 
                color="inherit" 
                onClick={() => {router.push('/')}}
              >
                Home
              </Link>
              <Typography color="textPrimary">{category}</Typography>
            </Breadcrumbs>
          </Grid>
        </Grid>
        <Grid item xs={3}>
          <Grid container direction="row-reverse">
            <Button
              onClick={() => { router.push(`/${pathArray[1]}/new`) }}
              sx={{ padding: '0'}}
            >
              <Add />
            </Button>   
          </Grid>
        </Grid>
      </Grid>
  )
}

export default PageNav;  