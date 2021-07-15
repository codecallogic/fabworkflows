import {useState, useEffect} from 'react'
import {connect} from 'react-redux'
import SVGs from '../../files/svgs'

const SideNav = ({nav, toggleSideNav, newView}) => {

  const [toggle, setDropdownToggle] = useState(false)
  
  const toggleDropdown = () => {
    let el = document.getElementById('dropdown-toggle-inventory').checked
    setDropdownToggle(el)
  }                                                                                                                              
  
  return (
    <div className={`clientDashboard_sidenav` + (!nav.sidenav ? ' hide-sidenav' : '')}>
      <div className="clientDashboard_sidenav-menu">
          <div className={`clientDashboard_sidenav-menu-account` + (!nav.sidenav ? ' hide-sidenav-items' : '')}>
            <img src="/media/user_placeholder.png" alt="User avatar"/>
            <div>Free trial</div>
          </div>
          <div className={`clientDashboard_sidenav-menu-item` + (!nav.sidenav ? ' hide-sidenav-items' : '')} onClick={ (e) => (document.getElementById('dropdown-toggle-inventory').checked = !document.getElementById('dropdown-toggle-inventory').checked, toggleDropdown())}>
            <div className="clientDashboard_sidenav-menu-item-tab">
              <SVGs svg={'inventory'} classprop={'clientDashboard_sidenav-menu-item-tabIcon' + (!nav.sidenav ? ' hide-sidenav-items' : '')}></SVGs>
              <div className={!nav.sidenav ? ' hide-sidenav-items' : ''}>Inventory</div>
            </div>
            <div className="clientDashboard_sidenav-menu-item-arrow">
              <input type="checkbox" className='clientDashboard_sidenav-menu-item-arrow-input' id="dropdown-toggle-inventory"/>
              <SVGs svg={'dropdown-arrow'} classprop={(!nav.sidenav ? ' hide-sidenav-items' : '')}></SVGs>
            </div>
          </div>
          <div className="clientDashboard_sidenav-menu-item-dropdown">
            <div className={`clientDashboard_sidenav-menu-item-dropdown-fill` + (!nav.sidenav ? ' hide-sidenav-items' : '') + (toggle ? ' hide-sidenav-dropdown' : '')}></div>
            <div onClick={() => (newView(), toggleSideNav('toggle_nav_button'))} className={`clientDashboard_sidenav-menu-item-dropdown-item` + (!nav.sidenav ? ' hide-sidenav-items' : '') + (toggle ? ' hide-sidenav-dropdown' : '')}><SVGs svg={'circle-thin'} classprop={`clientDashboard_sidenav-menu-item-arrow` + (!nav.sidenav ? ' hide-sidenav-items' : '')  + (toggle ? ' hide-sidenav-dropdown' : '')}></SVGs>New</div>
            <div className={`clientDashboard_sidenav-menu-item-dropdown-item` + (!nav.sidenav ? ' hide-sidenav-items' : '') + (toggle ? ' hide-sidenav-dropdown' : '')}><SVGs svg={'circle-thin'} classprop={'clientDashboard_sidenav-menu-item-arrow' + (!nav.sidenav ? ' hide-sidenav-items' : '') + (toggle ? ' hide-sidenav-dropdown' : '')}></SVGs>List of Slabs</div>
            <div className={`clientDashboard_sidenav-menu-item-dropdown-item` + (!nav.sidenav ? ' hide-sidenav-items' : '') + (toggle ? ' hide-sidenav-dropdown' : '')}><SVGs svg={'circle-thin'} classprop={'clientDashboard_sidenav-menu-item-arrow' + (!nav.sidenav ? ' hide-sidenav-items' : '') + (toggle ? ' hide-sidenav-dropdown' : '')}></SVGs>List of Tracker</div>
            <div className={`clientDashboard_sidenav-menu-item-dropdown-item` + (!nav.sidenav ? ' hide-sidenav-items' : '') + (toggle ? ' hide-sidenav-dropdown' : '')}><SVGs svg={'circle-thin'} classprop={'clientDashboard_sidenav-menu-item-arrow' + (!nav.sidenav ? ' hide-sidenav-items' : '') + (toggle ? ' hide-sidenav-dropdown' : '')}></SVGs>List of Products</div>
            <div className={`clientDashboard_sidenav-menu-item-dropdown-fill` + (!nav.sidenav ? ' hide-sidenav-items' : '') + (toggle ? ' hide-sidenav-dropdown' : '')}></div>
          </div>
      </div>
    </div>
  )
}

const mapStateToProps = state => {
  return {
    nav: state.nav
  }
}

const mapDispatchToProps = dispatch => {
  return {
    toggleSideNav: (toggle) => dispatch({type: 'TOGGLE_SIDENAV', toggle: toggle}),
    newView: (type) => dispatch({type: 'NEW_VIEW'}),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(SideNav)