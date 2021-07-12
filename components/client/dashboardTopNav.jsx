import {connect} from 'react-redux'

const TopNav = ({toggleSideNav}) => {
  
  return (
    <div className="clientDashboard_topnav">
      <div className="clientDashboard_topnav-logo">
        <img src="/media/logo_2.png" alt="Logo" />
      </div>
      <div className="clientDashboard_topnav-menu">
        <div className="clientDashboard_topnav-menu-account">
          <img src="/media/user_placeholder.png" alt="User avatar" onClick={toggleSideNav}/>
          <div>Free trial</div>
        </div>
      </div>
    </div>
  )
}

const mapDispatchToProps = dispatch => {
  return {
    toggleSideNav: () => dispatch({type: 'toggleSideNav'})
  }
}

export default connect(null, mapDispatchToProps)(TopNav)
