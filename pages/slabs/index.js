import TopNav from '../../components/client/dashboardTopNav'
import SideNav from '../../components/client/dashboardSideNav'
import React, { useState, useEffect, useRef } from 'react'
import withUser from '../withUser'
import SVGs from '../../files/svgs'
import {connect} from 'react-redux'
import {API} from '../../config'
import axios from 'axios'
import { filterTable, tableData } from '../../helpers/tableData'
import { getToken } from '../../helpers/auth'
import _ from 'lodash'

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
  const [search, setSearch] = useState('')
  const [searchLoading, setSearchLoading] = useState(false)
  const [allSlabs, setAllSlabs] = useState(list ? list.slabs : [])

  useEffect(() => {
    setAllSlabs(list.slabs)
  }, [])

  const handleClickOutside = (event) => {
    if(myRefs.current){
      myRefs.current.forEach((item) => {
        if(item){
          if(item.contains(event.target)) return
          if(event.target == document.getElementById('delete-slab')) return
          if(event.target == document.getElementById('edit-slab')) return
          item.childNodes[0].checked = false
          setSlabControls(false)
          setSlabIDControls('')
        }
      })
    }
  }

  useEffect(() => {
    let timeOutSearch
    
    if(search.length > 0){
      setSearchLoading(true)
      timeOutSearch = setTimeout(() => {
        submitSearch()
      }, 2000)
    }

    if(search.length == 0){
      setAllSlabs(list)
      setError('')
    }

    return () => clearTimeout(timeOutSearch)
  }, [search])

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
    let deleteImages = list.filter((item) => {
      if(item._id == idControlsSlab) return item
    })
    setLoading(true)
    setError('')
    try {
      const responseDelete = await axios.post(`${API}/inventory/delete-slab`, {id: idControlsSlab, images: deleteImages[0].images})
      // console.log(responseDelete)
      window.location.href = '/slabs'
      setLoading(false)
    } catch (error) {
      console.log(error)
      setLoading(false)
      if(error) error.response ? setError(error.response.data) : setError('Error deleting from inventory')
    }
  }

  const submitSearch = async (e) => {
    try {
      const responseSearch = await axios.post(`${API}/inventory/slab-search`, {query: search})
      setSearchLoading(false)
      if(responseSearch.data.length > 0) return setAllSlabs(responseSearch.data)
      setAllSlabs([])
      setError('Our search could not find anything')
    } catch (error) {
      console.log(error)
      if(error) error.response ? setError(error.response.data) : setError('There was an error with the search')
    }
  }
  
  return (
    <>
    <TopNav></TopNav>
    <div className="clientDashboard">
      <SideNav width={width} redirect={sendRedirect}></SideNav>
      <div className="table">
        <div className="table-header">
          <div className="table-header-title">Slab Items</div>
          <div className={`form-group-search ` + (controlsSlab ? 'form-group-search-hideOnMobile' : '')}>
            <form autoComplete="off">
              <input 
              type="text" 
              name="search" 
              placeholder="Search" 
              value={search} 
              onChange={(e) => (setSearch(e.target.value))} 
              onFocus={(e) => (e.target.placeholder = '', setMessage(''))} onBlur={(e) => (e.target.placeholder = 'Search', setMessage(''))} 
              onKeyDown={(e) => e.keyCode == 13 ? e.preventDefault() : null}  
              required>
              </input>
            </form>
          </div>
          {controlsSlab &&
          <div className="clientDashboard-view-slab_list-heading-controls">
            <div 
            id="edit-slab" className="clientDashboard-view-slab_list-heading-controls-item edit" 
            onClick={() => idControlsSlab ? window.location.href = `inventory/slab/${idControlsSlab}` : null}>
              Edit
            </div>
            <div 
            id="delete-slab" className="clientDashboard-view-slab_list-heading-controls-item delete" 
            onClick={() => handleDelete()}>
              Delete
            </div>
          </div>
          }
          {loading && <div className="loading"><span></span><span></span><span></span></div>}
          <div className="form-error-container">
            {error && <span className="form-error form-error-list"><SVGs svg={'error'}></SVGs><span>{error}</span></span>}
          </div>
        </div>

        <div className="table-headers">
          <div className="table-headers-item">&nbsp;</div>
          { 
            filterTable(allSlabs).length > 0 && 
            filterTable(allSlabs, ['_id', 'createdAt', 'updatedAt', '__v'], 1).map((item, idx, array) => 
              Object.keys(array[0]).sort((a, b) => sortOrder.indexOf(b) - sortOrder.indexOf(a)).map((key, idx) => 
                <div key={idx} className="table-headers-item">
                  {(key.replace( /([a-z])([A-Z])/g, "$1 $2")).replace('_', ' ')}
                </div>
              )
            )
          }
        </div>      
      </div>
    </div>



    <div className="clientDashboard-view">
        <div className="clientDashboard-view-slab_list-container">
          {searchLoading ? <div className="search-loading"><div className="search-loading-box"><svg><circle cx="20" cy="20" r="20"></circle></svg><span>Loading slabs</span></div></div>: null}
          <div className="clientDashboard-view-slab_list-heading">
            <div className="clientDashboard-view-slab_list-heading-title">Slabs List</div>
            <div className={`form-group-search ` + (controlsSlab ? 'form-group-search-hideOnMobile' : '')}>
              <form autoComplete="off">
                <input type="text" name="search" placeholder="Search" value={search} onChange={(e) => (setSearch(e.target.value))} onFocus={(e) => (e.target.placeholder = '', setError(''))} onBlur={(e) => (e.target.placeholder = 'Search', setError(''))} onKeyDown={(e) => e.keyCode == 13 ? e.preventDefault() : null}  required></input>
              </form>
            </div>
            {controlsSlab &&
              <div className="clientDashboard-view-slab_list-heading-controls">
                <div id="edit-slab" className="clientDashboard-view-slab_list-heading-controls-item edit" onClick={() => idControlsSlab ? window.location.href = `inventory/slab/${idControlsSlab}` : null}>Edit</div>
                <div id="delete-slab" className="clientDashboard-view-slab_list-heading-controls-item delete" onClick={() => handleDelete()}>Delete</div>
              </div>
            }
            {loading && <div className="loading"><span></span><span></span><span></span></div>}
            <div className="form-error-container">
              {error && <span className="form-error form-error-list"><SVGs svg={'error'}></SVGs><span>{error}</span></span>}
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
            {allSlabs.length > 0 && allSlabs.sort((a, b) => a[filter] > b[filter] ? asc : desc).map((item, idx) => (
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
    </>
  )
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

Slabs.getInitialProps = async (context) => {
  let data = new Object()
  let deepClone

  const token = getToken(context.req)
  let accessToken
  if(token){accessToken = token.split('=')[1]}
  
  data.slabs = await tableData(accessToken, 'slabs')
  deepClone = _.cloneDeep(data)

  return {
    list: Object.keys(data).length > 0 ? data : null,
    originalData: Object.keys(deepClone).length > 0 ? deepClone : null
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(withUser(Slabs))