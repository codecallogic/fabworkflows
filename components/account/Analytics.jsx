import SVG from '../../files/svgs'
import { Line } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { isArrayLike } from 'lodash';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export const options = {
  responsive: true,
  plugins: {
    legend: {
      position: 'top'
    },
    title: {
      display: true,
      text: 'Jobs & Job Issues (dummy data)',
    },
  },
};

const labels = ['January', 'February', 'March', 'April', 'May', 'June', 'July'];

export const ordersAndIssues = (data, labels) => {

  let array = []
  let objectData = []
  
  data['jobs'].forEach((item, idx) => {

    const date = new Date(item.createdAt);
    let newObject
    // const dateObject = new Object()

    if(!array[labels[date.getUTCMonth()]]){

      newObject = {
        [labels[date.getUTCMonth()]]: 1
      }
      
    }

    // if(array(labels[date.getUTCMonth()])){

    // }

    // console.log(labels[date.getUTCMonth()])
    // console.log(dateObject[labels[date.getUTCMonth()]])
    
    // dateObject[labels[date.getUTCMonth()]]
    
    array.push(newObject)
    
    // console.log(date.getUTCMonth())
    
  })

  return array
  
}

export const data = {
  labels,
  datasets: [
    {
      label: 'Jobs',
      data: labels.map(() => Math.floor(Math.random() * 200)),
      borderColor: 'rgb(255, 99, 132)',
      backgroundColor: 'rgba(255, 99, 132, 0.5)',
    },
    {
      label: 'Job Issues',
      data: labels.map(() => Math.floor(Math.random() * 200)),
      borderColor: 'rgb(53, 162, 235)',
      backgroundColor: 'rgba(53, 162, 235, 0.5)',
    },
  ],
};

const Analytics = ({
  allData,
  
  //// METHODS
  setAllData
}) => {
  
  console.log(allData['jobs'])
  console.log(ordersAndIssues(allData, labels))
  
  return (
    <div className="analytics">
      <div className="analytics-chart">
        <Line options={options} data={data} />;
      </div>
      <div className="analytics-item">
        <div>
        <SVG svg={'stats-chart'}></SVG>
        Accounts
        </div>
        <span>{allData['accounts'].length}</span>
      </div>
      <div className="analytics-item">
        <div>
        <SVG svg={'stats-chart'}></SVG>
        Contracts
        </div>
        <span>{allData['contracts'].length}</span>
      </div>
      <div className="analytics-item">
        <div>
        <SVG svg={'stats-chart'}></SVG>
        Appointments
        </div>
        <span>{allData['appointments'].length}</span>
      </div>
      <div className="analytics-item">
        <div>
        <SVG svg={'stats-chart'}></SVG>
        Brands
        </div>
        <span>{allData['brands'].length}</span>
      </div>
      <div className="analytics-item">
        <div>
        <SVG svg={'stats-chart'}></SVG>
        Categories
        </div>
        <span>{allData['categories'].length}</span>
      </div>
      <div className="analytics-item">
        <div>
        <SVG svg={'stats-chart'}></SVG>
        Colors
        </div>
        <span>{allData['colors'].length}</span>
      </div>
      <div className="analytics-item">
        <div>
        <SVG svg={'stats-chart'}></SVG>
        Contacts
        </div>
        <span>{allData['contacts'].length}</span>
      </div>
      <div className="analytics-item">
        <div>
        <SVG svg={'stats-chart'}></SVG>
        Cutouts
        </div>
        <span>{allData['cutouts'].length}</span>
      </div>
      <div className="analytics-item">
        <div>
        <SVG svg={'stats-chart'}></SVG>
        Edges
        </div>
        <span>{allData['edges'].length}</span>
      </div>
      <div className="analytics-item">
        <div>
        <SVG svg={'stats-chart'}></SVG>
        Job Issues
        </div>
        <span>{allData['jobIssues'].length}</span>
      </div>
      <div className="analytics-item">
        <div>
        <SVG svg={'stats-chart'}></SVG>
        Locations
        </div>
        <span>{allData['locations'].length}</span>
      </div>
      <div className="analytics-item">
        <div>
        <SVG svg={'stats-chart'}></SVG>
        Materials
        </div>
        <span>{allData['materials'].length}</span>
      </div>
      <div className="analytics-item">
        <div>
        <SVG svg={'stats-chart'}></SVG>
        Models
        </div>
        <span>{allData['models'].length}</span>
      </div>
      <div className="analytics-item">
        <div>
        <SVG svg={'stats-chart'}></SVG>
        Phases
        </div>
        <span>{allData['phases'].length}</span>
      </div>
      <div className="analytics-item">
        <div>
        <SVG svg={'stats-chart'}></SVG>
        Price Lists
        </div>
        <span>{allData['prices'].length}</span>
      </div>
      <div className="analytics-item">
        <div>
        <SVG svg={'stats-chart'}></SVG>
        Purchase Orders
        </div>
        <span>{allData['purchaseOrders'].length}</span>
      </div>
      <div className="analytics-item">
        <div>
        <SVG svg={'stats-chart'}></SVG>
        Quotes
        </div>
        <span>{allData['quotes'].length}</span>
      </div>
      <div className="analytics-item">
        <div>
        <SVG svg={'stats-chart'}></SVG>
        Remnants
        </div>
        <span>{allData['remnants'].length}</span>
      </div>
      <div className="analytics-item">
        <div>
        <SVG svg={'stats-chart'}></SVG>
        Slabs
        </div>
        <span>{allData['slabs'].length}</span>
      </div>
      <div className="analytics-item">
        <div>
        <SVG svg={'stats-chart'}></SVG>
        Suppliers
        </div>
        <span>{allData['suppliers'].length}</span>
      </div>
      <div className="analytics-item">
        <div>
        <SVG svg={'stats-chart'}></SVG>
        Products
        </div>
        <span>{allData['products'].length}</span>
      </div>
    </div>
  )
}

export default Analytics
