import { useEffect, useState } from 'react'
import { Chart as ChartJS } from 'chart.js'
import { ChoroplethController, GeoFeature, ColorScale, ProjectionScale, topojson } from 'chartjs-chart-geo'
import { ChoroplethChart } from "./ChoroplethChart.jsx";

const us = require("../../node_modules/us-atlas/states-10m.json");
const nation = topojson.feature(us, us.objects.nation).features[0];
const states = topojson.feature(us, us.objects.states).features;

const data = {
    labels: states.map((d) => d.properties.name),
    datasets: [{
        label: 'States',
        outline: nation,
        data: states.map((d) => ({feature: d, value: Math.random() * 10})),
    }]
}


const USMapChart = () => {
    const [readyToRender, setReadyToRender] = useState(false)

    useEffect(()=>{
        if (ChartJS && ChoroplethController && GeoFeature && ColorScale && ProjectionScale) {
            ChartJS.register(ChoroplethController, GeoFeature, ColorScale, ProjectionScale)            
            setReadyToRender(true)
        }     
    })
    
    return(
        <>
            {readyToRender &&
                <ChoroplethChart
                    data={data}
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