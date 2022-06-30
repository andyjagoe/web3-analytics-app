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
import QueryResults from "../../../../../components/QueryResults.jsx"
import axios from 'axios'
import CodeMirror from '@uiw/react-codemirror'
import { sql } from '@codemirror/lang-sql'
import { sublime } from '@uiw/codemirror-theme-sublime'



const QueryPage: NextPage = () => {
  const [sqlCode, setSqlCode] = useState("select * from events;")
  const [headings, setHeadings] = useState([])
  const [rows, setRows] = useState([])
  const [disable, setDisabled] = useState(false)
  const [loading, setLoading] = useState(false)
  const theme = useTheme()
  const router = useRouter()
  const { data: session } = useSession()
  const { userId, slug } = router.query
  const {myUser} = useUser(userId)
  const {myItem} = useItem(userId, 'query', slug)

  const onChange = useCallback((value:any, viewUpdate:any) => {
    setSqlCode(value)
  }, []);


  const startQuery = async () => {
    setLoading(true)
    setHeadings([])
    setRows([])

    try {
      const response = await axios({
        method: 'put',
        url: '/api/run',
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
        method: 'post',
        url: '/api/run',
        data: {
          queryExecutionId: queryExecutionId
        }
      })
      if (response.status === 200) {
        setHeadings(response.data.ResultSet.ResultSetMetadata.ColumnInfo)
        setRows(response.data.ResultSet.Rows)
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

      <Grid item xs={12}>
        <QueryResults headings={headings} rows={rows} />
      </Grid>

    </Grid>

  </div>
  )
}

export default QueryPage;