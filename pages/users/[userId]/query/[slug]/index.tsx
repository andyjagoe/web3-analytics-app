import { useState, useCallback, useEffect } from 'react'
import {
  Breadcrumbs,
  Typography,
  Grid,
  Alert,
  Stack,
  Box
} from '@mui/material'
import LoadingButton from '@mui/lab/LoadingButton'
import Link from '../../../../../src/Link'
import {useTheme} from '@mui/material/styles'
import type { NextPage } from 'next'
import Head from 'next/head'
import { useRouter } from 'next/router'
import { useSession } from "next-auth/react"
import useUser from "../../../../../hooks/useUser.jsx"
import useItem from "../../../../../hooks/useItem.jsx"
import StarButton from "../../../../../components/StarButton.jsx"
import LoadingPage from "../../../../../components/LoadingPage"
import axios from 'axios'
import CodeMirror from '@uiw/react-codemirror'
import { sql } from '@codemirror/lang-sql'
import { sublime } from '@uiw/codemirror-theme-sublime'
import { usePapaParse } from 'react-papaparse'
import { 
  DataGrid, 
  GridToolbarContainer,
  GridToolbarFilterButton,
  GridToolbarExport
} from '@mui/x-data-grid'
import { useSWRConfig } from 'swr'
import { DateTime, Interval } from "luxon"
import humanizeDuration from 'humanize-duration'


const CustomToolbar = () => {
  return (
    <GridToolbarContainer>
      <GridToolbarFilterButton />
      <GridToolbarExport />
    </GridToolbarContainer>
  )
}


