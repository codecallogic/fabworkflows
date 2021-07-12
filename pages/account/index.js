import TopNav from '../../components/client/dashboardTopNav'
import SideNav from '../../components/client/dashboardSideNav'
import {connect} from 'react-redux'

const Dashboard = ({}) => {
  
  return (
    <>
      <TopNav></TopNav>
      <div className="clientDashboard">
        <SideNav></SideNav>
        <div className="clientDashboard-view">
          Hello
        </div>
      </div>
    </>
  )
}

const mapStateToProps = state => {
  return {
    nav: state.nav
  }
}

export default connect(mapStateToProps)(Dashboard)
