import { useEffect, useState } from 'react'
import { Chart as ChartJS } from 'chart.js'
import {color} from 'chart.js/helpers';
import { MatrixController, MatrixElement } from 'chartjs-chart-matrix'
import { Matrix } from "./Matrix.jsx"
import LoadingPage from '../LoadingPage.jsx'
import { usePapaParse } from 'react-papaparse'
import axios from 'axios'


const WeeklyCohortChart = ({userId, slug}) =>{
    const [readyToRender, setReadyToRender] = useState(false)
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
        const vScale = 100
        let rowsRead = 0
        let fields = []
        let cohortData = []
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
              cohortData.push({y: rowsRead+1, x:1, v: row.data[fields[1]] * vScale })
            }
            if (fields.length > 2) {
              cohortData.push({y: rowsRead+1, x:2, v: row.data[fields[2]] * vScale })
            }
            if (fields.length > 3) {
              cohortData.push({y: rowsRead+1, x:3, v: row.data[fields[3]] * vScale })
            }
            if (fields.length > 4) {
              cohortData.push({y: rowsRead+1, x:4, v: row.data[fields[4]] * vScale })
            }
            if (fields.length > 5) {
              cohortData.push({y: rowsRead+1, x:5, v: row.data[fields[5]] * vScale })
            }
            if (fields.length > 6) {
              cohortData.push({y: rowsRead+1, x:6, v: row.data[fields[6]] * vScale })
            }
            if (fields.length > 7) {
              cohortData.push({y: rowsRead+1, x:7, v: row.data[fields[7]] * vScale })
            }
            if (fields.length > 8) {
              cohortData.push({y: rowsRead+1, x:8, v: row.data[fields[8]] * vScale })
            }
            if (fields.length > 9) {
              cohortData.push({y: rowsRead+1, x:9, v: row.data[fields[9]] * vScale })
            }
            if (fields.length > 10) {
              cohortData.push({y: rowsRead+1, x:10, v: row.data[fields[10]] * vScale })
            }

            rowsRead++
        },
        complete: (results) => {
            setDataColumnOne(cohortData)
            setHasLoaded(true)
        },
        error: (error) => {
            console.log(error)
            setHasLoaded(true)
          }
        });
    }

    useEffect(() => {
        if (!readyToRender && ChartJS && MatrixController && MatrixElement) {
            ChartJS.register(MatrixController, MatrixElement)
            getCsv()
            setReadyToRender(true)
        }
        
    }, [ChartJS, MatrixController, MatrixElement])
  

    const chartData = () => {
      const largestY = Math.max(...dataColumnOne.map(o => o.y))
      const largestX = Math.max(...dataColumnOne.map(o => o.x))

      return {
        datasets: [{
          label: 'My Matrix',
          data: dataColumnOne,
          backgroundColor(context) {
            const value = context.dataset.data[context.dataIndex].v;
            const alpha = (value) / 40;
            return color('green').alpha(alpha).rgbString();
          },
          borderColor(context) {
            const value = context.dataset.data[context.dataIndex].v;
            const alpha = (value) / 40;
            return color('darkgreen').alpha(alpha).rgbString();
          },
          borderWidth: 1,
          width: ({chart}) => (chart.chartArea || {}).width / largestX - 1,
          height: ({chart}) =>(chart.chartArea || {}).height / largestY - 1
        }]
      }
    }    

    return(
        <>
            {!hasLoaded && <LoadingPage />}
            {readyToRender && hasLoaded &&
                <Matrix
                    data={chartData()}
                    options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                          legend: false,
                          tooltip: {
                            callbacks: {
                              title() {
                                return '';
                              },
                              label(context) {
                                const v = context.dataset.data[context.dataIndex];
                                return [
                                  dataLabels[parseInt(v.y)-1] || `Week ${parseInt(v.y)-1}`,
                                  `Week ${parseInt(v.x)-1}`,
                                  `${v.v}%`
                                ];
                              }
                            }
                          }
                        },
                        scales: {
                          x: {
                            position: 'top',
                            ticks: {
                                stepSize: 1,
                                callback: function(val, index) {
                                    return `Week ${parseInt(val)-1}`;
                                },
                            },
                            grid: {
                              display: false
                            }
                          },
                          y: {
                            offset: true,
                            ticks: {
                              stepSize: 1,
                              callback: function(val, index) {
                                return dataLabels[val-1] || `Week ${parseInt(val)-1}`
                              },
                            },
                            grid: {
                              display: false
                            }
                          }
                        },
                        layout: {
                            padding: {
                              top: 60,
                            }
                        }
                    }} 
                />
            }   
        </>
    )
}

export default WeeklyCohortChart