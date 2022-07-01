import { useState, useCallback } from 'react'
import {
  Breadcrumbs,
  Typography,
  Grid,
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


const CustomToolbar = () => {
  return (
    <GridToolbarContainer>
      <GridToolbarFilterButton />
      <GridToolbarExport />
    </GridToolbarContainer>
  )
}


const QueryPage: NextPage = () => {
  const [sqlCode, setSqlCode] = useState(
    "-- Type your SQL query here. Here's one to get you started...\nselect * from events;"
  )
  const [dataGridColumns, setDataGridColumns] = useState<string[]>([])
  const [dataGridRows, setDataGridRows] = useState<string[]>([])
  const [disable, setDisabled] = useState(false)
  const [loading, setLoading] = useState(false)
  const theme = useTheme()
  const router = useRouter()
  const { data: session } = useSession()
  const { userId, slug } = router.query
  const {myUser} = useUser(userId)
  const {myItem} = useItem(userId, 'query', slug)
  const { readRemoteFile } = usePapaParse();

  const onChange = useCallback((value:any, viewUpdate:any) => {
    setSqlCode(value)
  }, []);


  const handleReadRemoteFile = async (bigFileURL:string) => {
    let rowsRead = 0
    readRemoteFile(bigFileURL, {
      worker: true,
      step: (row:any) => {
        if (rowsRead === 0 ) {
          let fields = []
          for (const field of row.meta.fields) {
            fields.push({field: field, headerName: field, width: 300})
          }
          fields.push({field: '_datagrid_id', headerName: '_datagrid_id', width: 100})
          setDataGridColumns(fields as any)
        }
        rowsRead++
        row.data._datagrid_id = rowsRead
        setDataGridRows(dataGridRows => [...dataGridRows, row.data])
      },
      complete: (results:any) => {
        console.log('Query result successfully loaded')
      },
      header: true,
      skipEmptyLines: true
    } as any);
  };

  const startQuery = async () => {
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
        handleReadRemoteFile(response.data.signedUrl)
      } else if (response.status === 400) {
          await getResults(queryExecutionId, ms*2)
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
          value={sqlCode}
          height="200px"
          extensions={[sql()]}
          theme={sublime}
          onChange={onChange}
        />
      </Grid>
      <Grid item xs={12}>
      </Grid>
      <Grid item xs={12}>
        <Grid container direction="row-reverse">
          <LoadingButton
                  disabled={disable}
                  variant="contained"
                  loading={loading}
                  onClick={() => startQuery() }
          >
              Run
          </LoadingButton>
        </Grid>
      </Grid>

      {dataGridRows.length > 0?
        <Grid item xs={12}>
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
        </Grid>
        :
        <></>
      }
    </Grid>

  </div>
  )
}

export default QueryPage;