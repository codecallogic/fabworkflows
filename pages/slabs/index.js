import TopNav from '../../components/client/dashboardTopNav'
import SideNav from '../../components/client/dashboardSideNav'
import React, { useState, useEffect, useRef } from 'react'
import withUser from '../withUser'
import SVGs from '../../files/svgs'
import {connect} from 'react-redux'
import {API} from '../../config'
import axios from 'axios'

const Slabs = ({hideSideNav, showSideNav, list}) => {
  const myRefs = useRef([])

  const sendRedirect = true
  const [filter, setFilter] = useState('')
  const [asc, setAsc] = useState(-1)
  const [desc, setDesc] = useState(1)
  const [width, setWidth] = useState()
  const [error, setError] = useState('')
  const [controlsSlab, setSlabControls] = useState(false)
  const [idControlsSlab, setSlabIDControls] = useState('')
  const [loading, setLoading] = useState(false)

  const handleClickOutside = (event) => {
    if(myRefs.current){
      myRefs.current.forEach((item) => {
        if(item.contains(event.target)) return
        if(event.target == document.getElementById('delete-slab')) return
        if(event.target == document.getElementById('edit-slab')) return
        item.childNodes[0].checked = false
        setSlabControls(false)
        setSlabIDControls('')
      })
    }
  }

  useEffect(() => {
    document.addEventListener("click", handleClickOutside, true);

    return () => {
      document.removeEventListener("click", handleClickOutside, true);
    };
  }, [])

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
    return () => {window.removeEventListener("resize", handleResize)}

  }, [width])

  const handleControls = (e, id) => {
    const els = document.querySelectorAll('.clientDashboard-view-slab_list-slabs-checkbox-input')

    els.forEach( (el) => {
      el.checked = false
    })

    e.target.checked = true

    setSlabControls(true)
    return setSlabIDControls(id)
  }

  const handleDelete = async (e) => {
    setLoading(true)
    setError('')
    try {
      const responseDelete = await axios.post(`${API}/inventory/delete-slab`, {id: idControlsSlab})
      console.log(responseDelete)
      window.location.href = '/slabs'
      setLoading(false)
    } catch (error) {
      console.log(error)
      setLoading(false)
      if(error) error.response ? setError(error.response.data) : setError('Error deleting from inventory')
    }
  }
  
  return (
    <>
    <TopNav></TopNav>
    <div className="clientDashboard">
      <SideNav width={width} redirect={sendRedirect}></SideNav>
      <div className="clientDashboard-view">
        <div className="clientDashboard-view-slab_list-container">
          <div className="clientDashboard-view-slab_list-heading">
            <span>Slabs List</span>
            {controlsSlab &&
              <div className="clientDashboard-view-slab_list-heading-controls">
                <div id="edit-slab" className="clientDashboard-view-slab_list-heading-controls-item edit" onClick={() => idControlsSlab ? window.location.href = `inventory/slab/${idControlsSlab}` : null}>Edit</div>
                <div id="delete-slab" className="clientDashboard-view-slab_list-heading-controls-item delete" onClick={() => handleDelete()}>Delete</div>
              </div>
            }
            {loading && <div className="loading"><span></span><span></span><span></span></div>}
            <div className="form-error-container">
              {error && <span className="form-error"><SVGs svg={'error'}></SVGs></span>}
            </div>
          </div>
          <div className="clientDashboard-view-slab_list-headers">
            <div className="clientDashboard-view-slab_list-headers-checkbox"></div>
            <div className="clientDashboard-view-slab_list-headers-item-container">
              <div className="clientDashboard-view-slab_list-headers-item">Image</div>
              <div className="clientDashboard-view-slab_list-headers-item" onClick={(e) => filter == 'block' ? (setAsc(asc == 1 ? -1 : 1 ), setDesc(desc == -1 ? 1 : -1)) : setFilter('block')}>Block <SVGs svg={'sort'}></SVGs></div>
              <div className="clientDashboard-view-slab_list-headers-item" onClick={(e) => filter == 'material' ? (setAsc(asc == 1 ? -1 : 1 ), setDesc(desc == -1 ? 1 : -1)) : setFilter('material')}>Material <SVGs svg={'sort'}></SVGs></div>
              <div className="clientDashboard-view-slab_list-headers-item" onClick={(e) => filter == 'color' ? (setAsc(asc == 1 ? -1 : 1 ), setDesc(desc == -1 ? 1 : -1)) : setFilter('color')}>Color <SVGs svg={'sort'}></SVGs></div>
              <div className="clientDashboard-view-slab_list-headers-item" onClick={(e) => filter == 'quantity' ? (setAsc(asc == 1 ? -1 : 1 ), setDesc(desc == -1 ? 1 : -1)) : setFilter('quantity')}>Quantity <SVGs svg={'sort'}></SVGs></div>
              <div className="clientDashboard-view-slab_list-headers-item" onClick={(e) => filter == 'size' ? (setAsc(asc == 1 ? -1 : 1 ), setDesc(desc == -1 ? 1 : -1)) : setFilter('size')}>Size <SVGs svg={'sort'}></SVGs></div>
              <div className="clientDashboard-view-slab_list-headers-item" onClick={(e) => filter == 'thickness' ? (setAsc(asc == 1 ? -1 : 1 ), setDesc(desc == -1 ? 1 : -1)) : setFilter('thickness')}>Thickness <SVGs svg={'sort'}></SVGs></div>
              <div className="clientDashboard-view-slab_list-headers-item" onClick={(e) => filter == 'price' ? (setAsc(asc == 1 ? -1 : 1 ), setDesc(desc == -1 ? 1 : -1)) : setFilter('price')}>Price <SVGs svg={'sort'}></SVGs></div>
              <div className="clientDashboard-view-slab_list-headers-item" onClick={(e) => filter == 'grade' ? (setAsc(asc == 1 ? -1 : 1 ), setDesc(desc == -1 ? 1 : -1)) : setFilter('grade')}>Grade <SVGs svg={'sort'}></SVGs></div>
              <div className="clientDashboard-view-slab_list-headers-item" onClick={(e) => filter == 'finish' ? (setAsc(asc == 1 ? -1 : 1 ), setDesc(desc == -1 ? 1 : -1)) : setFilter('finish')}>Finish <SVGs svg={'sort'}></SVGs></div>
              <div className="clientDashboard-view-slab_list-headers-item" onClick={(e) => filter == 'location' ? (setAsc(asc == 1 ? -1 : 1 ), setDesc(desc == -1 ? 1 : -1)) : setFilter('location')}>Location <SVGs svg={'sort'}></SVGs></div>
              <div className="clientDashboard-view-slab_list-headers-item"></div>
              <div className="clientDashboard-view-slab_list-headers-item"></div>
            </div>
          </div>
          <div className="clientDashboard-view-slab_list-slabs-container">
            {list && list.sort((a, b) => a[filter] > b[filter] ? asc : desc).map((item, idx) => (
            <div key={idx} className="clientDashboard-view-slab_list-slabs">
                <div className="clientDashboard-view-slab_list-slabs-checkbox" ref={(el) => (myRefs.current[idx] = el)}>
                  <input className="clientDashboard-view-slab_list-slabs-checkbox-input" type="checkbox" id={`slab ` + `${idx}`} onClick={(e) => e.target.checked == true ? (handleControls(e, item._id), window.scrollTo({top: 0})) : (setSlabControls(false), setSlabIDControls(''))}/>
                  <label htmlFor={`slab ` + `${idx}`} onBlur={() => (setSlabControls(false), setSlabIDControls(''))}><span>&nbsp;</span></label>
                </div>
                <div className="clientDashboard-view-slab_list-slabs-item-container"  onClick={() => window.location.href = `/inventory/slab/${item._id}`}>
                  <div className="clientDashboard-view-slab_list-slabs-item">{item.images.length > 0 ? <img src={item.images[0].location} alt="" /> : null}</div>
                  <div className="clientDashboard-view-slab_list-slabs-item">{item.block}</div>
                  <div className="clientDashboard-view-slab_list-slabs-item">{item.material}</div>
                  <div className="clientDashboard-view-slab_list-slabs-item">{item.color}</div>
                  <div className="clientDashboard-view-slab_list-slabs-item">{item.quantity}</div>
                  <div className="clientDashboard-view-slab_list-slabs-item">{item.size_1} x {item.size_2}</div>
                  <div className="clientDashboard-view-slab_list-slabs-item">{item.thickness}</div>
                  <div className="clientDashboard-view-slab_list-slabs-item">{item.price_slab}</div>
                  <div className="clientDashboard-view-slab_list-slabs-item">{item.grade}</div>
                  <div className="clientDashboard-view-slab_list-slabs-item">{item.finish}</div>
                  <div className="clientDashboard-view-slab_list-slabs-item">{item.location}</div>
                  <div className="clientDashboard-view-slab_list-slabs-item"></div>
                  <div className="clientDashboard-view-slab_list-slabs-item"></div>
                </div>
            </div>
            ))}
          </div>
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

// e.target.checked == true ? (handleControls(e), setControls(true), setIDControls(item._id), window.scrollTo({top: 0})) : (setControls(false), setIDControls(''))