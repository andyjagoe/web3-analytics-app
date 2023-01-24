import { useEffect } from 'react'
import { Chart } from 'react-chartjs-2'

//import { ChoroplethController, GeoFeature, ColorScale, ProjectionScale } from 'chartjs-chart-geo'


const USMapChart = () =>{

    useEffect(()=>{

        /*
        let canvas = document.getElementById("canvas")
        if(!canvas) return

        fetch('https://unpkg.com/us-atlas/states-10m.json').then((r) => r.json()).then((us) => {

            const nation = ChoroplethChart.topojson.feature(us, us.objects.nation).features[0];
            const states = ChoroplethChart.topojson.feature(us, us.objects.states).features;
            
            const chart = new Chart(canvas.getContext("2d"), {
                type: 'choropleth',
                data: {
                labels: states.map((d) => d.properties.name),
                datasets: [{
                    label: 'States',
                    outline: nation,
                    data: states.map((d) => ({feature: d, value: Math.random() * 10})),
                }]
                },
                options: {
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
                }
            });
            */        

    })
    
    return(
        <div>
            <canvas id='canvas'></canvas>
        </div>
    )
}

export default USMapChart