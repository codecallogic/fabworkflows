import {BlobProvider, PDFViewer, PDFDownloadLink} from '@react-pdf/renderer'
import TopNav from '../../components/client/dashboardTopNav'
import SideNav from '../../components/client/dashboardSideNav'
import React, { useState, useEffect, useRef} from 'react'
import {connect} from 'react-redux'
import SVGs from '../../files/svgs'
import axios from 'axios'
import {API} from '../../config'
import QuotePDF from '../../components/pdf/quote'
import Agreement from '../../components/pdf/agreement'
import withUser from '../withUser'

const Quotes = ({hideSideNav, showSideNav, list}) => {
  // console.log(list)
  const myRefs = useRef([])
  const [width, setWidth] = useState()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [allQuotes, setAllQuotes] = useState(list ? list: [])
  const [filterProduct, setFilterProduct] = useState('')
  const [ascProduct, setAscProduct] = useState(-1)
  const [descProduct, setDescProduct] = useState(1)
  const [isLoaded, setIsLoaded] = useState(false)
  const [controls, setControls] = useState(false)
  const [idControls, setIDControls] = useState('')
  const [modal, setModal] = useState('account')
  const [account, setAccount] = useState('')
  const [job, setJob] = useState('')
  const [accountOnly, setAccountOnly] = useState('')
  const [html, setHtml] = useState('')

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
    setIsLoaded(true)
  }, [])

  useEffect(() => {
    document.addEventListener("click", handleClickOutside, true);

    return () => {
      document.removeEventListener("click", handleClickOutside, true);
    };
  }, [])
  
  const handleClickOutside = (event) => {
    if(myRefs.current){
      myRefs.current.forEach((item) => {
        if(item){
          if(item.contains(event.target)) return
          if(modal == 'account') return
          if(event.target == document.getElementById('delete-quote')) return
          if(event.target == document.getElementById('edit-quote')) return
          if(event.target == document.getElementById('create-account')) return
          item.childNodes[0].checked = false
          setControls(false)
          setIDControls('')
        }
      })
    }
  }
  
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

  const unsetControls = (e, id) => {
    const els = document.querySelectorAll('.clientDashboard-view-slab_list-slabs-checkbox-input')

    els.forEach( (el) => {
      el.checked = false
    })
  }

  const handleDelete = async (e) => {
    setLoading(true)
    setError('')
    try {
      const responseDelete = await axios.post(`${API}/transaction/delete-quote`, {id: idControls})
      // console.log(responseDelete.data)
      setLoading(false)
      setControls(false)
      setAllQuotes([...responseDelete.data])
    } catch (error) {
      setLoading(false)
      setControls(false)
      if(error) error.response ? setError(error.response.data) : setError('Error deleting quote from list')
    }
  }

  const createAccount = async (e) => {
    e.preventDefault()
    if(accountOnly) return setError('Creating an account only is not yet supported')
    setLoading(true)
    setError('')
    setHtml('')
    try {
      const responseAccount = await axios.post(`${API}/transaction/create-account`, {account: account, job: job, id: idControls})
      setLoading(false)
      setControls(false)
      setHtml(`View new job <a href="/jobs/${responseAccount.data._id}">${responseAccount.data.name}</a>`)
    } catch (error) {
      setLoading(false)
      setControls(false)
      setHtml('')
      if(error) error.response ? setError(error.response.data) : setError('Error creating an account list')
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
              <div className="clientDashboard-view-slab_list-heading-title">Quote List</div>
              {controls &&
              <div className="clientDashboard-view-slab_list-heading-controls">
                <div id="edit-quote" className="clientDashboard-view-slab_list-heading-controls-item edit" onClick={() => idControls ? window.location.href = `quotes/${idControls}` : null}>Edit</div>
                <div id="create-account" className="clientDashboard-view-slab_list-heading-controls-item edit" onClick={() => setModal('account')}><SVGs svg={'plus'}></SVGs> Account</div>
                <div id="delete-quote" className="clientDashboard-view-slab_list-heading-controls-item delete" onClick={() => handleDelete()}>Delete</div>
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
                <div className="clientDashboard-view-slab_list-headers-item">File</div>
                <div className="clientDashboard-view-slab_list-headers-item" onClick={(e) => filterProduct == 'quote_date' ? (setAscProduct(ascProduct == 1 ? -1 : 1 ), setDescProduct(descProduct == -1 ? 1 : -1)) : setFilterProduct('quote_date')}>Date <SVGs svg={'sort'}></SVGs></div>
                <div className="clientDashboard-view-slab_list-headers-item" onClick={(e) => filterProduct == 'quote_balance' ? (setAscProduct(ascProduct == 1 ? -1 : 1 ), setDescProduct(descProduct == -1 ? 1 : -1)) : setFilterProduct('quote_balance')}>Balance <SVGs svg={'sort'}></SVGs></div>
                <div className="clientDashboard-view-slab_list-headers-item" style={{width: '8rem'}} onClick={(e) => filterProduct == 'salesperson' ? (setAscProduct(ascProduct == 1 ? -1 : 1 ), setDescProduct(descProduct == -1 ? 1 : -1)) : setFilterProduct('salesperson')}>Salesperson <SVGs svg={'sort'}></SVGs></div>
                <div className="clientDashboard-view-slab_list-headers-item" onClick={(e) => filterProduct == 'payment' ? (setAscProduct(ascProduct == 1 ? -1 : 1 ), setDescProduct(descProduct == -1 ? 1 : -1)) : setFilterProduct('payment')}>Payment <SVGs svg={'sort'}></SVGs></div>
                <div className="clientDashboard-view-slab_list-headers-item" onClick={(e) => filterProduct == 'contact_name' ? (setAscProduct(ascProduct == 1 ? -1 : 1 ), setDescProduct(descProduct == -1 ? 1 : -1)) : setFilterProduct('contact_name')}>Customer <SVGs svg={'sort'}></SVGs></div>
                <div className="clientDashboard-view-slab_list-headers-item" onClick={(e) => filterProduct == 'city' ? (setAscProduct(ascProduct == 1 ? -1 : 1 ), setDescProduct(descProduct == -1 ? 1 : -1)) : setFilterProduct('city')}>City <SVGs svg={'sort'}></SVGs></div>
                <div className="clientDashboard-view-slab_list-headers-item" onClick={(e) => filterProduct == 'zip_code' ? (setAscProduct(ascProduct == 1 ? -1 : 1 ), setDescProduct(descProduct == -1 ? 1 : -1)) : setFilterProduct('zip_code')}>Zip Code <SVGs svg={'sort'}></SVGs></div>
                <div className="clientDashboard-view-slab_list-headers-item" onClick={(e) => filterProduct == 'quote_number' ? (setAscProduct(ascProduct == 1 ? -1 : 1 ), setDescProduct(descProduct == -1 ? 1 : -1)) : setFilterProduct('quote_number')}>Quote # <SVGs svg={'sort'}></SVGs></div>
                {/* <div className="clientDashboard-view-slab_list-headers-item" onClick={(e) => filterProduct == 'price' ? (setAscProduct(ascProduct == 1 ? -1 : 1 ), setDescProduct(descProduct == -1 ? 1 : -1)) : setFilterProduct('price')}>Price <SVGs svg={'sort'}></SVGs></div> */}
                <div className="clientDashboard-view-slab_list-headers-item"></div>
                <div className="clientDashboard-view-slab_list-headers-item"></div>
              </div>
            </div>
            <div className="clientDashboard-view-slab_list-slabs-container">
            {allQuotes.length > 0 && allQuotes.sort((a, b) => a[filterProduct] > b[filterProduct] ? ascProduct : descProduct).map((item, idx) => (
              <div key={idx} className="clientDashboard-view-slab_list-slabs">
                  <div className="clientDashboard-view-slab_list-slabs-checkbox" ref={(el) => (myRefs.current[idx] = el)}>
                    <input className="clientDashboard-view-slab_list-slabs-checkbox-input" type="checkbox" id={`quote ` + `${idx}`} onClick={(e) => e.target.checked == true ? (handleControls(e, item._id), window.scrollTo({top: 0})) : (setControls(false), setIDControls(''))} />
                    <label htmlFor={`quote ` + `${idx}`}><span>&nbsp;</span></label>
                  </div>
                  <div className="clientDashboard-view-slab_list-slabs-item-container" onClick={() => window.open(`/quotes/${item._id}`, '_blank')}>
                    <div className="clientDashboard-view-slab_list-slabs-item">
                      <div className="clientDashboard-view-slab_list-slabs-item-buttons">
                        <button onClick={(e) => e.stopPropagation()}>
                          {isLoaded && <BlobProvider document={<QuotePDF date={item.quote_date} lines={item.quote_lines} order={item.quote_number} contact_name={item.contact_name} address={item.address_one} city={item.city} state={item.state} zip_code={item.zip_code} phone={item.phone} subtotal={item.quote_subtotal} tax={item.quote_tax} total={item.quote_total} POnumber={item.po_number} salesperson={item.salesperson}/>}>
                          {({ blob, url, loading, error }) =>
                            <span onClick={() => renderQuote(url)}>View Quote</span>
                          }
                          </BlobProvider>}
                        </button>
                        <button onClick={(e) => e.stopPropagation()}>
                          {isLoaded && <BlobProvider document={<Agreement date={item.quote_date} quote_name={item.quote_name} account_name={item.contact_name}/>}>
                          {({ blob, url, loading, error }) => {
                            return <span onClick={() => renderAgreement(url)}>View Agreement</span>
                            } 
                          }
                          </BlobProvider>}
                        </button>
                      </div>
                    </div>
                    <div className="clientDashboard-view-slab_list-slabs-item">{item.quote_date}</div>
                    <div className="clientDashboard-view-slab_list-slabs-item">{validateIsPriceNumber(item.quote_balance)}</div>
                    <div style={{width: '8rem'}}className="clientDashboard-view-slab_list-slabs-item">{item.salesperson}</div>
                    <div className="clientDashboard-view-slab_list-slabs-item">{item.payment ? 'Paid' : 'Pending'}</div>
                    <div className="clientDashboard-view-slab_list-slabs-item">{item.contact_name}</div>
                    <div className="clientDashboard-view-slab_list-slabs-item">{item.city}</div>
                    <div className="clientDashboard-view-slab_list-slabs-item">{item.zip_code}</div>
                    <div className="clientDashboard-view-slab_list-slabs-item">{item.quote_number}</div>
                    <div className="clientDashboard-view-slab_list-slabs-item"></div>
                    <div className="clientDashboard-view-slab_list-slabs-item"></div>
                  </div>
              </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      { modal == 'account' &&
        <div className="addFieldItems-modal" data-value="parent" onClick={(e) => e.target.getAttribute('data-value') == 'parent' ? setIsDragging(false) : null}>
        <div className="addFieldItems-modal-box" onPointerDown={handlePointerDown} onPointerUp={handlePointerUp} onPointerMove={handlePointerMove} style={{transform: `translateX(${translate.x}px) translateY(${translate.y}px)`}}>
          <div className="addFieldItems-modal-box-header">
            <span className="addFieldItems-modal-form-title">Create Account</span>
            <div onClick={() => (unsetControls(), setHtml(''), setAccount(''), setJob(''), setModal(''), setError(''))}><SVGs svg={'close'}></SVGs></div>
          </div>
          <div className="addFieldItems-modal-form-options">
            <div className="form-group-checkbox" onClick={() => accountOnly ? setAccountOnly(false) : setAccountOnly(true)}>
              <div className={`form-group-checkbox-box` + (accountOnly ? ' checked' : '')}></div> Account Only
            </div>
            <div className="form-group-checkbox" onClick={() => accountOnly ? setAccountOnly(false) : setAccountOnly(false)}>
              <div className={`form-group-checkbox-box` + (!accountOnly ? ' checked' : '')}></div> Create Job
            </div>
          </div>
          <form className="addFieldItems-modal-form" onSubmit={(e) => createAccount(e)}>
            <div className="form-group-single-textarea">
              <div className="form-group-single-textarea-field">
                <label htmlFor="account">Account Name</label>
                <textarea id="account" rows="1" name="account" placeholder="(Account Name)" value={account} onChange={(e) => (setError(''), setHtml(''), setAccount(e.target.value))} onFocus={(e) => e.target.placeholder = ''} onBlur={(e) => e.target.placeholder = '(Account Name)'} wrap="off" onKeyDown={(e) => e.keyCode == 13 ? e.preventDefault() : null} autoFocus={true} required></textarea>
              </div>
            </div>
            {!accountOnly &&
            <div className="form-group-single-textarea">
              <div className="form-group-single-textarea-field">
                <label htmlFor="account">Job Name</label>
                <textarea id="job" rows="1" name="job" placeholder="(Job Name)" value={job} onChange={(e) => (setError(''), setHtml(''), setJob(e.target.value))} onFocus={(e) => e.target.placeholder = ''} onBlur={(e) => e.target.placeholder = '(Job Name)'} wrap="off" onKeyDown={(e) => e.keyCode == 13 ? e.preventDefault() : null} required></textarea>
              </div>
            </div>
            }
            <br></br>
            {error && <span className="form-error"><SVGs svg={'error'}></SVGs>{error}</span>}

            {html ? <div className="form-message-link" dangerouslySetInnerHTML={{ __html: html }}/> : null}
            
            <button type="submit" className="form-button w100">{!loading && <span>Save</span>} {loading && <div className="loading"><span></span><span></span><span></span></div>}</button>
            {/* {edit == 'brand' && <button onClick={(e) => updateBrand(e)} className="form-button w100">{!loading && <span>Update Brand</span>} {loading && <div className="loading"><span></span><span></span><span></span></div>}</button>} */}
          </form>
        </div>
      </div>
      }
    </>
  )
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
  }
}

Quotes.getInitialProps = async () => {
  let data
  let error
  try {
    const responseQuotes = await axios.get(`${API}/transaction/quote-list`)
    data = responseQuotes.data
  } catch (error) {
    console.log(error)
  }

  return {
    list: data ? data : null
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(withUser(Quotes))
