//import { Chart as ChartJS } from 'react-chartjs-2'
//import { MatrixController, MatrixElement } from 'chartjs-chart-matrix'
import dynamic from 'next/dynamic'
import { Chart as ChartJS } from 'chart.js'
//import { MatrixController, MatrixElement } from 'chartjs-chart-matrix'

/*
const { MatrixController, MatrixElement } = dynamic(
    () => import('chartjs-chart-matrix'),
    { ssr: false }
);
*/

const { MatrixController, MatrixElement } = dynamic(
    async () => {
        await import('chartjs-chart-matrix')        
    },
    { ssr: false }
);

ChartJS.register(MatrixController, MatrixElement);


const data = {
    datasets: [{
      label: 'My Matrix',
      data: [
        {x: 1, y: 1, v: 11},
        {x: 1, y: 2, v: 12},
        {x: 1, y: 3, v: 13},
        {x: 2, y: 1, v: 21},
        {x: 2, y: 2, v: 22},
        {x: 2, y: 3, v: 23},
        {x: 3, y: 1, v: 31},
        {x: 3, y: 2, v: 32},
        {x: 3, y: 3, v: 33}
      ],
      backgroundColor(context) {
        const value = context.dataset.data[context.dataIndex].v;
        const alpha = (value - 5) / 40;
        return helpers.color('green').alpha(alpha).rgbString();
      },
      borderColor(context) {
        const value = context.dataset.data[context.dataIndex].v;
        const alpha = (value - 5) / 40;
        return helpers.color('darkgreen').alpha(alpha).rgbString();
      },
      borderWidth: 1,
      width: ({chart}) => (chart.chartArea || {}).width / 3 - 1,
      height: ({chart}) =>(chart.chartArea || {}).height / 3 - 1
    }]
  };


const CohortChart = () =>{
  
    return(
        <div>
            <canvas id='canvas'></canvas>
        </div>
    )
}

export default CohortChart