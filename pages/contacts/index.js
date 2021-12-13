import TopNav from '../../components/client/dashboardTopNav'
import SideNav from '../../components/client/dashboardSideNav'
import React, { useState, useEffect, useRef} from 'react'
import withUser from '../withUser'
import SVGs from '../../files/svgs'
import AddressModal from '../../components/modals/Address'
import {connect} from 'react-redux'
import {API} from '../../config'
import axios from 'axios'

const Contacts = ({hideSideNav, showSideNav, createQuote, resetQuote, list}) => {
  // console.log(list)
  const myRefs = useRef([])
  
  const sendRedirect = true
  const [width, setWidth] = useState()
  const [error, setError] = useState('')
  const [controls, setControls] = useState(false)
  const [idControls, setIDControls] = useState('')
  const [filterContact, setFilterContact] = useState('')
  const [ascContact, setAscContact] = useState(-1)
  const [descContact, setDescContact] = useState(1)
  const [loading, setLoading] = useState(false)
  const [search, setSearch] = useState('')
  const [searchLoading, setSearchLoading] = useState(false)
  const [allContacts, setAllContacts] = useState(list ? list: [])
  const [modal, setModal] = useState('')

  const handleClickOutside = (event) => {
    if(myRefs.current){
      myRefs.current.forEach((item) => {
        if(item){
          if(item.contains(event.target)) return
          if(event.target == document.getElementById('delete-contact')) return
          if(event.target == document.getElementById('edit-contact')) return
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
      setAllContacts(list)
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
    setLoading(true)
    // setError('')
    try {
      const responseDelete = await axios.post(`${API}/transaction/delete-address`, {id: idControls})
      window.location.reload()
    } catch (error) {
      if(error) error.response ? setError(error.response.data) : setError('Error deleting contact')
    }
  }

  const submitSearch = async (e) => {
    try {
      const responseSearch = await axios.post(`${API}/inventory/Contact-search`, {query: search})
      setSearchLoading(false)
      if(responseSearch.data.length > 0) return setAllContacts(responseSearch.data)
      setAllContacts([])
      setError('Our search could not find anything')
    } catch (error) {
      console.log(error)
      if(error) error.response ? setError(error.response.data) : setError('There was an error with the search')
    }
  }

  const setEditContact = () => {
    allContacts.forEach((item) => {
      if(item._id == idControls){
        for(let key in item){
          createQuote(key, item[key])
        }
      }
    })
  }
  
  return (
    <>
    <TopNav></TopNav>
    <div className="clientDashboard">
      <SideNav width={width} redirect={sendRedirect}></SideNav>
      <div className="clientDashboard-view">
        <div className="clientDashboard-view-slab_list-container">
          {searchLoading ? <div className="search-loading"><div className="search-loading-box"><svg><circle cx="20" cy="20" r="20"></circle></svg><span>Loading Contacts</span></div></div>: null}
          <div className="clientDashboard-view-slab_list-heading">
            <div className="clientDashboard-view-slab_list-heading-title">Contact List</div>
            {/* <div className={`form-group-search ` + (controls ? 'form-group-search-hideOnMobile' : '')}>
              <form autoComplete="off">
                <input type="text" name="search" placeholder="Search" value={search} onChange={(e) => (setSearch(e.target.value))} onFocus={(e) => (e.target.placeholder = '', setError(''))} onBlur={(e) => (e.target.placeholder = 'Search', setError(''))} onKeyDown={(e) => e.keyCode == 13 ? e.preventDefault() : null}  required></input>
              </form>
            </div> */}
            {controls &&
              <div className="clientDashboard-view-slab_list-heading-controls">
                <div id="edit-contact" className="clientDashboard-view-slab_list-heading-controls-item edit" onClick={() => idControls ? (setEditContact(), setModal('contact')) : null}>Edit</div>
                <div id="delete-contact" className="clientDashboard-view-slab_list-heading-controls-item delete" onClick={() => handleDelete()}>Delete</div>
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
              <div className="clientDashboard-view-slab_list-headers-item w10" onClick={(e) => filterContact == 'address_one' ? (setAscContact(ascContact == 1 ? -1 : 1 ), setDescContact(descContact == -1 ? 1 : -1)) : setFilterContact('address_one')}>Address <SVGs svg={'sort'}></SVGs></div>
              <div className="clientDashboard-view-slab_list-headers-item w10" onClick={(e) => filterContact == 'contact_name' ? (setAscContact(ascContact == 1 ? -1 : 1 ), setDescContact(descContact == -1 ? 1 : -1)) : setFilterContact('contact_name')}>Name <SVGs svg={'sort'}></SVGs></div>
              <div className="clientDashboard-view-slab_list-headers-item w10" onClick={(e) => filterContact == 'city' ? (setAscContact(ascContact == 1 ? -1 : 1 ), setDescContact(descContact == -1 ? 1 : -1)) : setFilterContact('city')}>City <SVGs svg={'sort'}></SVGs></div>
              <div className="clientDashboard-view-slab_list-headers-item w10" onClick={(e) => filterContact == 'state' ? (setAscContact(ascContact == 1 ? -1 : 1 ), setDescContact(descContact == -1 ? 1 : -1)) : setFilterContact('state')}>State <SVGs svg={'sort'}></SVGs></div>
              <div className="clientDashboard-view-slab_list-headers-item w10" onClick={(e) => filterContact == 'zip_code' ? (setAscContact(ascContact == 1 ? -1 : 1 ), setDescContact(descContact == -1 ? 1 : -1)) : setFilterContact('zip_code')}>Zip Code <SVGs svg={'sort'}></SVGs></div>
              <div className="clientDashboard-view-slab_list-headers-item w10" onClick={(e) => filterContact == 'cell' ? (setAscContact(ascContact == 1 ? -1 : 1 ), setDescContact(descContact == -1 ? 1 : -1)) : setFilterContact('cell')}>Phone <SVGs svg={'sort'}></SVGs></div>
              <div className="clientDashboard-view-slab_list-headers-item w10" onClick={(e) => filterContact == 'email' ? (setAscContact(ascContact == 1 ? -1 : 1 ), setDescContact(descContact == -1 ? 1 : -1)) : setFilterContact('email')}>Email <SVGs svg={'sort'}></SVGs></div>
              <div className="clientDashboard-view-slab_list-headers-item w10" onClick={(e) => filterContact == 'address_notes' ? (setAscContact(ascContact == 1 ? -1 : 1 ), setDescContact(descContact == -1 ? 1 : -1)) : setFilterContact('address_notes')}>Notes <SVGs svg={'sort'}></SVGs></div>
              <div className="clientDashboard-view-slab_list-headers-item"></div>
              <div className="clientDashboard-view-slab_list-headers-item"></div>
            </div>
          </div>
          <div className="clientDashboard-view-slab_list-slabs-container">
            {allContacts.length > 0 && allContacts.sort((a, b) => a[filterContact] > b[filterContact] ? ascContact : descContact).map((item, idx) => (
            <div key={idx} className="clientDashboard-view-slab_list-slabs">
                <div className="clientDashboard-view-slab_list-slabs-checkbox" ref={(el) => (myRefs.current[idx] = el)}>
                  <input className="clientDashboard-view-slab_list-slabs-checkbox-input" type="checkbox" id={`contact ` + `${idx}`} onClick={(e) => e.target.checked == true ? (handleControls(e, item._id), window.scrollTo({top: 0})) : (setControls(false), setIDControls(''))} />
                  <label htmlFor={`contact ` + `${idx}`}><span>&nbsp;</span></label>
                </div>
                <div className="clientDashboard-view-slab_list-slabs-item-container"  onClick={() => window.location.href = `/inventory/contact/${item._id}`}>
                  <div className="clientDashboard-view-slab_list-slabs-item w10">{item.address_one}</div>
                  <div className="clientDashboard-view-slab_list-slabs-item w10">{item.contact_name}</div>
                  <div className="clientDashboard-view-slab_list-slabs-item w10">{item.city}</div>
                  <div className="clientDashboard-view-slab_list-slabs-item w10">{item.state}</div>
                  <div className="clientDashboard-view-slab_list-slabs-item w10">{item.zip_code}</div>
                  <div className="clientDashboard-view-slab_list-slabs-item w10">{item.cell}</div>
                  <div className="clientDashboard-view-slab_list-slabs-item w10">{item.email}</div>
                  <div className="clientDashboard-view-slab_list-slabs-item w10"><span>{item.address_notes}</span></div>
                  <div className="clientDashboard-view-slab_list-slabs-item"></div>
                  <div className="clientDashboard-view-slab_list-slabs-item"></div>
                </div>
            </div>
            ))}
          </div>
        </div>
      </div>
    </div>
    { modal == 'contact' && 
      <AddressModal setmodal={setModal} update='true' id={idControls}></AddressModal>
    }

    </>
  )
}

Contacts.getInitialProps = async () => {
  let data
  let error
  try {
    const responseAddresses = await axios.get(`${API}/transaction/get-address-list`)
    data = responseAddresses.data
  } catch (error) {
    console.log(error)
  }

  return {
    list: data ? data : null
  }
}

const mapStateToProps = state => {
  return {
    quote: state.quote
  }
}

const mapDispatchToProps = dispatch => {
  return {
    hideSideNav: () => dispatch({type: 'HIDE_SIDENAV'}),
    showSideNav: () => dispatch({type: 'SHOW_SIDENAV'}),
    createQuote: (name, data) => dispatch({type: 'CREATE_QUOTE', name: name, value: data}),
    resetQuote: () => dispatch({type: 'RESET'})
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(withUser(Contacts))
