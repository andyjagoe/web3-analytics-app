import { useEffect, useState } from 'react'
import { Chart as ChartJS } from 'chart.js'
import { ChoroplethController, GeoFeature, ColorScale, ProjectionScale, topojson } from 'chartjs-chart-geo'
import { ChoroplethChart } from "./ChoroplethChart.jsx"
import LoadingPage from '../LoadingPage.jsx'
import { usePapaParse } from 'react-papaparse'
import axios from 'axios'


const us = require("../../node_modules/us-atlas/states-10m.json");
const nation = topojson.feature(us, us.objects.nation).features[0];
const states = topojson.feature(us, us.objects.states).features;


const USMapChart = ({userId, slug}) => {
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


    useEffect(()=>{
        if (!readyToRender && ChartJS && ChoroplethController && GeoFeature && ColorScale && ProjectionScale) {
            ChartJS.register(ChoroplethController, GeoFeature, ColorScale, ProjectionScale)            
            getCsv()
            setReadyToRender(true)
        }     
    })


    const chartData = () => {
        let stateData = {}
        for (let i = 0; i < dataLabels.length; i++) {
            stateData[dataLabels[i]] = dataColumnOne[i]
        }

        return {
          labels: states.map((d) => d.properties.name),
          datasets: [
            {
                label: 'States',
                outline: nation,
                data: states.map((d) => ({feature: d, value: stateData[d.properties.name] || 0})),
            }
          ],
        }
    }
    
    
    return(
        <>
            {!hasLoaded && <LoadingPage />}
            {readyToRender && hasLoaded &&
                <ChoroplethChart
                    data={chartData()}
                    options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        legend: {
                            display: false
                        },
                        scale: {
                            projection: 'albersUsa'
                        },
                        geo: {
                            colorScale: {
                            display: true,
                            position: 'bottom',
                            quantize: 5,
                            legend: {
                                position: 'bottom-right',
                            },
                            },
                        },
                    }} 
                />
            }   
        </>
    )
}

export default USMapChart