import { useRef } from 'react'
import {
  Breadcrumbs,
  Typography,
  Grid,
  Box,
  Button,
} from '@mui/material'
import { Add } from '@mui/icons-material'
import Link from '../../../../../src/Link'
import {useTheme} from '@mui/material/styles'
import type { NextPage } from 'next'
import Head from 'next/head'
import { useRouter } from 'next/router'
import useUser from "../../../../../hooks/useUser.jsx"
import useItem from "../../../../../hooks/useItem.jsx"
import StarButton from "../../../../../components/StarButton.jsx"
import CsvDataGrid from "../../../../../components/dashboard/CsvDataGrid.jsx"
import BarChart from "../../../../../components/dashboard/BarChart.jsx"
import ComponentNavBar from "../../../../../components/dashboard/ComponentNavBar.jsx"
import { Responsive, WidthProvider } from "react-grid-layout"
import useComponents from "../../../../../hooks/useComponents.jsx"
import AddComponentDialog from "../../../../../components/dashboard/AddComponentDialog.jsx"
import { useSWRConfig } from 'swr'
import axios from 'axios'
import { useSession } from "next-auth/react"
import 'react-grid-layout/css/styles.css'
import 'react-resizable/css/styles.css'


const ResponsiveGridLayout = WidthProvider(Responsive);


const DashboardPage: NextPage = () => {
  const theme = useTheme()
  const router = useRouter()
  const { userId, slug } = router.query
  const {myUser} = useUser(userId)
  const {myItem} = useItem(userId, 'dashboard', slug)
  const {myComponents} = useComponents(userId, 'dashboard', slug)
  const addComponentRef = useRef()
  const { data: session } = useSession()
  const { mutate } = useSWRConfig()


  const layoutChange = async (layout: any) => {
    try {
      const response = await axios({
        method: 'post',
        url: `/api/users/${userId}/dashboard/${slug}`,
        data: {
          layout: layout
        }
      })
      if (response.status === 201) {
        mutate(`/api/users/${userId}/dashboard/${slug}`) 
      }
    } catch (error) {
        console.log(error)
    }

  }


  // Handle add component dialog
  const handleOpenClick = () => {
    if (addComponentRef.current) {
      (addComponentRef.current as any).handleOpenClick()
    }
  }

  
  return (
    <div>
      <Head>
        <title>Web3 Analytics</title>
        <meta name="description" content="A decentralized analytics platform where users own their data." />
      </Head>

      <Grid container direction="row" sx={{ marginTop: theme.spacing(4), alignItems: 'center'}}>
        <Grid item xs={9}>
          <Grid container>
            <Breadcrumbs aria-label="breadcrumb">
              <Link color="inherit" href="/">Home</Link>
              <Link color="inherit" href={`/users/${userId}`}>
                {myUser?.Item?.name? myUser.Item.name:userId}
              </Link>
              <Typography color="textPrimary">{myItem? myItem?.Item?.name:''}</Typography>
            </Breadcrumbs>
          </Grid>
        </Grid>
        <Grid item xs={3}>
          <Grid container direction="row-reverse">
            {myItem && myItem.Item && 
            <StarButton item={myItem.Item} />}            
            {session?.user?.id === userId?
            <Button
                onClick={() => { handleOpenClick() }}
                sx={{ padding: '0'}}
            >
              <Add />
            </Button>
            :<></>}
          </Grid>
        </Grid>
      </Grid>

      {myItem && myComponents?
        <ResponsiveGridLayout
          className="layout"
          layouts={ myItem?.Item?.layout? { lg:myItem.Item.layout } : { lg: []} }
          breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
          cols={{ lg: 4, md: 3, sm: 2, xs: 1, xxs: 1 }}
          rowHeight={100}
          onResizeStop={layoutChange}
          onDragStop={layoutChange}
        >
          
          {myComponents?.Items.length > 0? 
            myComponents?.Items?.map((component:any) => 
            (
              <Box key={component.uid} sx={{ border: '1px solid black' }}>
                <>
                  <ComponentNavBar item={component} userId={userId} slug={slug} />
                  {component?.format?
                    (() => { 
                      switch(component?.format) {
                        case 'DataGrid':
                          return <CsvDataGrid userId={userId} slug={component?.query} />
                        case 'BarChart':
                          return <BarChart userId={userId} slug={component?.query} />                      
                        default:
                          return <></>
                      }
                    })():<></>
                  }
                </>      
              </Box>        
            ))
            :<></>
          }
        </ResponsiveGridLayout>
      :<></>}

    <AddComponentDialog userId={userId} slug={slug} ref={addComponentRef} />

  </div>
  )
}

export default DashboardPage;