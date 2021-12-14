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
import PriceListModal from '../../components/modals/PriceList'

const Quotes = ({hideSideNav, showSideNav, list, priceList, createPrice, addPriceImage, resetPrice}) => {
  // console.log(list)
  const myRefs = useRef([])
  const [width, setWidth] = useState()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [allPrices, setAllPrices] = useState(list ? list: [])
  const [filterPrice, setFilterPrice] = useState('')
  const [ascPrice, setAscPrice] = useState(-1)
  const [descPrice, setDescPrice] = useState(1)
  const [isLoaded, setIsLoaded] = useState(false)
  const [controls, setControls] = useState(false)
  const [idControls, setIDControls] = useState('')
  const [modal, setModal] = useState('')
  const [update, setUpdate] = useState('')
  
  useEffect(() => {
    setIsLoaded(true)
  }, [])
  
  const handleClickOutside = (event) => {
    if(myRefs.current){
      myRefs.current.forEach((item) => {
        if(item){
          if(item.contains(event.target)) return
          if(event.target == document.getElementById('delete-price')) return
          if(event.target == document.getElementById('edit-price')) return
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
      window.location.href = '/quotes'
    } catch (error) {
      setLoading(false)
      if(error) error.response ? setError(error.response.data) : setError('Error deleting quote from list')
    }
  }

  const setEditPriceList = (id) => {
    allPrices.forEach((item) => {
      if(item._id == idControls || id){
        for(let key in item){
          if(key !== 'price') createPrice(key, item[key])
          if(key == 'price') createPrice('price', validateIsPriceNumber(item['price']))
        }
      }
    })
  }
  
  return (
    <>
      <TopNav></TopNav>
      <div className="clientDashboard">
        <SideNav width={width}></SideNav>
        <div className="clientDashboard-view">
          <div className="clientDashboard-view-slab_list-container">
            <div className="clientDashboard-view-slab_list-heading">
              <div className="clientDashboard-view-slab_list-heading-title">Price List</div>
              {controls &&
              <div className="clientDashboard-view-slab_list-heading-controls">
                <div id="edit-price" className="clientDashboard-view-slab_list-heading-controls-item edit" onClick={() => idControls ? (setEditPriceList(), setModal('price_list'), setUpdate('price_list')) : null}>Edit</div>
                <div id="delete-price" className="clientDashboard-view-slab_list-heading-controls-item delete" onClick={() => handleDelete()}>Delete</div>
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
                <div className="clientDashboard-view-slab_list-headers-item" onClick={(e) => filterPrice == 'brand' ? (setAscPrice(ascPrice == 1 ? -1 : 1 ), setDescPrice(descPrice == -1 ? 1 : -1)) : setFilterPrice('brand')}>Brand <SVGs svg={'sort'}></SVGs></div>
                <div className="clientDashboard-view-slab_list-headers-item" onClick={(e) => filterPrice == 'model' ? (setAscPrice(ascPrice == 1 ? -1 : 1 ), setDescPrice(descPrice == -1 ? 1 : -1)) : setFilterPrice('model')}>Model <SVGs svg={'sort'}></SVGs></div>
                <div className="clientDashboard-view-slab_list-headers-item"  onClick={(e) => filterPrice == 'color' ? (setAscPrice(ascPrice == 1 ? -1 : 1 ), setDescPrice(descPrice == -1 ? 1 : -1)) : setFilterPrice('color')}>Color <SVGs svg={'sort'}></SVGs></div>
                <div className="clientDashboard-view-slab_list-headers-item" onClick={(e) => filterPrice == 'price' ? (setAscPrice(ascPrice == 1 ? -1 : 1 ), setDescPrice(descPrice == -1 ? 1 : -1)) : setFilterPrice('price')}>Price <SVGs svg={'sort'}></SVGs></div>
                {/* <div className="clientDashboard-view-slab_list-headers-item" onClick={(e) => filterPrice == 'price' ? (setAscPrice(ascPrice == 1 ? -1 : 1 ), setDescPrice(descPrice == -1 ? 1 : -1)) : setFilterPrice('price')}>Price <SVGs svg={'sort'}></SVGs></div> */}
                <div className="clientDashboard-view-slab_list-headers-item"></div>
                <div className="clientDashboard-view-slab_list-headers-item"></div>
              </div>
            </div>
            <div className="clientDashboard-view-slab_list-slabs-container">
            {allPrices.length > 0 && allPrices.sort((a, b) => a[filterPrice] > b[filterPrice] ? ascPrice : descPrice).map((item, idx) => (
              <div key={idx} className="clientDashboard-view-slab_list-slabs">
                  <div className="clientDashboard-view-slab_list-slabs-checkbox" ref={(el) => (myRefs.current[idx] = el)}>
                    <input className="clientDashboard-view-slab_list-slabs-checkbox-input" type="checkbox" id={`price ` + `${idx}`} onClick={(e) => e.target.checked == true ? (handleControls(e, item._id), window.scrollTo({top: 0})) : (setControls(false), setIDControls(''))} />
                    <label htmlFor={`price ` + `${idx}`}><span>&nbsp;</span></label>
                  </div>
                  <div className="clientDashboard-view-slab_list-slabs-item-container" onClick={() => window.open(`/quotes/${item._id}`, '_blank')}>
                    <div className="clientDashboard-view-slab_list-slabs-item">{item.images.length > 0 ? <img src={item.images[0].location} alt="" /> : null}</div>
                    <div className="clientDashboard-view-slab_list-slabs-item">{item.brand}</div>
                    <div className="clientDashboard-view-slab_list-slabs-item">{item.model}</div>
                    <div className="clientDashboard-view-slab_list-slabs-item">{item.color}</div>
                    <div className="clientDashboard-view-slab_list-slabs-item">{validateIsPriceNumber(item.price)}</div>
                  </div>
              </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      { modal == 'price_list' &&
        <PriceListModal setmodal={setModal} update={update}></PriceListModal>
      }
    </>
  )
}

const mapStateToProps = state => {
  return {
    priceList: state.priceList
  }
}

const mapDispatchToProps = dispatch => {
  return {
    hideSideNav: () => dispatch({type: 'HIDE_SIDENAV'}),
    showSideNav: () => dispatch({type: 'SHOW_SIDENAV'}),
    createPrice: (name, data) => dispatch({type: 'CREATE_PRICE_LIST', name: name, value: data}),
    addPriceImage: (data) => dispatch({type: 'PRICE_LIST_IMAGE', value: data}),
    resetPrice: () => dispatch({type: 'RESET_PRICE_LIST'})
  }
}

Quotes.getInitialProps = async () => {
  let data
  let error
  try {
    const responsePriceList = await axios.get(`${API}/transaction/get-price-list`)
    data = responsePriceList.data
  } catch (error) {
    console.log(error)
  }

  return {
    list: data ? data : null
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(withUser(Quotes))
