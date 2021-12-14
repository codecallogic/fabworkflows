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

  useEffect(() => {
    setIsLoaded(true)
  }, [])
  
  const handleClickOutside = (event) => {
    if(myRefs.current){
      myRefs.current.forEach((item) => {
        if(item){
          if(item.contains(event.target)) return
          if(event.target == document.getElementById('delete-quote')) return
          if(event.target == document.getElementById('edit-quote')) return
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
                <div id="edit-product" className="clientDashboard-view-slab_list-heading-controls-item edit" onClick={() => idControls ? window.location.href = `quotes/${idControls}` : null}>Edit</div>
                <div id="delete-product" className="clientDashboard-view-slab_list-heading-controls-item delete" onClick={() => handleDelete()}>Delete</div>
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
