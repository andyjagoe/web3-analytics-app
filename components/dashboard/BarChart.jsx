import { useState, useEffect } from 'react'
import { usePapaParse } from 'react-papaparse'
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js'
import { Bar } from 'react-chartjs-2'
import axios from 'axios'

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
)

const options = {
    responsive: true,
    maintainAspectRatio: false,
    layout: {
        padding: {
          left: 5,
          right: 5,
          top: 50,
          bottom: 5,
        },
    },
    plugins: {
      legend: {
        position: 'top',
      }
    },
  }


const BarChart = ({userId, slug}) => {
  const [dataLabels, setDataLabels] = useState([])
  const [dataColumnOne, setDataColumnOne] = useState([])
  const [hasLoaded, setHasLoaded] = useState(false)
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
      }
  }
  
  const handleReadRemoteFile = async (bigFileURL) => {
      let rowsRead = 0
      let fields = []
      readRemoteFile(bigFileURL, {
          worker: true,
          download: true,
          header: true,
          skipEmptyLines: true,
      step: (row) => {
          if (rowsRead === 0 ) {
            for (const field of row.meta.fields) {
                fields.push(field)
            }
          }
          if (fields.length > 1) {
            setDataLabels(dataLabels => [...dataLabels, row.data[fields[0]]])
            setDataColumnOne(dataColumnOne => [...dataColumnOne, parseInt(row.data[fields[1]])])
          }
          rowsRead++
      },
      complete: (results) => {
        setHasLoaded(true)
      },
      error: (error) => {
          console.log(error)
          setHasLoaded(true)
        }
      });
  }

  const chartData = () => {
    return {
      labels: dataLabels,
      datasets: [
        {
          label: 'Dataset One',
          data: dataColumnOne,
          backgroundColor: 'rgba(255, 99, 132, 0.5)',
        }
      ],
    }
  }
  

  useEffect(() => {
    getCsv()
  }, [])

  return (
    <>
      {hasLoaded? <Bar options={options} data={chartData()} />:<></>}
    </>
  )
}
    
export default BarChart