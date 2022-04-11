import {connect} from 'react-redux'

const TopNav = ({account, toggleSideNav}) => {
  return (
    <div className="clientDashboard_topnav">
      <div className="clientDashboard_topnav-logo">
        <img src="/media/logo_4.png" alt="Logo" />
      </div>
      <div className="clientDashboard_topnav-menu">
        <div className="clientDashboard_topnav-menu-mobile">
          <div className="clientDashboard_topnav-menu-mobile-user">Welcome, {account.firstName}</div>
          <input type="checkbox" className="clientDashboard_topnav-menu-mobile-checkbox" id="nav-toggle"/>
          <label className="clientDashboard_topnav-menu-mobile-button" htmlFor="nav-toggle" onClick={toggleSideNav}>
              <span className="clientDashboard_topnav-menu-mobile-icon">&nbsp;</span>
          </label>
        </div>
        <div className="clientDashboard_topnav-menu-account">
          <img src="/media/user_placeholder.png" alt="User avatar"/>
          <div>Welcome, {account.firstName}</div>
        </div>
      </div>
    </div>
  )
}

const mapDispatchToProps = dispatch => {
  return {
    toggleSideNav: () => dispatch({type: 'TOGGLE_SIDENAV'})
  }
}

export default connect(null, mapDispatchToProps)(TopNav)