const QueryPage: NextPage = () => {
  const router = useRouter()
  const { userId, slug } = router.query
  const {myUser} = useUser(userId)
  const {myItem} = useItem(userId, 'query', slug)
  const [sqlCode, setSqlCode] = useState("")
  const [queryError, setQueryError] = useState("")
  const [dataGridColumns, setDataGridColumns] = useState<string[]>([])
  const [dataGridRows, setDataGridRows] = useState<string[]>([])
  const [disable, setDisabled] = useState(false)
  const [loading, setLoading] = useState(false)
  const [loadingCSV, setLoadingCSV] = useState(false)
  const theme = useTheme()
  const { data: session } = useSession()
  const { readRemoteFile } = usePapaParse()
  const { mutate } = useSWRConfig()

  const onChange = useCallback((value:any, viewUpdate:any) => {
    setSqlCode(value)
  }, []);

  
  useEffect(() => {
    if (userId) getCsv()
  }, [userId])


  const getCsv = async () => {
    try {
      const response = await axios({
        method: 'get',
        url: `/api/users/${userId}/query/${slug}/csv`        
      })
      if (response.status === 200) {
        await handleReadRemoteFile(response.data.signedUrl)
      }
    } catch (error) {
        console.log(error)
        setLoading(false)
    }
  }


  const handleReadRemoteFile = async (bigFileURL:string) => {
    let rowsRead = 0
    setLoadingCSV(true)
    readRemoteFile(bigFileURL, {
      worker: true,
      download: true,
      header: true,
      skipEmptyLines: true,
      preview: 500,
      step: (row:any) => {
        if (rowsRead === 0 ) {
          let fields = []
          for (const field of row.meta.fields) {
            fields.push({field: field, headerName: field, width: 300})
          }
          fields.push({field: '_datagrid_id', headerName: '_datagrid_id', width: 100})
          setDataGridColumns(fields as any)
          setLoadingCSV(false)
        }
        rowsRead++
        row.data._datagrid_id = rowsRead
        setDataGridRows(dataGridRows => [...dataGridRows, row.data])
      },
      complete: (results:any) => {
        setLoadingCSV(false)
      },
      error: (error:any) => {
        setLoadingCSV(false)
      }
    } as any);
  }


  const startQuery = async () => {
    setQueryError("")
    setLoading(true)
    setDataGridColumns([])
    setDataGridRows([])

    try {
      const response = await axios({
        method: 'put',
        url: `/api/users/${userId}/query/${slug}/query`,
        data: {
            sql: sqlCode
        }
      })
      if (response.status === 200) {
        await getResults(response.data.QueryExecutionId, 1000)
      }
    } catch (error) {
        console.log(error)
        setQueryError((error as any)?.response?.data)
        setLoading(false)
    }
  }


  const delay = (ms: number) => {
    return new Promise(resolve => setTimeout(resolve, ms))
  }


  const getResults = async (queryExecutionId:string, ms:number) => {
    await delay(ms);

    try {
      const response = await axios({
        method: 'get',
        url: `/api/users/${userId}/query/${slug}/query/${queryExecutionId}`
      })
      if (response.status === 200) {
          mutate(`/api/users/${userId}/query/${slug}`)
          switch(response?.data?.QueryExecution?.Status?.State) {
            case 'SUCCEEDED':
              getCsv()
              break
            case 'FAILED':
              setQueryError(response?.data?.QueryExecution?.Status?.StateChangeReason)          
              break
            case 'CANCELLED':
              setQueryError(response?.data?.QueryExecution?.Status?.StateChangeReason)          
              break
            default:
              await getResults(queryExecutionId, ms*2)            
          }
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
          </Grid>
        </Grid>
      </Grid>

    <Grid container spacing={2} sx={{ marginTop: theme.spacing(2)}}>
      <Grid item xs={12}>
        <CodeMirror
          readOnly={session?.user?.id === userId ? false:true}
          value={myItem? myItem?.Item?.query:''}
          height="200px"
          extensions={[sql()]}
          theme={sublime}
          onChange={onChange}
        />
      </Grid>
      <Grid item xs={12}>
      </Grid>
      <Grid item xs={12}>
        <Grid container direction="row-reverse" sx={{ alignItems: 'center'}}>
          <LoadingButton
                  disabled={disable}
                  variant="contained"
                  loading={loading}
                  onClick={() => startQuery() }
          >
              Run
          </LoadingButton>
          {myItem?.Item?.status?.CompletionDateTime?
            <Stack justifyContent="flex-end" sx={{ marginRight: theme.spacing(2)}}>
              <Box display="flex" justifyContent="flex-end">
                <Typography 
                  variant="body2"          
                  color="textPrimary"                   
                >
                  Last run&nbsp;
                    <b>
                    {DateTime.fromISO(myItem?.Item?.status?.CompletionDateTime)
                      .toRelative()}
                    </b>
                </Typography>
              </Box>
              <Box display="flex" justifyContent="flex-end">
                <Typography 
                  variant="body2"          
                  color="textPrimary" 
                >
                  Last run took&nbsp;
                    <b>
                    {
                      humanizeDuration(               
                        Interval.fromDateTimes(
                          DateTime.fromISO(myItem?.Item?.status?.SubmissionDateTime),
                          DateTime.fromISO(myItem?.Item?.status?.CompletionDateTime)
                        )
                        .toDuration()
                        .valueOf()
                      )
                    }
                    </b>
                </Typography>
              </Box>
            </Stack>
            :
            <></>        
          }
        </Grid>
      </Grid>


      {queryError !== ""?
        <Grid item xs={12}>
          <Alert severity="error">
            {queryError}
          </Alert>
        </Grid>
      :
      <></>
      }

      {queryError === "" && myItem?.Item?.status?.State === 'FAILED'?
        <Grid item xs={12}>
          <Alert severity="error">
            {myItem?.Item?.status?.StateChangeReason}
          </Alert>
        </Grid>
      :
      <></>
      }

      <Grid item xs={12}>
        {loadingCSV? <LoadingPage />:<></>}
        {dataGridColumns.length > 0 && myItem?.Item?.status?.State !== 'FAILED'?
          <div style={{ height: 300, width: '100%' }}>
            <DataGrid 
              rows={dataGridRows as any} 
              columns={dataGridColumns as any} 
              getRowId={(row) => row._datagrid_id}
              columnVisibilityModel={{
                _datagrid_id: false,
              }}
              components={{ Toolbar: CustomToolbar }}
              checkboxSelection={true}
            />
          </div>
        :
        <></>
        }
      </Grid>

    </Grid>

  </div>
  )
}

export default QueryPage;