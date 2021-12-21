import TopNav from '../../components/client/dashboardTopNav'
import SideNav from '../../components/client/dashboardSideNav'
import React, { useState, useEffect, useRef} from 'react'
import {connect} from 'react-redux'
import SVGs from '../../files/svgs'
import axios from 'axios'
import {API} from '../../config'
import withUser from '../withUser'
import AddressModal from '../../components/modals/Address'
import QuoteModal from '../../components/modals/Quote'
import MoveJob from '../../components/modals/MoveJob'

const Jobs = ({hideSideNav, showSideNav, job, updateJob, createJob, createQuote, resetQuote, accounts}) => {
  // console.log(job)
  const myRefs = useRef([])
  const [width, setWidth] = useState()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [modal, setModal] = useState('')
  const [jobAddressID, setJobAddressID] = useState('')
  const [update, setUpdate] = useState('')
  const [filterJob, setFilterJob] = useState('')
  const [ascJob, setAscJob] = useState(-1)
  const [descJob, setDescJob] = useState(1)

  const [prevX, setPrevX] = useState(0)
  const [prevY, setPrevY] = useState(0)
  const onPointerDown = () => {}
  const onPointerUp = () => {}
  const onPointerMove = () => {}
  const [isDragging, setIsDragging] = useState(false)

  const [translate, setTranslate] = useState({
    x: 0,
    y: 0
  });

  const handlePointerDown = (e) => {
    setPrevX(0)
    setPrevY(0)
    setIsDragging(true)
    onPointerDown(e)
  }

  const handlePointerUp = (e) => {
    setIsDragging(false)
    onPointerUp(e)
  }

  const handlePointerMove = (e) => {
    if (isDragging) handleDragMove(e);

    onPointerMove(e);
  };

  const handleDragMove = (e) => {
    var movementX = (prevX ? e.screenX - prevX : 0)
    var movementY = (prevY ? e.screenY - prevY : 0)
    
    setPrevX(e.screenX)
    setPrevY(e.screenY)

    handleModalMove(movementX, movementY)
  };

  const handleModalMove = (X, Y) => {
    setTranslate({
      x: translate.x + X,
      y: translate.y + Y
    });
  }
  
  useEffect(() => {
    for(let key in job){
      if(job[key]) createJob(key, job[key])
      if(key == 'createdAt') createJob('createdAt', convertDate(job['createdAt']))
    }

    updateJob.jobAddress && updateJob.jobAddress.length > 0 && updateJob.jobAddress.map((item, idx) => {
      setJobAddressID(item._id)
    })

  }, [job])
  
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

  const validateIsPriceNumber = (amount) => {
    let newValue = amount
    let formatter = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }) 
    return formatter.format(newValue)
  }


  const handleDelete = async (e) => {
    setLoading(true)
    setError('')
    
    try {
      const responseDelete = await axios.post(`${API}/transaction/delete-price-list`, {id: idControls})
      setLoading(false)
      setControls(false)
      setAllPrices([...responseDelete.data])
      
    } catch (error) {
      setLoading(false)
      setControls(false)
      if(error) error.response ? setError(error.response.data) : setError('Error deleting quote from list')
    }
  }

  const convertDate = (item) => {
    var date = new Date(item)
    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

    var month = monthNames[date.getUTCMonth()]
    var day = date.getUTCDate()
    var year = date.getUTCFullYear()

    return `${month} ${day}, ${year}`
  }

  function checkValue(str, max){
    if (str.charAt(0) !== '0' || str == '00') {
      var num = parseInt(str);
      if (isNaN(num) || num <= 0 || num > max) num = 1;
      str = num > parseInt(max.toString().charAt(0)) && num.toString().length == 1 ? '0' + num : num.toString();
    };
    return str;
  }

  const handleDate = (e, type) => {
    let name = document.getElementById(e.target.name)
    name.classList.remove("red")
    let input = e.target.value
    if (/\D\/$/.test(input)) input = input.substr(0, input.length - 3);
    var values = input.split('/').map(function(v) {
      return v.replace(/\D/g, '')
    });
    if (values[0]) values[0] = checkValue(values[0], 12);
    if (values[1]) values[1] = checkValue(values[1], 31);
    var output = values.map(function(v, i) {
      return v.length == 2 && i < 2 ? v + '/' : v;
    });
    input = output.join('').substr(0, 10);

    createJob(type, input)

    let date_regex = /^(0[1-9]|1[0-2])\/(0[1-9]|1\d|2\d|3[01])\/(19|20)\d{2}$/

    if(!date_regex.test(input)){
      name.classList.add('red');
      if(input == '') name.classList.remove("red")
      return
    }
  }

  const updateJobInfo = async () => {
    setLoading('job_info')
    
    try {
      const responseJob = await axios.post(`${API}/transaction/update-job-info`, updateJob)
      setLoading('')
      setModal('')
      setError('')

      for(let key in responseJob.data){
        createJob(key, responseJob.data[key])
      }

    } catch (error) {
      setLoading('')
      setModal('error')
      if(error) error.response ? setError(error.response.data) : setError('Error occurred could not save quote')
    }
  }

  const setUpContactModal = (type) => {
    if(type == 'jobAddress'){
      if(updateJob.jobAddress.length > 0){
        for(let key in updateJob.jobAddress[0]){
          createQuote(key, updateJob.jobAddress[0][key])
          if(key == '_id') createQuote('address_id', updateJob.jobAddress[0]['_id'])
        }
      }
    }
    if(type == 'accountAddress'){
      if(updateJob.accountAddress.length > 0){
        for(let key in updateJob.accountAddress[0]){
          createQuote(key, updateJob.accountAddress[0][key])
          if(key == '_id') createQuote('address_id', updateJob.accountAddress[0]['_id'])
        }
      }
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
              <div className="clientDashboard-view-slab_list-heading-title">
                Job
              </div>
            </div>
            <div className="clientDashboard-view-slab_form">
              <div className="clientDashboard-view-form-left">
              <div className="clientDashboard-view-slab_form-left-box">
                <div className="clientDashboard-view-form-left-box-heading">
                  <span className="clientDashboard-view-form-left-box-heading-left">  Job Info
                    <span className="clientDashboard-view-form-left-box-heading-left-svg" onClick={() => setModal('moveJob')}>
                      <SVGs svg={'move-file'}></SVGs>
                    </span>
                  </span>
                  <span className="clientDashboard-view-form-left-box-heading-svg" onClick={() => (setModal('job_info'))}>
                    <SVGs svg={'edit'}></SVGs>
                  </span>
                </div>
                <div className="clientDashboard-view-form-left-box-container-2">
                  <div className="clientDashboard-view-form-left-box-container-2-item">
                    <div className="clientDashboard-view-form-left-box-container-2-item-heading">Name: </div>
                    <div className="clientDashboard-view-form-left-box-container-2-item-content">
                      {updateJob.name}
                    </div>
                  </div>
                  <div className="clientDashboard-view-form-left-box-container-2-item">
                    <div className="clientDashboard-view-form-left-box-container-2-item-heading">Account: </div>
                    <div className="clientDashboard-view-form-left-box-container-2-item-content">
                      { updateJob.accounts && updateJob.accounts.length > 0 && updateJob.accounts.map((item, idx) => 
                        <a key={idx} href={`/accounts/${item._id}`}>{item.name}</a>
                      )
                      }
                    </div>
                  </div>
                  <div className="clientDashboard-view-form-left-box-container-2-item">
                    <div className="clientDashboard-view-form-left-box-container-2-item-heading">Creation Date: </div>
                    <div className="clientDashboard-view-form-left-box-container-2-item-content">
                      {convertDate(updateJob.createdAt)}
                    </div>
                  </div>
                  <div className="clientDashboard-view-form-left-box-container-2-item">
                    <div className="clientDashboard-view-form-left-box-container-2-item-heading">Salesperson: </div>
                    <div className="clientDashboard-view-form-left-box-container-2-item-content">
                      {updateJob.salesperson}
                    </div>
                  </div>
                  <div className="clientDashboard-view-form-left-box-container-2-item">
                    <div className="clientDashboard-view-form-left-box-container-2-item-heading">Invoice: </div>
                    <div className="clientDashboard-view-form-left-box-container-2-item-content">
                      {updateJob.invoice}
                    </div>
                  </div>
                  <div className="clientDashboard-view-form-left-box-container-2-item">
                    <div className="clientDashboard-view-form-left-box-container-2-item-heading">Notes: </div>
                    <div className="clientDashboard-view-form-left-box-container-2-item-content">
                      {updateJob.notes}
                    </div>
                  </div>
                </div>
              </div>
              </div>
              <div className="clientDashboard-view-form-right">
                <div className="clientDashboard-view-slab_form-left-box">
                  <div className="clientDashboard-view-form-left-box-heading">
                    <span>Job Address</span>
                    <span className="clientDashboard-view-form-left-box-heading-svg" onClick={() => (setUpContactModal('jobAddress'), setModal('contact'), setUpdate('double_job'))}>
                    <SVGs svg={'edit'}></SVGs>
                  </span>
                  </div>
                  <div className="clientDashboard-view-form-left-box-container-2 min-height mb4">
                    <div className="clientDashboard-view-form-left-box-container-2-item">
                      <div className="clientDashboard-view-form-left-box-container-2-item-heading">Address: </div>
                      <div className="clientDashboard-view-form-left-box-container-2-item-content">
                      { updateJob.jobAddress && updateJob.jobAddress.length > 0 && updateJob.jobAddress.map((item, idx) => 
                        <span key={idx}>{item.address_one ? item.address_one : ''}, {item.city ? item.city : ''}, {item.state ? item.state : ''}, {item.zip_code ? item.zip_code : ''}</span>
                      )
                      }
                      </div>
                    </div>
                  </div>
                </div>
                <div className="clientDashboard-view-slab_form-left-box">
                  <div className="clientDashboard-view-form-left-box-heading">
                    <span>Account Address</span>
                    <span className="clientDashboard-view-form-left-box-heading-svg" onClick={() => (setUpContactModal('accountAddress'), setModal('contact'), setUpdate('double_account'))}>
                    <SVGs svg={'edit'}></SVGs>
                  </span>
                  </div>
                  <div className="clientDashboard-view-form-left-box-container-2 min-height">
                    <div className="clientDashboard-view-form-left-box-container-2-item">
                      <div className="clientDashboard-view-form-left-box-container-2-item-heading">Address: </div>
                      <div className="clientDashboard-view-form-left-box-container-2-item-content">
                      { updateJob.accountAddress && updateJob.accountAddress.length > 0 && updateJob.accountAddress.map((item, idx) => 
                        item._id == jobAddressID 
                        ? 
                          <span>Same as job address</span>
                        : 
                        <span>{item.address_one ? item.address_one : ''}, {item.city ? item.city : ''}, {item.state ? item.state : ''}, {item.zip_code ? item.zip_code : ''}</span>
                      )
                      }
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="clientDashboard-view-form-wide">
                <div className="clientDashboard-view-form-wide-title">
                  Quotes <span onClick={() => setModal('quote')}><SVGs svg={'plus'}></SVGs></span>
                </div>
                <div className="clientDashboard-view-form-wide-headers">
                  <div className="clientDashboard-view-form-wide-headers-checkbox"></div>
                  <div className="clientDashboard-view-form-wide-headers-item-container">
                    <div className="clientDashboard-view-form-wide-headers-item">Address</div>
                    <div className="clientDashboard-view-form-wide-headers-item">City</div>
                    <div className="clientDashboard-view-form-wide-headers-item">State</div>
                    <div className="clientDashboard-view-form-wide-headers-item">Zip Code</div>
                    <div className="clientDashboard-view-form-wide-headers-item">Contact</div>
                    <div className="clientDashboard-view-form-wide-headers-item">Salesperson</div>
                    <div className="clientDashboard-view-form-wide-headers-item">Lead</div>
                    <div className="clientDashboard-view-form-wide-headers-item">Quote #/Invoice</div>
                    <div className="clientDashboard-view-form-wide-headers-item">Balance</div>
                    <div className="clientDashboard-view-form-wide-headers-item wide-row-item">Created At</div>
                  </div>
                </div>
                <div className="clientDashboard-view-slab_list-slabs-container-job">
                {updateJob.quotes && updateJob.quotes.length > 0 && updateJob.quotes.sort((a, b) => a[filterJob] > b[filterJob] ? ascJob : descJob).map((item, idx) => (
                  <div key={idx} className="clientDashboard-view-slab_list-slabs">
                      <div
                      className="clientDashboard-view-slab_list-slabs-item-container" onClick={() => window.open(`/quotes/${item._id}`, '_blank')}>
                        <div className="clientDashboard-view-form-wide-headers-checkbox"></div>
                        <div className="clientDashboard-view-slab_list-slabs-item wide-row-item">{item.address_one}
                        </div>
                        <div className="clientDashboard-view-slab_list-slabs-item">{item.city}
                        </div>
                        <div className="clientDashboard-view-slab_list-slabs-item">{item.state}
                        </div>
                        <div className="clientDashboard-view-slab_list-slabs-item">{item.zip_code}
                        </div>
                        <div className="clientDashboard-view-slab_list-slabs-item">{item.contact_name}
                        </div>
                        <div className="clientDashboard-view-slab_list-slabs-item ">{item.salesperson}
                        </div>
                        <div className="clientDashboard-view-slab_list-slabs-item ">{item.lead}
                        </div>
                        <div className="clientDashboard-view-slab_list-slabs-item ">{item.quote_number}
                        </div>
                        <div className="clientDashboard-view-slab_list-slabs-item ">${item.quote_balance}
                        </div>
                        <div className="clientDashboard-view-slab_list-slabs-item lg-row-item">{convertDate(item.createdAt)}
                        </div>
                      </div>
                  </div>
                ))}
                </div>  
              </div>
            </div>
            {/* <div className="clientDashboard-view-slab_table"> */}
                  
            {/* </div> */}
          </div>
        </div>
      </div>

      {/* ///////////////////// MODALS //////////////////////////////// */}

      { modal == 'job_info' &&
        <div className="addFieldItems-modal" data-value="parent" onClick={(e) => e.target.getAttribute('data-value') == 'parent' ? setIsDragging(false) : null}>
        <div className="addFieldItems-modal-box" onPointerDown={handlePointerDown} onPointerUp={handlePointerUp} onPointerMove={handlePointerMove} style={{transform: `translateX(${translate.x}px) translateY(${translate.y}px)`}}>
          <div className="addFieldItems-modal-box-header">
            <span className="addFieldItems-modal-form-title">
              Job Info
            </span>
            <div onClick={() => (setModal(''), setError(''))}><SVGs svg={'close'}></SVGs></div>
          </div>
          <div className="addFieldItems-modal-form-container">
          <form className="addFieldItems-modal-form">
            <div className="form-group-single-textarea">
              <div className="form-group-single-textarea-field">
                <label htmlFor="job_name">Job Name</label>
                <textarea id="job_name" rows="1" name="job_name" placeholder="(Job Name)" value={updateJob.name} onChange={(e) => createJob('name', e.target.value)} onFocus={(e) => e.target.placeholder = ''} onBlur={(e) => e.target.placeholder = '(Job Name)'} wrap="off" onKeyDown={(e) => e.keyCode == 13 ? e.preventDefault() : null} autoFocus={true} required></textarea>
              </div>
            </div>
            <div className="form-group-single-textarea">
              <div className="form-group-single-textarea-field">
                <label htmlFor="createdAt">Creation Date</label>
                <textarea id="createdAt" rows="1" name="createdAt" placeholder="(Creation Date)" value={updateJob.createdAt} onChange={(e) => handleDate(e, 'createdAt')} onFocus={(e) => e.target.placeholder = ''} onBlur={(e) => e.target.placeholder = '(Creation Date)'} wrap="off" onKeyDown={(e) => e.keyCode == 13 ? e.preventDefault() : null}></textarea>
              </div>
            </div>
            <div className="form-group-single-textarea">
              <div className="form-group-single-textarea-field">
                <label htmlFor="salesperson">Salesperson</label>
                <textarea id="salesperson" rows="1" name="salesperson" placeholder="(Salesperson)" value={updateJob.salesperson} onChange={(e) => createJob('salesperson', e.target.value)} onFocus={(e) => e.target.placeholder = ''} onBlur={(e) => e.target.placeholder = '(Salesperson)'} wrap="off" onKeyDown={(e) => e.keyCode == 13 ? e.preventDefault() : null}></textarea>
              </div>
            </div>
            <div className="form-group-single-textarea">
              <div className="form-group-single-textarea-field">
                <label htmlFor="job_notes">Notes</label>
                <textarea id="job_notes" rows="4" name="job_notes" placeholder="(Notes)" value={updateJob.notes} onChange={(e) => (createJob('notes', e.target.value))} onFocus={(e) => e.target.placeholder = ''} onBlur={(e) => e.target.placeholder = '(Notes)'} ></textarea>
              </div>
            </div>
          </form>
          </div>
          {error && <span className="form-error"><SVGs svg={'error'}></SVGs>{error}</span>}
          <button 
          onClick={(e) => (e.preventDefault(),updateJobInfo())} className="form-button w100">
            {!loading && <span>Save</span>} {loading == 'job_info' && <div className="loading"><span></span><span></span><span></span></div>}
          </button>
        </div>
      </div>
      }
      { modal == 'contact' && 
        <AddressModal setmodal={setModal} update={update} id={''} convertDate={convertDate}></AddressModal>
      }
      { modal == 'quote' && 
        <QuoteModal setmodal={setModal} update={''} id={''} convertDate={convertDate}></QuoteModal>
      }
      { modal == 'moveJob' && 
        <MoveJob setmodal={setModal} update={''} id={''} convertDate={convertDate} accounts={accounts}></MoveJob>
      }
    </>
  )
}

const mapStateToProps = state => {
  return {
    updateJob: state.job
  }
}

const mapDispatchToProps = dispatch => {
  return {
    hideSideNav: () => dispatch({type: 'HIDE_SIDENAV'}),
    showSideNav: () => dispatch({type: 'SHOW_SIDENAV'}),
    createJob: (name, data) => dispatch({type: 'CREATE_JOB', name: name, value: data}),
    createQuote: (name, data) => dispatch({type: 'CREATE_QUOTE', name: name, value: data}),
    resetQuote: () => dispatch({type: 'RESET_QUOTE'})
  }
}

Jobs.getInitialProps = async ({query}) => {
  let job
  try {
    const responseJob = await axios.post(`${API}/transaction/get-job`, {id: query.id})
    job = responseJob.data
  } catch (error) {
    if(error) console.log(error)
  }

  let accounts = []
  try {
    const responseAccounts = await axios.get(`${API}/transaction/get-accounts`)
    console.log(responseAccounts)
    accounts = [...responseAccounts.data]
  } catch (error) {
    if(error) console.log(error)
  }

  return {
    job: job ? job : null,
    accounts: accounts ? accounts : null
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(withUser(Jobs))
