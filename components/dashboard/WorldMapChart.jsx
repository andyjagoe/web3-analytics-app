import { useEffect, useState } from 'react'
import { Chart as ChartJS } from 'chart.js'
import { ChoroplethController, GeoFeature, ColorScale, ProjectionScale, topojson } from 'chartjs-chart-geo'
import { ChoroplethChart } from "./ChoroplethChart.jsx"
import LoadingPage from '../LoadingPage.jsx'
import { usePapaParse } from 'react-papaparse'
import axios from 'axios'
import iso from 'iso-3166-1'


const world = require("../../node_modules/world-atlas/countries-50m.json")
const countries = topojson.feature(world, world.objects.countries).features


const WorldMapChart = ({userId, slug}) => {
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
        let countryData = {}
        for (let i = 0; i < dataLabels.length; i++) {
            if (iso.whereAlpha2(dataLabels[i])) {
                countryData[iso.whereAlpha2(dataLabels[i]).numeric] = dataColumnOne[i]
            }
        }

        return {
          labels: countries.map((d) => d.properties.name),
          datasets: [
            {
                label: 'Countries',
                data: countries.map((d) => ({feature: d, value: countryData[d.id] || 0})),
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
                        showOutline: true,
                        showGraticule: true,
                        plugins: {
                            legend: {
                              display: false,
                            },
                        },
                        scales: {
                            xy: {
                              projection: 'equalEarth',
                            },
                        },
                    }} 
                />
            }   
        </>
    )
}

export default WorldMapChart