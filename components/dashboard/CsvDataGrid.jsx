import { useState, useEffect } from 'react'
import { usePapaParse } from 'react-papaparse'
import { 
  DataGrid, 
  GridToolbarContainer,
  GridToolbarFilterButton,
  GridToolbarExport
} from '@mui/x-data-grid'
import LoadingPage from "../LoadingPage.jsx"
import axios from 'axios'


const CustomToolbar = () => {
    return (
      <GridToolbarContainer>
        <GridToolbarFilterButton />
        <GridToolbarExport />
      </GridToolbarContainer>
    )
  }

  
const CsvDataGrid = ({userId, slug}) => {
    const [dataGridColumns, setDataGridColumns] = useState([])
    const [dataGridRows, setDataGridRows] = useState([])
    const [loadingCSV, setLoadingCSV] = useState(false)
    const { readRemoteFile } = usePapaParse()
  
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
    
    
    const handleReadRemoteFile = async (bigFileURL) => {
        let rowsRead = 0
        setLoadingCSV(true)
        readRemoteFile(bigFileURL, {
            worker: true,
            download: true,
            header: true,
            skipEmptyLines: true,
        step: (row) => {
            if (rowsRead === 0 ) {
                let fields = []
                for (const field of row.meta.fields) {
                    fields.push({field: field, headerName: field, width: 300})
                }
                fields.push({field: '_datagrid_id', headerName: '_datagrid_id', width: 100})
                setDataGridColumns(fields)
                setLoadingCSV(false)
            }
            rowsRead++
            row.data._datagrid_id = rowsRead
            setDataGridRows(dataGridRows => [...dataGridRows, row.data])
        },
        complete: (results) => {
            setLoadingCSV(false)
        },
        error: (error) => {
            setLoadingCSV(false)
        }
        });
    }

    useEffect(() => {
        getCsv()
    }, [])
        

    return (
        <>
            {loadingCSV? <LoadingPage />:<></>}
            {dataGridColumns.length > 0?
            <div style={{ height: '100%', width: '100%', paddingTop: '50px' }}>
                <DataGrid 
                    rows={dataGridRows} 
                    columns={dataGridColumns} 
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
        </>
    )
}
    
export default CsvDataGrid;        