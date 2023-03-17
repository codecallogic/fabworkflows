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
        Products
        </div>
        <span>{allData['products'].length}</span>
      </div>
    </div>
  )
}

export default Analytics
