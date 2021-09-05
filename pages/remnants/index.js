import TopNav from '../../components/client/dashboardTopNav'
import SideNav from '../../components/client/dashboardSideNav'
import React, { useState, useEffect, useRef} from 'react'
import withUser from '../withUser'
import SVGs from '../../files/svgs'
import {connect} from 'react-redux'
import {API} from '../../config'
import axios from 'axios'

const Remnants = ({hideSideNav, showSideNav, list}) => {
  // console.log(list)
  const myRefs = useRef([])
  
  const sendRedirect = true
  const [width, setWidth] = useState()
  const [error, setError] = useState('')
  const [controls, setControls] = useState(false)
  const [idControls, setIDControls] = useState('')
  const [filterRemnant, setFilterRemnant] = useState('')
  const [ascRemnant, setAscRemnant] = useState(-1)
  const [descRemnant, setDescRemnant] = useState(1)
  const [loading, setLoading] = useState(false)
  const [search, setSearch] = useState('')
  const [searchLoading, setSearchLoading] = useState(false)
  const [allRemnants, setAllRemnants] = useState(list ? list: [])

  const handleClickOutside = (event) => {
    if(myRefs.current){
      myRefs.current.forEach((item) => {
        if(item){
          if(item.contains(event.target)) return
          if(event.target == document.getElementById('delete-remnant')) return
          if(event.target == document.getElementById('edit-remnant')) return
          item.childNodes[0].checked = false
          setControls(false)
          setIDControls('')
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
      setAllRemnants(list)
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
    return () => window.removeEventListener("resize", handleResize);

  }, [width])

  const handleControls = (e, id) => {
    const els = document.querySelectorAll('.clientDashboard-view-slab_list-slabs-checkbox-input')

    els.forEach( (el) => {
      el.checked = false
    })

    e.target.checked = true

    setControls(true)
    return setIDControls(id)
  }

  const handleDelete = async (e) => {    
    let deleteImages = list.filter((item) => {
      if(item._id == idControls) return item
    })
    setLoading(true)
    setError('')
    try {
      const responseDelete = await axios.post(`${API}/inventory/delete-remnant`, {id: idControls, images: deleteImages[0].images})
      window.location.href = '/remnants'
    } catch (error) {
      if(error) error.response ? setError(error.response.data) : setError('Error deleting from inventory')
    }
  }

  const submitSearch = async (e) => {
    try {
      const responseSearch = await axios.post(`${API}/inventory/remnant-search`, {query: search})
      setSearchLoading(false)
      if(responseSearch.data.length > 0) return setAllRemnants(responseSearch.data)
      setAllRemnants([])
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
      <div className="clientDashboard-view">
        <div className="clientDashboard-view-slab_list-container">
          {searchLoading ? <div className="search-loading"><div className="search-loading-box"><svg><circle cx="20" cy="20" r="20"></circle></svg><span>Loading slabs</span></div></div>: null}
          <div className="clientDashboard-view-slab_list-heading">
            <div className="clientDashboard-view-slab_list-heading-title">Remnants List</div>
            <div className={`form-group-search ` + (controls ? 'form-group-search-hideOnMobile' : '')}>
              <form autoComplete="off">
                <input type="text" name="search" placeholder="Search" value={search} onChange={(e) => (setSearch(e.target.value))} onFocus={(e) => (e.target.placeholder = '', setError(''))} onBlur={(e) => (e.target.placeholder = 'Search', setError(''))} onKeyDown={(e) => e.keyCode == 13 ? e.preventDefault() : null}  required></input>
              </form>
            </div>
            {controls &&
              <div className="clientDashboard-view-slab_list-heading-controls">
                <div id="edit-remnant" className="clientDashboard-view-slab_list-heading-controls-item edit" onClick={() => idControls ? window.location.href = `inventory/remnant/${idControls}` : null}>Edit</div>
                <div id="delete-remnant" className="clientDashboard-view-slab_list-heading-controls-item delete" onClick={() => handleDelete()}>Delete</div>
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
              <div className="clientDashboard-view-slab_list-headers-item" onClick={(e) => filterRemnant == 'name' ? (setAscRemnant(ascRemnant == 1 ? -1 : 1 ), setDescRemnant(descRemnant == -1 ? 1 : -1)) : setFilterRemnant('name')}>Name <SVGs svg={'sort'}></SVGs></div>
              <div className="clientDashboard-view-slab_list-headers-item" onClick={(e) => filterRemnant == 'material' ? (setAscRemnant(ascRemnant == 1 ? -1 : 1 ), setDescRemnant(descRemnant == -1 ? 1 : -1)) : setFilterRemnant('material')}>Material <SVGs svg={'sort'}></SVGs></div>
              <div className="clientDashboard-view-slab_list-headers-item" onClick={(e) => filterRemnant == 'color' ? (setAscRemnant(ascRemnant == 1 ? -1 : 1 ), setDescRemnant(descRemnant == -1 ? 1 : -1)) : setFilterRemnant('color')}>Color <SVGs svg={'sort'}></SVGs></div>
              <div className="clientDashboard-view-slab_list-headers-item" onClick={(e) => filterRemnant == 'l1' ? (setAscRemnant(ascRemnant == 1 ? -1 : 1 ), setDescRemnant(descRemnant == -1 ? 1 : -1)) : setFilterRemnant('l1')}>A x B<SVGs svg={'sort'}></SVGs></div>
              <div className="clientDashboard-view-slab_list-headers-item" onClick={(e) => filterRemnant == 'l2' ? (setAscRemnant(ascRemnant == 1 ? -1 : 1 ), setDescRemnant(descRemnant == -1 ? 1 : -1)) : setFilterRemnant('l2')}>C x D<SVGs svg={'sort'}></SVGs></div>
              <div className="clientDashboard-view-slab_list-headers-item" onClick={(e) => filterRemnant == 'lot' ? (setAscRemnant(ascRemnant == 1 ? -1 : 1 ), setDescRemnant(descRemnant == -1 ? 1 : -1)) : setFilterRemnant('lot')}>Lot <SVGs svg={'sort'}></SVGs></div>
              <div className="clientDashboard-view-slab_list-headers-item" onClick={(e) => filterRemnant == 'bundle' ? (setAscRemnant(ascRemnant == 1 ? -1 : 1 ), setDescRemnant(descRemnant == -1 ? 1 : -1)) : setFilterRemnant('bundle')}>Bundle <SVGs svg={'sort'}></SVGs></div>
              <div className="clientDashboard-view-slab_list-headers-item" onClick={(e) => filterRemnant == 'supplier_ref' ? (setAscRemnant(ascRemnant == 1 ? -1 : 1 ), setDescRemnant(descRemnant == -1 ? 1 : -1)) : setFilterRemnant('supplier_ref')}>Supplier Ref <SVGs svg={'sort'}></SVGs></div>
              <div className="clientDashboard-view-slab_list-headers-item" onClick={(e) => filterRemnant == 'bin' ? (setAscRemnant(ascRemnant == 1 ? -1 : 1 ), setDescRemnant(descRemnant == -1 ? 1 : -1)) : setFilterRemnant('bin')}>Bin <SVGs svg={'sort'}></SVGs></div>
              <div className="clientDashboard-view-slab_list-headers-item" onClick={(e) => filterRemnant == 'notes' ? (setAscRemnant(ascRemnant == 1 ? -1 : 1 ), setDescRemnant(descRemnant == -1 ? 1 : -1)) : setFilterRemnant('notes')}>Notes <SVGs svg={'sort'}></SVGs></div>
              <div className="clientDashboard-view-slab_list-headers-item"></div>
              <div className="clientDashboard-view-slab_list-headers-item"></div>
            </div>
          </div>
          <div className="clientDashboard-view-slab_list-slabs-container">
            {allRemnants && allRemnants.sort((a, b) => a[filterRemnant] > b[filterRemnant] ? ascRemnant : descRemnant).map((item, idx) => (
            <div key={idx} className="clientDashboard-view-slab_list-slabs">
                <div className="clientDashboard-view-slab_list-slabs-checkbox" ref={(el) => (myRefs.current[idx] = el)}>
                  <input className="clientDashboard-view-slab_list-slabs-checkbox-input" type="checkbox" id={`slab ` + `${idx}`} onClick={(e) => e.target.checked == true ? (handleControls(e, item._id), window.scrollTo({top: 0})) : (setControls(false), setIDControls(''))} />
                  <label htmlFor={`slab ` + `${idx}`}><span>&nbsp;</span></label>
                </div>
                <div className="clientDashboard-view-slab_list-slabs-item-container"  onClick={() => window.location.href = `/inventory/remnant/${item._id}`}>
                  <div className="clientDashboard-view-slab_list-slabs-item">{item.images.length > 0 ? <img src={item.images[0].location} alt="" /> : null}</div>
                  <div className="clientDashboard-view-slab_list-slabs-item">{item.name}</div>
                  <div className="clientDashboard-view-slab_list-slabs-item">{item.material}</div>
                  <div className="clientDashboard-view-slab_list-slabs-item">{item.color}</div>
                  <div className="clientDashboard-view-slab_list-slabs-item">{item.l1} x {item.w1}</div>
                  <div className="clientDashboard-view-slab_list-slabs-item">{item.l2} x {item.w2}</div>
                  <div className="clientDashboard-view-slab_list-slabs-item">{item.lot}</div>
                  <div className="clientDashboard-view-slab_list-slabs-item">{item.bundle}</div>
                  <div className="clientDashboard-view-slab_list-slabs-item">{item.supplier_ref}</div>
                  <div className="clientDashboard-view-slab_list-slabs-item">{item.bin}</div>
                  <div className="clientDashboard-view-slab_list-slabs-item">{item.notes}</div>
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

Remnants.getInitialProps = async () => {
  let data

  try {
    const responseRemnants = await axios.get(`${API}/inventory/all-remnants`)
    data = responseRemnants.data
  } catch (error) {
    console.log(error)
  }

  return {
    list: data ? data : null
  }
}

const mapStateToProps = state => {
  return {
    remnant: state.remnant
  }
}

const mapDispatchToProps = dispatch => {
  return {
    hideSideNav: () => dispatch({type: 'HIDE_SIDENAV'}),
    showSideNav: () => dispatch({type: 'SHOW_SIDENAV'}),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(withUser(Remnants))
