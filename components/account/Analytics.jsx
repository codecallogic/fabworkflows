import SVG from '../../files/svgs'

const Analytics = ({
  allData,

  //// METHODS
  setAllData
}) => {
  
  return (
    <div className="analytics">
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
