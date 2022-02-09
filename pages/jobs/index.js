import {BlobProvider, PDFViewer, PDFDownloadLink} from '@react-pdf/renderer'
import TopNav from '../../components/client/dashboardTopNav'
import SideNav from '../../components/client/dashboardSideNav'
import React, { useState, useEffect, useRef} from 'react'
import {connect} from 'react-redux'
import SVGs from '../../files/svgs'
import axios from 'axios'
import {API} from '../../config'
import withUser from '../withUser'
import SVG from '../../files/svgs'

const Jobs = ({hideSideNav, showSideNav, list, JobList, createJob, addJobImage, resetJob}) => {
  // console.log(list)
  const myRefs = useRef([])
  const [width, setWidth] = useState()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [allJobs, setAllJobs] = useState(list ? list: [])
  const [filterJob, setFilterJob] = useState('')
  const [ascJob, setAscJob] = useState(-1)
  const [descJob, setDescJob] = useState(1)
  const [isLoaded, setIsLoaded] = useState(false)
  const [controls, setControls] = useState(false)
  const [idControls, setIDControls] = useState('')
  const [modal, setModal] = useState('')
  const [update, setUpdate] = useState('')
  const [dropdown, setDropdown] = useState('')
  
  useEffect(() => {
    setIsLoaded(true)
  }, [])
  
  const handleClickOutside = (event) => {
    if(myRefs.current){
      myRefs.current.forEach((item) => {
        if(item){
          if(item.contains(event.target)) return
          if(event.target == document.getElementById('delete-job')) return
          if(event.target == document.getElementById('edit-job')) return
          item.childNodes[0].checked = false
          setControls(false)
          setIDControls('')
        }
      })
    }
  }

  useEffect(() => {
    // console.log(idControls)
    document.addEventListener("click", handleClickOutside, true);

    return () => {
      document.removeEventListener("click", handleClickOutside, true);
    };
  }, [idControls])
  
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

  const validateIsJobNumber = (amount) => {
    let newValue = amount
    let formatter = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }) 
    return formatter.format(newValue)
  }
  

  const renderQuote = (url) => { 
    if(url) window.open(url, '_blank')
  }

  const renderAgreement = (url) => {
    if(url) window.open(url, '_blank')
  }

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
    setError('')
    
    try {
      const responseDelete = await axios.post(`${API}/transaction/delete-job`, {id: idControls})
      setLoading(false)
      setControls(false)
      setAllJobs([...responseDelete.data])
      
    } catch (error) {
      setLoading(false)
      setControls(false)
      if(error) error.response ? setError(error.response.data) : setError('Error deleting quote from list')
    }
  }

  
  return (
    <>
      <TopNav></TopNav>
      <div className="clientDashboard">
        <SideNav width={width}></SideNav>
        <div className="clientDashboard-view">
          <div className="clientDashboard-view-slab_list-container">
            <div className="clientDashboard-view-slab_list-heading">
              <div className="clientDashboard-view-slab_list-heading-title">Jobs</div>
              {controls &&
              <div className="clientDashboard-view-slab_list-heading-controls">
                <div id="edit-job" className="clientDashboard-view-slab_list-heading-controls-item edit" onClick={() => idControls ? window.location.href = `/jobs/${idControls}` : null}>Edit</div>
                <div id="delete-job" className="clientDashboard-view-slab_list-heading-controls-item delete" onClick={() => handleDelete()}>Delete</div>
              </div>
              }
              {loading && 
              <div className="loading">
                <span></span><span></span><span></span>
              </div>
              }
              <div 
                className="form-error-container">
                {error && 
                <span className="form-error form-error-list"><SVGs svg={'error'}></SVGs><span>{error}</span></span>
                } 
              </div>
            </div>
            <div className="clientDashboard-view-slab_list-headers">
              <div className="clientDashboard-view-slab_list-headers-checkbox"></div>
              <div className="clientDashboard-view-slab_list-headers-item-container">
                <div className="clientDashboard-view-slab_list-headers-item">
                  Name
                </div>
                <div 
                  className="clientDashboard-view-slab_list-headers-item" onClick={(e) => filterJob == 'invoice' ? (setAscJob(ascJob == 1 ? -1 : 1 ), setDescJob(descJob == -1 ? 1 : -1)) : setFilterJob('invoice')}>
                    Invoice
                  <SVGs svg={'sort'}></SVGs>
                </div>
                <div 
                  className="clientDashboard-view-slab_list-headers-item lg-row-item" onClick={(e) => filterJob == 'salesperson' ? (setAscJob(ascJob == 1 ? -1 : 1 ), setDescJob(descJob == -1 ? 1 : -1)) : setFilterJob('salesperson')}>
                    Salesperson
                  <SVGs svg={'sort'}></SVGs>
                </div>
                <div 
                  className="clientDashboard-view-slab_list-headers-item lg-row-item" onClick={(e) => filterJob == 'quotes' ? (setAscJob(ascJob == 1 ? -1 : 1 ), setDescJob(descJob == -1 ? 1 : -1)) : setFilterJob('quotes')}>
                    Quotes
                </div>
                <div 
                  className="clientDashboard-view-slab_list-headers-item lg-row-item" onClick={(e) => filterJob == 'priceList' ? (setAscJob(ascJob == 1 ? -1 : 1 ), setDescJob(descJob == -1 ? 1 : -1)) : setFilterJob('priceList')}>
                    Price List
                </div>
                <div 
                  className="clientDashboard-view-slab_list-headers-item lg-row-item" onClick={(e) => filterJob == 'account' ? (setAscJob(ascJob == 1 ? -1 : 1 ), setDescJob(descJob == -1 ? 1 : -1)) : setFilterJob('account')}>
                    Accounts
                </div>
                <div className="clientDashboard-view-slab_list-headers-item"></div>
                <div className="clientDashboard-view-slab_list-headers-item"></div>
              </div>
            </div>
            <div className="clientDashboard-view-slab_list-slabs-container">
            {allJobs.length > 0 && allJobs.sort((a, b) => a[filterJob] > b[filterJob] ? ascJob : descJob).map((item, idx) => (
              <div key={idx} className="clientDashboard-view-slab_list-slabs">
                  <div className="clientDashboard-view-slab_list-slabs-checkbox" ref={(el) => (myRefs.current[idx] = el)}>
                    <input className="clientDashboard-view-slab_list-slabs-checkbox-input" type="checkbox" id={`job ` + `${idx}`} onClick={(e) => e.target.checked == true ? (handleControls(e, item._id), window.scrollTo({top: 0})) : (setControls(false), setIDControls(''))} />
                    <label htmlFor={`job ` + `${idx}`}><span>&nbsp;</span></label>
                  </div>
                  <div
                  className="clientDashboard-view-slab_list-slabs-item-container">
                    <div className="clientDashboard-view-slab_list-slabs-item">{item.name}
                    </div>
                    <div className="clientDashboard-view-slab_list-slabs-item">{item.invoice}
                    </div>
                    <div className="clientDashboard-view-slab_list-slabs-item lg-row-item">{item.salesperson}
                    </div>
                    <div className="clientDashboard-view-slab_list-slabs-item lg-row-item">
                      <div className="clientDashboard-view-slab_list-slabs-item-dropdown" onClick={() => dropdown == `quote-${idx}` ? setDropdown('') : setDropdown(`quote-${idx}`)}>
                        Quotes <SVG svg={'dropdown-arrow'}></SVG>
                        {dropdown == `quote-${idx}` && 
                        <div key={idx} className="clientDashboard-view-slab_list-slabs-item-dropdown-container">
                          {item.quotes.length > 0 && item.quotes.map((item, idx) => 
                          <div className="clientDashboard-view-slab_list-slabs-item-dropdown-item">
                            <span onClick={() => window.location.href = `/quotes/${item._id}`}>{item.contact_name}</span>
                          </div>
                          )
                          }
                        </div>
                        }
                      </div> 
                    </div>
                    <div className="clientDashboard-view-slab_list-slabs-item lg-row-item">
                      <div className="clientDashboard-view-slab_list-slabs-item-dropdown" onClick={() => dropdown == `priceList-${idx}` ? setDropdown('') : setDropdown(`priceList-${idx}`)}>
                        Price List <SVG svg={'dropdown-arrow'}></SVG>
                        {dropdown == `priceList-${idx}` && 
                        <div key={idx} className="clientDashboard-view-slab_list-slabs-item-dropdown-container">
                          {item.priceLists.length > 0 && item.priceLists.map((item, idx) => 
                          <div className="clientDashboard-view-slab_list-slabs-item-dropdown-item">
                            <span onClick={() => window.location.href = `/prices/${item._id}`}>{item.brand}</span>
                          </div>
                          )
                          }
                        </div>
                        }
                      </div> 
                    </div>
                    <div className="clientDashboard-view-slab_list-slabs-item lg-row-item">
                      <div className="clientDashboard-view-slab_list-slabs-item-dropdown" onClick={() => dropdown == `account-${idx}` ? setDropdown('') : setDropdown(`account-${idx}`)}>
                        Accounts <SVG svg={'dropdown-arrow'}></SVG>
                        {dropdown == `account-${idx}` && 
                        <div className="clientDashboard-view-slab_list-slabs-item-dropdown-container">
                          {item.accounts.length > 0 && item.accounts.map((item, idx) => 
                          <div key={idx}className="clientDashboard-view-slab_list-slabs-item-dropdown-item">
                            {item.name}
                          </div>
                          )
                          }
                        </div>
                        }
                      </div> 
                    </div>
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

const mapStateToProps = state => {
  return {
    JobList: state.JobList
  }
}

const mapDispatchToProps = dispatch => {
  return {
    hideSideNav: () => dispatch({type: 'HIDE_SIDENAV'}),
    showSideNav: () => dispatch({type: 'SHOW_SIDENAV'}),
    createJob: (name, data) => dispatch({type: 'CREATE_Job_LIST', name: name, value: data}),
    addJobImage: (data) => dispatch({type: 'Job_LIST_IMAGE', value: data}),
    resetJob: () => dispatch({type: 'RESET_Job_LIST'})
  }
}

Jobs.getInitialProps = async () => {
  let data
  let error
  try {
    const responseJobs = await axios.get(`${API}/transaction/get-jobs`)
    data = responseJobs.data
  } catch (error) {
    console.log(error)
  }

  return {
    list: data ? data : null
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(withUser(Jobs))
