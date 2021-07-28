import TopNav from '../../components/client/dashboardTopNav'
import SideNav from '../../components/client/dashboardSideNav'
import React, { useState, useEffect } from 'react'
import withUser from '../withUser'
import SVGs from '../../files/svgs'
import {connect} from 'react-redux'
import {API} from '../../config'
import axios from 'axios'

const Slabs = ({hideSideNav, showSideNav, list}) => {

  const sendRedirect = true
  const [width, setWidth] = useState()
  const [error, setError] = useState('')

  useEffect(() => {
    if(window.innerWidth < 992) hideSideNav()
    
    function handleResize() {
      if(width){
        if(width < 992){hideSideNav()}
        if(width > 992){showSideNav()}
      }
      setWidth(window.innerWidth);
    }
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);

  }, [width])
  
  return (
    <>
    <TopNav></TopNav>
    <div className="clientDashboard">
      <SideNav width={width} redirect={sendRedirect}></SideNav>
      <div className="clientDashboard-view">
        <div className="clientDashboard-view-slab_list-container">
          <div className="clientDashboard-view-slab_list-heading">
            <span>Slabs List</span>
            <div className="form-error-container">
              {error && <span className="form-error"><SVGs svg={'error'}></SVGs></span>}
            </div>
          </div>
          <div className="clientDashboard-view-slab_list-headers">
            <div className="clientDashboard-view-slab_list-headers-checkbox"></div>
            <div className="clientDashboard-view-slab_list-headers-item-container">
              <div className="clientDashboard-view-slab_list-headers-item">Block Number</div>
              <div className="clientDashboard-view-slab_list-headers-item">Size</div>
              <div className="clientDashboard-view-slab_list-headers-item">Thickness</div>
              <div className="clientDashboard-view-slab_list-headers-item">Price</div>
              <div className="clientDashboard-view-slab_list-headers-item">Grade</div>
              <div className="clientDashboard-view-slab_list-headers-item">Finish</div>
              <div className="clientDashboard-view-slab_list-headers-item">Location</div>
            </div>
          </div>
          {list && list.map((item, idx) => (
          <div key={idx} className="clientDashboard-view-slab_list-slabs">
                <div className="clientDashboard-view-slab_list-slabs-checkbox"></div>
                <div className="clientDashboard-view-slab_list-slabs-item-container"  onClick={() => window.location.href = `/inventory/${item._id}`}>
                  <div className="clientDashboard-view-slab_list-slabs-item">{item.block}</div>
                  <div className="clientDashboard-view-slab_list-slabs-item">{item.size_1} x {item.size_2}</div>
                  <div className="clientDashboard-view-slab_list-slabs-item">{item.thickness}</div>
                  <div className="clientDashboard-view-slab_list-slabs-item">{item.price_slab}</div>
                  <div className="clientDashboard-view-slab_list-slabs-item">{item.grade}</div>
                  <div className="clientDashboard-view-slab_list-slabs-item">{item.finish}</div>
                  <div className="clientDashboard-view-slab_list-slabs-item">{item.location}</div>
                </div>
          </div>
          ))}
        </div>
      </div>
    </div>
    </>
  )
}

Slabs.getInitialProps = async () => {
  let data
  let error
  try {
    const responseSlabs = await axios.get(`${API}/inventory/all-slabs`)
    data = responseSlabs.data
  } catch (error) {
    console.log(error)
  }

  return {
    list: data ? data : null
  }
}

const mapStateToProps = state => {
  return {
    slab: state.slab
  }
}

const mapDispatchToProps = dispatch => {
  return {
    hideSideNav: () => dispatch({type: 'HIDE_SIDENAV'}),
    showSideNav: () => dispatch({type: 'SHOW_SIDENAV'}),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(withUser(Slabs))
