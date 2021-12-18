import {useState, useEffect} from 'react'
import {connect} from 'react-redux'
import SVGs from '../../files/svgs'

const SideNav = ({nav, width, toggleSideNav, newView, redirect}) => {

  const [toggle, setDropdownToggle] = useState('')
  
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

          <div 
            className={`clientDashboard_sidenav-menu-item` + (!nav.sidenav ? ' hide-sidenav-items' : '')} 
            onClick={ (e) => toggle == 'inventory' ? setDropdownToggle('') : setDropdownToggle('inventory')}>
            <div className="clientDashboard_sidenav-menu-item-tab">
              <SVGs svg={'inventory'} classprop={'clientDashboard_sidenav-menu-item-tabIcon' + (!nav.sidenav ? ' hide-sidenav-items' : '')}></SVGs>
              <div className={!nav.sidenav ? ' hide-sidenav-items' : ''}>Inventory</div>
            </div>
            <div className="clientDashboard_sidenav-menu-item-arrow">
              <SVGs svg={'dropdown-arrow'} classprop={(!nav.sidenav ? ' hide-sidenav-items' : '')}></SVGs>
            </div>
          </div>
          <div className="clientDashboard_sidenav-menu-item-dropdown">
            <div 
              className={`clientDashboard_sidenav-menu-item-dropdown-fill` + (!nav.sidenav ? ' hide-sidenav-items' : '') + (toggle == 'inventory' ? ' hide-sidenav-dropdown' : '')}
            />
            <div 
              onClick={() => (window.location.href = `/account?change=new`, width < 992 ? toggleSideNav('toggle_nav_button') : null)} 
              className={`clientDashboard_sidenav-menu-item-dropdown-item` + (!nav.sidenav ? ' hide-sidenav-items' : '') + (toggle == 'inventory' ? ' hide-sidenav-dropdown' : '')}>
                <SVGs svg={'circle-thin'} 
                classprop={`clientDashboard_sidenav-menu-item-arrow` + (!nav.sidenav ? ' hide-sidenav-items' : '')  + (toggle == 'inventory' ? ' hide-sidenav-dropdown' : '')} />
                New
            </div>
            <div 
              onClick={() => {window.location.href = `/slabs`}} 
              className={`clientDashboard_sidenav-menu-item-dropdown-item` + (!nav.sidenav ? ' hide-sidenav-items' : '') + (toggle == 'inventory' ? ' hide-sidenav-dropdown' : '')}>
                <SVGs svg={'circle-thin'} 
                classprop={'clientDashboard_sidenav-menu-item-arrow' + (!nav.sidenav ? ' hide-sidenav-items' : '') + (toggle == 'inventory' ? ' hide-sidenav-dropdown' : '')}/>
                Slabs
            </div>
            <div 
              onClick={() => {window.location.href = `/products`}} 
              className={`clientDashboard_sidenav-menu-item-dropdown-item` + (!nav.sidenav ? ' hide-sidenav-items' : '') + (toggle == 'inventory' ? ' hide-sidenav-dropdown' : '')}>
                <SVGs svg={'circle-thin'} 
                classprop={'clientDashboard_sidenav-menu-item-arrow' + (!nav.sidenav ? ' hide-sidenav-items' : '') + (toggle == 'inventory' ? ' hide-sidenav-dropdown' : '')}/>
                Products
            </div>
            <div 
              onClick={() => {window.location.href = `/remnants`}} 
              className={`clientDashboard_sidenav-menu-item-dropdown-item` + (!nav.sidenav ? ' hide-sidenav-items' : '') + (toggle == 'inventory' ? ' hide-sidenav-dropdown' : '')}>
                <SVGs svg={'circle-thin'} 
                classprop={'clientDashboard_sidenav-menu-item-arrow' + (!nav.sidenav ? ' hide-sidenav-items' : '') + (toggle == 'inventory' ? ' hide-sidenav-dropdown' : '')}/>
                Remnants
            </div>
            <div 
              onClick={() => {window.location.href = `/trackers`}} 
              className={`clientDashboard_sidenav-menu-item-dropdown-item` + (!nav.sidenav ? ' hide-sidenav-items' : '') + (toggle == 'inventory' ? ' hide-sidenav-dropdown' : '')}>
                <SVGs svg={'circle-thin'} classprop={'clientDashboard_sidenav-menu-item-arrow' + (!nav.sidenav ? ' hide-sidenav-items' : '') + (toggle == 'inventory' ? ' hide-sidenav-dropdown' : '')}/>
                Trackers
              </div>
            <div 
              className={`clientDashboard_sidenav-menu-item-dropdown-fill` + (!nav.sidenav ? ' hide-sidenav-items' : '') + (toggle == 'inventory' ? ' hide-sidenav-dropdown' : '')}>
            </div>
          </div>
          <div 
            className={`clientDashboard_sidenav-menu-item` + (!nav.sidenav ? ' hide-sidenav-items' : '')} 
            onClick={ (e) => toggle == 'transactions' ? setDropdownToggle('') : setDropdownToggle('transactions')}>
            <div className="clientDashboard_sidenav-menu-item-tab">
              <SVGs svg={'payments'} classprop={'clientDashboard_sidenav-menu-item-tabIcon' + (!nav.sidenav ? ' hide-sidenav-items' : '')}></SVGs>
              <div className={!nav.sidenav ? ' hide-sidenav-items' : ''}>Transactions</div>
            </div>
            <div className="clientDashboard_sidenav-menu-item-arrow">
              <input type="checkbox" className='clientDashboard_sidenav-menu-item-arrow-input' id="dropdown-toggle-transactions"/>
              <SVGs svg={'dropdown-arrow'} classprop={(!nav.sidenav ? ' hide-sidenav-items' : '')}></SVGs>
            </div>
          </div>
          <div className="clientDashboard_sidenav-menu-item-dropdown">
            <div 
              className={`clientDashboard_sidenav-menu-item-dropdown-fill` + (!nav.sidenav ? ' hide-sidenav-items' : '') + (toggle == 'transactions' ? ' hide-sidenav-dropdown' : '')}>
            </div>
            <div 
              onClick={() => (window.location.href = `/account?change=transaction-new`, width < 992 ? toggleSideNav('toggle_nav_button') : null)} 
              className={`clientDashboard_sidenav-menu-item-dropdown-item` + (!nav.sidenav ? ' hide-sidenav-items' : '') + (toggle == 'transactions'  ? ' hide-sidenav-dropdown' : '')}>
                <SVGs svg={'circle-thin'} classprop={`clientDashboard_sidenav-menu-item-arrow` + (!nav.sidenav ? ' hide-sidenav-items' : '')  + (toggle == 'transactions'  ? ' hide-sidenav-dropdown' : '')}/>
                New
            </div>
            <div 
              onClick={() => (window.location.href = `/quotes`, width < 992 ? toggleSideNav('toggle_nav_button') : null)} 
              className={`clientDashboard_sidenav-menu-item-dropdown-item` + (!nav.sidenav ? ' hide-sidenav-items' : '') + (toggle == 'transactions'  ? ' hide-sidenav-dropdown' : '')}>
                <SVGs svg={'circle-thin'} classprop={`clientDashboard_sidenav-menu-item-arrow` + (!nav.sidenav ? ' hide-sidenav-items' : '')  + (toggle ? ' hide-sidenav-dropdown' : '')}/>
                Quotes
            </div>
            <div 
              onClick={() => (window.location.href = `/contacts`, width < 992 ? toggleSideNav('toggle_nav_button') : null)} 
              className={`clientDashboard_sidenav-menu-item-dropdown-item` + (!nav.sidenav ? ' hide-sidenav-items' : '') + (toggle == 'transactions'  ? ' hide-sidenav-dropdown' : '')}>
                <SVGs svg={'circle-thin'} classprop={`clientDashboard_sidenav-menu-item-arrow` + (!nav.sidenav ? ' hide-sidenav-items' : '')  + (toggle ? ' hide-sidenav-dropdown' : '')}/>
                Contacts
            </div>
            <div 
              onClick={() => (window.location.href = `/prices`, width < 992 ? toggleSideNav('toggle_nav_button') : null)} 
              className={`clientDashboard_sidenav-menu-item-dropdown-item` + (!nav.sidenav ? ' hide-sidenav-items' : '') + (toggle == 'transactions'  ? ' hide-sidenav-dropdown' : '')}>
                <SVGs svg={'circle-thin'} classprop={`clientDashboard_sidenav-menu-item-arrow` + (!nav.sidenav ? ' hide-sidenav-items' : '')  + (toggle ? ' hide-sidenav-dropdown' : '')}/>
                Prices
            </div>
            <div 
              onClick={() => (window.location.href = `/jobs`, width < 992 ? toggleSideNav('toggle_nav_button') : null)} 
              className={`clientDashboard_sidenav-menu-item-dropdown-item` + (!nav.sidenav ? ' hide-sidenav-items' : '') + (toggle == 'transactions'  ? ' hide-sidenav-dropdown' : '')}>
                <SVGs svg={'circle-thin'} classprop={`clientDashboard_sidenav-menu-item-arrow` + (!nav.sidenav ? ' hide-sidenav-items' : '')  + (toggle ? ' hide-sidenav-dropdown' : '')}/>
                Jobs
            </div>
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
    newView: (value) => dispatch({type: 'NEW_VIEW', value: value}),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(SideNav)