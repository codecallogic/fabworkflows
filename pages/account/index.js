import TopNav from '../../components/client/dashboardTopNav'
import SideNav from '../../components/client/dashboardSideNav'
import {connect} from 'react-redux'
import SVGs from '../../files/svgs'
import React, { useState, useEffect, useRef } from 'react'
import QRCode from 'qrcode'
import {nanoid} from 'nanoid'
import withUser from '../withUser'
import {API} from '../../config'
import axios from 'axios'
import {useRouter} from 'next/router'
import SlabFields from '../../components/account/slabFields'
import ProductFields from '../../components/account/productFields'
import QuoteFields from '../../components/account/quoteFields'
import Remnant from '../../components/account/Remnant'
import Quote from '../../components/account/Quote'
import PriceListModal from '../../components/modals/PriceList'
import AddressModal from '../../components/modals/Address'
import CategoryModal from '../../components/modals/Category'

//// TABLE
import { filterTable, tableData } from '../../helpers/tableData'
import Table from '../../components/table'
import { slabsSort } from '../../helpers/sorts'

//// DATA
import { getToken } from '../../helpers/auth'
import _ from 'lodash'

//// FORMS
import SlabForm from '../../components/forms/slabForm'
import { submitCreate } from '../../helpers/forms'

//// VALIDATIONS
import { 
  validateNumber, validateEmail, validatePrice, validateDate, generateQR, multipleImages, dateNow, phoneNumber, addressSelect
} from '../../helpers/validations'

//// MODALS
import MaterialModal from '../../components/modals/Material'
import ColorModal from '../../components/modals/Color'
import SupplierModal from '../../components/modals/Supplier'
import LocationModal from '../../components/modals/Location'

axios.defaults.withCredentials = true

const formatter = new Intl.NumberFormat('en-US', {
  minimumFractionDigits: 2,      
  maximumFractionDigits: 2,
});

const Dashboard = ({
  nav,
  account,
  token,
  data,
  originalData,
  params, 

  //// REDUX
  hideSideNav, 
  showSideNav, 
  changeView, 
  slab,
  material,
  color,
  supplier,
  location,
  createType,
  resetType,
  addImages, 





  product, 
  createProduct, 
  addProductImages, 
  materials, 
  colors, 
  suppliers, 
  locations, 
  brands, 
  models, 
  categories, 
  addMaterial, 
  resetMaterial, 
  addSupplier, 
  resetSupplier, 
  priceList, 
  addressList, 
  misc_categories, 
  products, 
  resetQuote
}) => {
  const myRefs = useRef(null)
  
  // console.log(originalData)
  
  const router = useRouter()
  const [input_dropdown, setInputDropdown] = useState('')
  const [width, setWidth] = useState()
  const [selectedFiles, setSelectedFiles] = useState([])
  const [imageCount, setImageCount] = useState(0)
  const [error, setError] = useState('')
  const [allMaterials, setAllMaterials] = useState(materials)
  const [allColors, setAllColors] = useState(colors)
  const [allSuppliers, setAllSuppliers] = useState(suppliers)
  const [allLocations, setAllLocations] = useState(locations)
  const [allBrands, setAllBrands] = useState(brands)
  const [brand, setBrand] = useState('')
  const [allProductCategories, setAllProductCategories] = useState(categories)
  const [allCategories, setAllCategories] = useState(misc_categories)
  const [category, setCategory] = useState('')
  const [allModels, setAllModels] = useState(models)

  ///// STATE MANAGEMENT
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState('')
  const [search, setSearch] = useState('')
  const [selectID, setSelectID] = useState('')
  const [controls, setControls] = useState(false)
  const [modal, setModal] = useState('')
  const [dynamicSVG, setDynamicSVG] = useState('notification')
  const [edit, setEdit] = useState('')
  const [allData, setAllData] = useState(originalData ? originalData : [])

  const handleClickOutside = (event) => {
    if(myRefs.current){
      if(!myRefs.current.contains(event.target)){
        setInputDropdown('')
      }
    }
  }

  useEffect(() => {setMessage('')}, [nav.view])

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

  }, [width, selectedFiles])

  useEffect(() => {
    if(params) params.change ? changeView(params.change) : null
  }, [router.query.change])

  useEffect(() => {
    setSelectedFiles([]), 
    setImageCount(0), 
    addProductImages([])
  }, [nav.view])

  const resetCheckboxes = () => {
    const els = document.querySelectorAll('.table-rows-checkbox-input')
    els.forEach( (el) => { el.checked = false })
  }

  const validateIsPrice = (evt) => {
    let newValue = Number(evt.target.value.replace(/\D/g, '')) / 100
    let formatter = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    })
    
    return formatter.format(newValue)
  }

  const generateQRProduct = async (e) => {
    let options = {
      type: 'image/png',
      width: 288,
      quality: 1,
      margin: 1,
    }
    
    e.preventDefault()
    e.stopPropagation()

    if(product.brand && product.model && product.category && product.description){
      try {

        let qrData = new Object()

        qrData.brand = product.brand
        qrData.model = product.model
        qrData.category = product.category
        qrData.description = product.description
        
        const image = await QRCode.toDataURL('https://www.slabware.com/', options)
        createProduct('qr_code', image)
        setError('')
      } catch (err) {
        console.log(err)
        if(err) setError('Error generating QR code')
      }
    }else {
      if(!product.brand){setError('Product brand is empty, please fill out.'); window.scrollTo(0,document.body.scrollHeight); return}
      if(!product.model){setError('Product model is empty, please fill out.'); window.scrollTo(0,document.body.scrollHeight); return}
      if(!product.category){setError('Product category is empty, please fill out.'); window.scrollTo(0,document.body.scrollHeight); return}
      if(!product.description){setError('Product description is empty, please fill out.'); window.scrollTo(0,document.body.scrollHeight); return}
    }
  }

  

  const submitCreateSlab = async (e) => {
    e.preventDefault()
    setError('')
    if(!slab.qr_code){setError('QR Code required'); window.scrollTo(0,document.body.scrollHeight); return}
    if(!slab.material){setError('Material required'); window.scrollTo(0,document.body.scrollHeight); return}
    if(!slab.color){setError('Color required'); window.scrollTo(0,document.body.scrollHeight); return}
    if(!slab.grade){setError('Grade required'); window.scrollTo(0,document.body.scrollHeight); return}
    if(!slab.finish){setError('Finish required'); window.scrollTo(0,document.body.scrollHeight); return}
    if(!slab.supplier){setError('Supplier required'); window.scrollTo(0,document.body.scrollHeight); return}
    if(!slab.location){setError('Location required'); window.scrollTo(0,document.body.scrollHeight); return}
    setLoading(true)
    
    let data = new FormData()
    
    if(slab.images.length > 0){
      slab.images.forEach((item) => {
        let fileID = nanoid()
        data.append('file', item, `slab-${fileID}.${item.name.split('.')[1]}`)
      })
    }

    if(slab){
      for(const key in slab){
        if(key !== 'images') data.append(key, slab[key])
      }
    }

    try {
      const responseSlab = await axios.post(`${API}/inventory/create-slab`, data, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      setLoading(false)
      console.log(responseSlab)
      let id = responseSlab.data
      window.location.href = `/slabs`
    } catch (error) {
      console.log(error)
      setLoading(false)
      if(error) error.response ? setError(error.response.data) : setError('Error adding slab to inventory')
    }
  }

  const handleAddProduct = async (e) => {
    e.preventDefault()
    setError('')
    if(!product.qr_code){setError('QR Code required'); window.scrollTo(0,document.body.scrollHeight); return}
    if(!product.brand){setError('Brand required'); window.scrollTo(0,document.body.scrollHeight); return}
    if(!product.model){setError('Model required'); window.scrollTo(0,document.body.scrollHeight); return}
    if(!product.category){setError('Category required'); window.scrollTo(0,document.body.scrollHeight); return}
    if(!product.location){setError('Location required'); window.scrollTo(0,document.body.scrollHeight); return}
    if(!product.description){setError('Description required'); window.scrollTo(0,document.body.scrollHeight); return}
    if(!product.quantity){setError('Quantity required'); window.scrollTo(0,document.body.scrollHeight); return}
    if(!product.price){setError('Price required'); window.scrollTo(0,document.body.scrollHeight); return}
    setLoading(true)
    
    let data = new FormData()
    
    if(product.images.length > 0){
      product.images.forEach((item) => {
        let fileID = nanoid()
        data.append('file', item, `product-${fileID}.${item.name.split('.')[1]}`)
      })
    }

    if(product){
      for(const key in product){
        if(key !== 'images') data.append(key, product[key])
      }
    }

    try {
      const responseProduct = await axios.post(`${API}/inventory/create-product`, data, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      setLoading(false)
      console.log(responseProduct)
      window.location.href = `/products`
    } catch (error) {
      console.log(error)
      setLoading(false)
      if(error) error.response ? setError(error.response.data) : setError('Error adding product to inventory')
    }
  }

  const submitAddMaterial = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const responseMaterial = await axios.post(`${API}/inventory/add-material`, material)
      resetMaterial()
      setInputDropdown('')
      setModal('')
      setLoading(false)
      setError('')
      setAllMaterials(responseMaterial.data)
    } catch (error) {
      console.log(error.response)
      setLoading(false)
      if(error) error.response ? setError(error.response.data) : setError('Error adding material to inventory')
    }
  }

  const submitAddColor = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const responseColor = await axios.post(`${API}/inventory/add-color`, {name: color})
      setColor('')
      setInputDropdown('')
      setModal('')
      setLoading(false)
      setError('')
      setAllColors(responseColor.data)
    } catch (error) {
      console.log(error.response)
      setLoading(false)
      if(error) error.response ? setError(error.response.data) : setError('Error adding color to inventory')
    }
  }

  const submitAddSupplier = async (e) => {
    e.preventDefault()
    const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    if(supplier.contact_email){
      if(!re.test(supplier.contact_email)) return setError('email address is not valid')
    }

    setLoading(true)
    try {
      const responseColor = await axios.post(`${API}/inventory/add-supplier`, supplier)
      setColor('')
      setInputDropdown('')
      setModal('')
      setLoading(false)
      setError('')
      setAllSuppliers(responseColor.data)
    } catch (error) {
      console.log(error.response)
      setLoading(false)
      if(error) error.response ? setError(error.response.data) : setError('Error adding supplier to inventory')
    }
  }

  const submitAddLocation = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const responseColor = await axios.post(`${API}/inventory/add-location`, {name: location})
      setLocation('')
      setInputDropdown('')
      setModal('')
      setLoading(false)
      setError('')
      setAllLocations(responseColor.data)
    } catch (error) {
      console.log(error.response)
      setLoading(false)
      if(error) error.response ? setError(error.response.data) : setError('Error adding location to inventory')
    } 
  }

  const submitAddBrand = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const responseBrand = await axios.post(`${API}/inventory/add-brand`, {name: brand})
      setBrand('')
      setModal('')
      setLoading(false)
      setError('')
      setAllBrands(responseBrand.data)
    } catch (error) {
      console.log(error.response)
      setLoading(false)
      if(error) error.response ? setError(error.response.data) : setError('Error adding brand to inventory')
    }
  }

  const submitAddModel = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const responseModel = await axios.post(`${API}/inventory/add-model`, {name: model})
      setModel('')
      setModal('')
      setLoading(false)
      setError('')
      setAllModels(responseModel.data)
    } catch (error) {
      console.log(error.response)
      setLoading(false)
      if(error) error.response ? setError(error.response.data) : setError('Error adding model to inventory')
    }
  }

  const submitAddCategory = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const responseCategory = await axios.post(`${API}/inventory/add-category`, {name: category})
      setCategory('')
      setModal('')
      setLoading(false)
      setError('')
      setAllCategories(responseCategory.data)
    } catch (error) {
      console.log(error.response)
      setLoading(false)
      if(error) error.response ? setError(error.response.data) : setError('Error adding category to inventory')
    }
  }
  
  return (
    <>
      <TopNav></TopNav>
      <div className="clientDashboard">
        <SideNav width={width}></SideNav>

        {/* //// TABLES //// */}
        
        {nav.view == 'slabs' &&
          <Table
            title={'Slabs List'}
            typeOfData={'slabs'}
            componentData={data.slabs}
            originalData={allData}
            modal={modal}
            setModal={modal}
            sortOrder={slabsSort}
            selectID={selectID}
            setSelectID={setSelectID}
            controls={controls}
            setControls={setControls}
            searchEnable={true}
            search={search}
            setSearch={setSearch}
            message={message}
            setMessage={setMessage}
            resetCheckboxes={resetCheckboxes}
          >
          </Table>
        }


        {/* ///// FORMS //// */}
        {nav.view == 'newSlab' &&
          <SlabForm
            token={token}
            title={'New Slab'}
            allData={allData}
            setAllData={setAllData}
            dynamicSVG={dynamicSVG}
            setDynamicSVG={setDynamicSVG}
            submitCreate={submitCreate}
            modal={modal}
            setModal={setModal}
            stateData={slab}
            stateMethod={createType}
            originalData={originalData}
            message={message}
            setMessage={setMessage}
            loading={loading}
            setLoading={setLoading}
            validateNumber={validateNumber}
            validatePrice={validatePrice}
            validateDate={validateDate}
            generateQR={generateQR}
            resetState={resetType}
            addImages={addImages}
            multipleImages={multipleImages}
            dateNow={dateNow}
          >
          </SlabForm>
        }

        
        <div className="clientDashboard-view">
          {nav.view == 'main' &&
          <div className="clientDashboard-view-main">
            <div className="clientDashboard-view-main-box"></div>
            <div className="clientDashboard-view-main-box"></div>
            <div className="clientDashboard-view-main-box"></div>
            <div className="clientDashboard-view-main-box"></div>
          </div>
          }
          { nav.view == 'new' &&
            <div className="clientDashboard-view-new">
              <div className="clientDashboard-view-new-item" onClick={() => changeView('newSlab')}>
                <SVGs svg={'slab'}></SVGs>
                <span>New Slab</span>
              </div>
              <div className="clientDashboard-view-new-item" onClick={() => (window.location.href = 'account?change=product')}>
                <SVGs svg={'box'}></SVGs>
                <span>New Product</span>
              </div>
              <div className="clientDashboard-view-new-item" onClick={() => (window.location.href = 'account?change=remnant')}>
                <SVGs svg={'remnant'}></SVGs>
                <span>New Remnant</span>
              </div>
              <div className="clientDashboard-view-new-item" onClick={() => (window.location.href = 'account?change=slab-fields')}>
                <SVGs svg={'slab'}></SVGs>
                <span>Slab Fields</span>
              </div>
              <div className="clientDashboard-view-new-item" onClick={() => (window.location.href = 'account?change=product-fields')}>
                <SVGs svg={'box'}></SVGs>
                <span>Product Fields</span>
              </div>
            </div>
          }
          { nav.view == 'transaction-new' &&
            <div className="clientDashboard-view-new">
              <div className="clientDashboard-view-new-item" onClick={() => (window.location.href = 'account?change=quote')}>
                <SVGs svg={'document'}></SVGs>
                <span>New Quote</span>
              </div>
              <div className="clientDashboard-view-new-item" onClick={() => (setModal('new_price_list'))}>
                <SVGs svg={'price-list'}></SVGs>
                <span>New Price List</span>
              </div>
              <div className="clientDashboard-view-new-item" onClick={() => (setModal('location'))}>
                <SVGs svg={'location'}></SVGs>
                <span>Address</span>
              </div>
              <div className="clientDashboard-view-new-item" onClick={() => (setModal('category'))}>
                <SVGs svg={'clipboard'}></SVGs>
                <span>Phase/Category</span>
              </div>
              <div className="clientDashboard-view-new-item" onClick={() => (window.location.href = 'account?change=quote-fields')}>
                <SVGs svg={'clipboard'}></SVGs>
                <span>Trasaction Fields</span>
              </div>
            </div>
          }






















          {
            nav.view == 'product' && 
            <div className="clientDashboard-view-slab_form-container">
              <div className="clientDashboard-view-slab_form-heading">
                <span>New Product</span>
                <div className="form-error-container">
                  {error && <span className="form-error"><SVGs svg={'error'}></SVGs></span>}
                </div>
              </div>
              <form className="clientDashboard-view-slab_form" onSubmit={handleAddProduct}>
                <div className="form-group-double-dropdown">
                  <label htmlFor="brand">Brand</label>
                  <div className="form-group-double-dropdown-input">
                    <textarea rows="1" wrap="off" onKeyDown={(e) => e.keyCode == 13 ? e.preventDefault() : null} name="brand" placeholder="(Select Brand)" onClick={() => setInputDropdown('product_brand')} value={product.brand} onChange={(e) => (setInputDropdown(''), createProduct('brand', e.target.value))}></textarea>
                    <div onClick={() => (input_dropdown !== 'product_brand' ? setInputDropdown('product_brand') : setInputDropdown(''))}><SVGs svg={'dropdown-arrow'}></SVGs></div>
                    { input_dropdown == 'product_brand' &&
                    <div className="form-group-double-dropdown-input-list" ref={myRefs}>
                      <div className="form-group-double-dropdown-input-list-item border_bottom" onClick={() => (setInputDropdown(''), setModal('add_brand'))}><SVGs svg={'plus'}></SVGs> Add new</div>
                      {allBrands && allBrands.sort( (a, b) => a.name > b.name ? 1 : -1).map( (item, idx) => (
                      <div key={idx} className="form-group-double-dropdown-input-list-item" onClick={(e) => (createProduct('brand', e.target.innerText), setInputDropdown(''))}>{item.name}</div>
                      ))}
                    </div>
                    }
                  </div>
                </div>
                <div className="form-group-double-dropdown">
                  <label htmlFor="model">Model</label>
                  <div className="form-group-double-dropdown-input">
                    <textarea rows="1" wrap="off" onKeyDown={(e) => e.keyCode == 13 ? e.preventDefault() : null} name="model" placeholder="(Select Model)" onClick={() => setInputDropdown('product_model')} value={product.model} onChange={(e) => (setInputDropdown(''), createProduct('model', e.target.value))}></textarea>
                    <div onClick={() => (input_dropdown !== 'product_model' ? setInputDropdown('product_model') : setInputDropdown(''))}><SVGs svg={'dropdown-arrow'}></SVGs></div>
                    { input_dropdown == 'product_model' &&
                    <div className="form-group-double-dropdown-input-list" ref={myRefs}>
                      <div className="form-group-double-dropdown-input-list-item border_bottom" onClick={() => (setInputDropdown(''), setModal('add_model'))}><SVGs svg={'plus'}></SVGs> Add new</div>
                      {allModels && allModels.sort( (a, b) => a.name > b.name ? 1 : -1).map( (item, idx) => (
                      <div key={idx} className="form-group-double-dropdown-input-list-item" onClick={(e) => (createProduct('model', e.target.innerText), setInputDropdown(''))}>{item.name}</div>
                      ))}
                    </div>
                    }
                  </div>
                </div>
                <div className="form-group-double-dropdown">
                  <label htmlFor="categories">Category</label>
                  <div className="form-group-double-dropdown-input">
                    <textarea rows="1" wrap="off" onKeyDown={(e) => e.keyCode == 13 ? e.preventDefault() : null} name="category" placeholder="(Select Category)" onClick={() => setInputDropdown('product_category')} value={product.category} onChange={(e) => (setInputDropdown(''), createProduct('category', e.target.value))}></textarea>
                    <div onClick={() => (input_dropdown !== 'product_category' ? setInputDropdown('product_category') : setInputDropdown(''))}><SVGs svg={'dropdown-arrow'}></SVGs></div>
                    { input_dropdown == 'product_category' &&
                    <div className="form-group-double-dropdown-input-list" ref={myRefs}>
                      <div className="form-group-double-dropdown-input-list-item border_bottom" onClick={() => (setInputDropdown(''), setModal('add_category'))}><SVGs svg={'plus'}></SVGs> Add new</div>
                      {allProductCategories && allProductCategories.sort( (a, b) => a.name > b.name ? 1 : -1).map( (item, idx) => (
                      <div key={idx} className="form-group-double-dropdown-input-list-item" onClick={(e) => (createProduct('category', e.target.innerText), setInputDropdown(''))}>{item.name}</div>
                      ))}
                    </div>
                    }
                  </div>
                </div>
                <div className="form-group-double-dropdown">
                  <label htmlFor="location">Location</label>
                  <div className="form-group-double-dropdown-input">
                    <textarea rows="1" wrap="off" onKeyDown={(e) => e.keyCode == 13 ? e.preventDefault() : null} name="location" placeholder="(Select Location)" onClick={() => setInputDropdown('product_location')} value={product.location} onChange={(e) => (setInputDropdown(''), createProduct('location', e.target.value))}></textarea>
                    <div onClick={() => (input_dropdown !== 'product_location' ? setInputDropdown('product_location') : setInputDropdown(''))}><SVGs svg={'dropdown-arrow'}></SVGs></div>
                    { input_dropdown == 'product_location' &&
                    <div className="form-group-double-dropdown-input-list" ref={myRefs}>
                      <div className="form-group-double-dropdown-input-list-item border_bottom" onClick={() => (setInputDropdown(''), setModal('add_location'))}><SVGs svg={'plus'}></SVGs> Add new</div>
                      {allLocations && allLocations.sort( (a, b) => a.name > b.name ? 1 : -1).map( (item, idx) => (
                      <div key={idx} className="form-group-double-dropdown-input-list-item" onClick={(e) => (createProduct('location', e.target.innerText), setInputDropdown(''))}>{item.name}</div>
                      ))}
                    </div>
                    }
                  </div>
                </div>
                <div className="form-group-double-dropdown">
                  <label htmlFor="description">Description</label>
                  <div className="form-group-triple-input">
                    <textarea id="description" rows="5" name="description" placeholder="(Description)" value={product.description} onChange={(e) => (createProduct('description', e.target.value))} required></textarea>
                  </div>
                </div>
                <div className="form-group-double-dropdown">
                  <label htmlFor="quantity">Quantity</label>
                  <div className="form-group-triple-input">
                    <textarea id="quantity" rows="1" wrap="off" onKeyDown={(e) => e.keyCode == 13 ? e.preventDefault() : null} name="quantity" placeholder="(Quantity)" value={product.quantity} onChange={(e) => (validateIsNumber('quantity'), createProduct('quantity', e.target.value))} required></textarea>
                  </div>
                </div>
                <div className="form-group-double-dropdown">
                  <label htmlFor="price">Price</label>
                  <div className="form-group-double-dropdown-input">
                    <SVGs svg={'dollar'} classprop="dollar"></SVGs>
                    <textarea id="price" rows="1" wrap="off" onKeyDown={(e) => e.keyCode == 13 ? e.preventDefault() : null} placeholder="0.00" className="dollar-input" value={product.price == 'NaN' ? '' : product.price.replace("$", "")} onChange={(e) => createProduct('price', validateIsPrice(e))} required></textarea>
                  </div>
                </div>
                <div className="form-group-triple-dropdown"></div>
                <div className="form-group-triple-qr">
                  <label htmlFor="qr_code">Generate QR Code</label>
                  <button onClick={(e) => generateQRProduct(e)}>Generate</button>
                  {!product.qr_code && <img className="form-group-triple-qr-image-2" src='https://free-qr.com/images/placeholder.svg' alt="QR Code" />}
                  {product.qr_code && <a download="qr-code.png" href={product.qr_code} alt="QR Code" title="QR-code"><img src={product.qr_code} alt="QR Code" className="form-group-triple-qr-image" /></a>}
                </div>
                <div className="form-group-triple form-group-triple-upload">
                  {/* <div className="form-group-triple-title">Add Images</div> */}
                  {selectedFiles.length < 1 && 
                  <>
                    <label htmlFor="files_upload" className="form-group-triple-upload-add">
                      <SVGs svg={'upload'}></SVGs> 
                      Browse Files
                    </label>
                    <input type="file" name="files_upload" accept="image/*" id="files_upload" multiple onChange={(e) => multipleFileChangeHandler(e, 'product')}/>
                  </>
                  }
                  {selectedFiles.length > 0 && <>
                    <div className="form-group-triple-upload-item-container">
                    {selectedFiles.map((item, idx) => (
                      <a className="form-group-triple-upload-item" href={item.location} target="_blank" rel="noreferrer" key={idx}>
                        <div>{item.location ? <img src={item.location}></img> : <SVGs svg={'file-image'}></SVGs>} </div>
                      </a>
                    ))}
                    </div>
                    {imageCount < 3 && 
                      <>
                      <label htmlFor="files_upload" className="form-group-triple-upload-more">
                        <SVGs svg={'upload'}></SVGs> 
                        Add more
                      </label>
                      <input type="file" name="files_upload" accept="image/*" id="files_upload" multiple onChange={(e) => multipleFileChangeHandler(e, 'product')}/>
                      </>
                    }
                    {imageCount == 3 && 
                      <>
                      <label onClick={() => (setSelectedFiles([]), setImageCount(0), addProductImages([]))} className="form-group-triple-upload-more">
                        <SVGs svg={'reset'}></SVGs> 
                        Reset
                      </label>
                      </>
                    }
                    </>
                  }
                </div>
                <div className="form-button-container">
                  <button type="submit" className="form-button" onClick={() => setError('Please complete entire form')}>{!loading && <span>Add Product</span>}{loading && <div className="loading"><span></span><span></span><span></span></div>}</button>
                  <div className="form-error-container">
                  {error && <span className="form-error" id="error-message"><SVGs svg={'error'}></SVGs> {error}</span>}
                  </div>
                </div>
              </form>
            </div>
          }
          {
            nav.view == 'remnant' &&
            <Remnant preloadMaterials={materials} preloadColors={colors}></Remnant>
          }
          { nav.view == 'slab-fields' &&
            <SlabFields preloadMaterials={materials} preloadColors={colors} preloadSuppliers={suppliers} preloadLocations={locations}></SlabFields>
          }
          { nav.view == 'product-fields' &&
            <ProductFields preloadBrands={brands} preloadModels={models} preloadCategories={categories} preloadLocations={locations}></ProductFields>
          }
          { nav.view == 'quote' &&
            <Quote priceList={priceList} addressList={addressList} categories={misc_categories} products={products} product_categories={allProductCategories} ></Quote>
          }
          { nav.view == 'quote-fields' &&
            <QuoteFields preloadCategories={allCategories}></QuoteFields>
          }

          {/* /////////////////// MODALS ///////////////////////////// */}
          
          { modal == 'add_material' &&
            <MaterialModal
              token={token}
              message={message}
              setMessage={setMessage}
              setModal={setModal}
              loading={loading}
              setLoading={setLoading}
              edit={edit}
              setEdit={setEdit}
              stateData={material}
              stateMethod={createType}
              dynamicSVG={dynamicSVG}
              setDynamicSVG={setDynamicSVG}
              resetState={resetType}
              submitCreate={submitCreate}
              allData={allData}
              setAllData={setAllData}
            >
            </MaterialModal>
          }
          { modal == 'add_color' &&
            <ColorModal
              token={token}
              message={message}
              setMessage={setMessage}
              setModal={setModal}
              loading={loading}
              setLoading={setLoading}
              edit={edit}
              setEdit={setEdit}
              stateData={color}
              stateMethod={createType}
              dynamicSVG={dynamicSVG}
              setDynamicSVG={setDynamicSVG}
              resetState={resetType}
              submitCreate={submitCreate}
              allData={allData}
              setAllData={setAllData}
            >
            </ColorModal>
          }
          { modal == 'add_supplier' &&
            <SupplierModal
              token={token}
              message={message}
              setMessage={setMessage}
              setModal={setModal}
              loading={loading}
              setLoading={setLoading}
              edit={edit}
              setEdit={setEdit}
              stateData={supplier}
              stateMethod={createType}
              dynamicSVG={dynamicSVG}
              setDynamicSVG={setDynamicSVG}
              resetState={resetType}
              submitCreate={submitCreate}
              allData={allData}
              setAllData={setAllData}
              validateNumber={validateNumber}
              phoneNumber={phoneNumber}
              addressSelect={addressSelect}
            >
            </SupplierModal>
          }
          { modal == 'add_location' &&
            <LocationModal
              token={token}
              message={message}
              setMessage={setMessage}
              setModal={setModal}
              loading={loading}
              setLoading={setLoading}
              edit={edit}
              setEdit={setEdit}
              stateData={location}
              stateMethod={createType}
              dynamicSVG={dynamicSVG}
              setDynamicSVG={setDynamicSVG}
              resetState={resetType}
              submitCreate={submitCreate}
              allData={allData}
              setAllData={setAllData}
            >
            </LocationModal>
          }
          {/* { modal == 'add_location' &&
            <div className="addFieldItems-modal" data-value="parent" onClick={(e) => e.target.getAttribute('data-value') == 'parent' ? setIsDragging(false) : null}>
            <div className="addFieldItems-modal-box" onPointerDown={handlePointerDown} onPointerUp={handlePointerUp} onPointerMove={handlePointerMove} style={{transform: `translateX(${translate.x}px) translateY(${translate.y}px)`}}>
              <div className="addFieldItems-modal-box-header">
                <span className="addFieldItems-modal-form-title">{edit ? 'Edit Location' : 'New Location'}</span>
                <div onClick={() => (setModal(''), setError(''), setEdit(''))}><SVGs svg={'close'}></SVGs></div>
              </div>
              <form className="addFieldItems-modal-form" onSubmit={(e) => submitAddLocation(e)}>
                <div className="form-group-single-textarea">
                  <div className="form-group-single-textarea-field">
                    <label htmlFor="name_location">Location Name</label>
                    <textarea id="name_location" rows="1" name="name_location" placeholder="(Location Name)" value={location} onChange={(e) => setLocation(e.target.value)} onFocus={(e) => e.target.placeholder = ''} onBlur={(e) => e.target.placeholder = '(Location Name)'} wrap="off" onKeyDown={(e) => e.keyCode == 13 ? e.preventDefault() : null} autoFocus={true} required></textarea>
                  </div>
                </div>
                {!edit && <button type="submit" className="form-button w100">{!loading && <span>Add Location</span>} {loading && <div className="loading"><span></span><span></span><span></span></div>}</button>}
                {edit == 'location' && <button onClick={(e) => updateLocation(e)} className="form-button w100">{!loading && <span>Update Location</span>} {loading && <div className="loading"><span></span><span></span><span></span></div>}</button>}
                {error && <span className="form-error"><SVGs svg={'error'}></SVGs>{error}</span>}
              </form>
            </div>
          </div>
          } */}
          { modal == 'add_brand' &&
          <div className="addFieldItems-modal" data-value="parent" onClick={(e) => e.target.getAttribute('data-value') == 'parent' ? setIsDragging(false) : null}>
            <div className="addFieldItems-modal-box" onPointerDown={handlePointerDown} onPointerUp={handlePointerUp} onPointerMove={handlePointerMove} style={{transform: `translateX(${translate.x}px) translateY(${translate.y}px)`}}>
              <div className="addFieldItems-modal-box-header">
                <span className="addFieldItems-modal-form-title">{edit ? 'Edit Brand' : 'New Brand'}</span>
                <div onClick={() => (setModal(''), setError(''), setEdit(''))}><SVGs svg={'close'}></SVGs></div>
              </div>
              <form className="addFieldItems-modal-form" onSubmit={(e) => submitAddBrand(e)}>
                <div className="form-group-single-textarea">
                  <div className="form-group-single-textarea-field">
                    <label htmlFor="name_brand">Brand Name</label>
                    <textarea id="name_brand" rows="1" name="name_brand" placeholder="(Brand Name)" value={brand} onChange={(e) => setBrand(e.target.value)} onFocus={(e) => e.target.placeholder = ''} onBlur={(e) => e.target.placeholder = '(Brand Name)'} wrap="off" onKeyDown={(e) => e.keyCode == 13 ? e.preventDefault() : null} autoFocus={true} required></textarea>
                  </div>
                </div>
                {!edit && <button type="submit" className="form-button w100">{!loading && <span>Add Brand</span>} {loading && <div className="loading"><span></span><span></span><span></span></div>}</button>}
                {edit == 'brand' && <button onClick={(e) => updateBrand(e)} className="form-button w100">{!loading && <span>Update Brand</span>} {loading && <div className="loading"><span></span><span></span><span></span></div>}</button>}
                {error && <span className="form-error"><SVGs svg={'error'}></SVGs>{error}</span>}
              </form>
            </div>
          </div>
          }
          { modal == 'add_model' &&
            <div className="addFieldItems-modal" data-value="parent" onClick={(e) => e.target.getAttribute('data-value') == 'parent' ? setIsDragging(false) : null}>
            <div className="addFieldItems-modal-box" onPointerDown={handlePointerDown} onPointerUp={handlePointerUp} onPointerMove={handlePointerMove} style={{transform: `translateX(${translate.x}px) translateY(${translate.y}px)`}}>
              <div className="addFieldItems-modal-box-header">
                <span className="addFieldItems-modal-form-title">{edit ? 'Edit Model' : 'New Model'}</span>
                <div onClick={() => (setModal(''), setError(''), setEdit(''))}><SVGs svg={'close'}></SVGs></div>
              </div>
              <form className="addFieldItems-modal-form" onSubmit={(e) => submitAddModel(e)}>
                <div className="form-group-single-textarea">
                  <div className="form-group-single-textarea-field">
                    <label htmlFor="name_model">Model Name</label>
                    <textarea id="name_model" rows="1" name="name_model" placeholder="(Model Name)" value={model} onChange={(e) => setModel(e.target.value)} onFocus={(e) => e.target.placeholder = ''} onBlur={(e) => e.target.placeholder = '(Model Name)'} wrap="off" onKeyDown={(e) => e.keyCode == 13 ? e.preventDefault() : null} autoFocus={true} required></textarea>
                  </div>
                </div>
                {!edit && <button type="submit" className="form-button w100">{!loading && <span>Add Model</span>} {loading && <div className="loading"><span></span><span></span><span></span></div>}</button>}
                {edit == 'model' && <button onClick={(e) => updateModel(e)} className="form-button w100">{!loading && <span>Update Model</span>} {loading && <div className="loading"><span></span><span></span><span></span></div>}</button>}
                {error && <span className="form-error"><SVGs svg={'error'}></SVGs>{error}</span>}
              </form>
            </div>
          </div>
          }
          { modal == 'add_category' &&
            <div className="addFieldItems-modal" data-value="parent" onClick={(e) => e.target.getAttribute('data-value') == 'parent' ? setIsDragging(false) : null}>
            <div className="addFieldItems-modal-box" onPointerDown={handlePointerDown} onPointerUp={handlePointerUp} onPointerMove={handlePointerMove} style={{transform: `translateX(${translate.x}px) translateY(${translate.y}px)`}}>
              <div className="addFieldItems-modal-box-header">
                <span className="addFieldItems-modal-form-title">{edit ? 'Edit Category' : 'New Category'}</span>
                <div onClick={() => (setModal(''), setError(''), setEdit(''))}><SVGs svg={'close'}></SVGs></div>
              </div>
              <form className="addFieldItems-modal-form" onSubmit={(e) => submitAddCategory(e)}>
                <div className="form-group-single-textarea">
                  <div className="form-group-single-textarea-field">
                    <label htmlFor="name_category">Category Name</label>
                    <textarea id="name_category" rows="1" name="name_category" placeholder="(Category Name)" value={category} onChange={(e) => setCategory(e.target.value)} onFocus={(e) => e.target.placeholder = ''} onBlur={(e) => e.target.placeholder = '(Category Name)'} wrap="off" onKeyDown={(e) => e.keyCode == 13 ? e.preventDefault() : null} autoFocus={true} required></textarea>
                  </div>
                </div>
                {!edit && <button type="submit" className="form-button w100">{!loading && <span>Add Category</span>} {loading && <div className="loading"><span></span><span></span><span></span></div>}</button>}
                {edit == 'category' && <button onClick={(e) => updateCategory(e)} className="form-button w100">{!loading && <span>Update Category</span>} {loading && <div className="loading"><span></span><span></span><span></span></div>}</button>}
                {error && <span className="form-error"><SVGs svg={'error'}></SVGs>{error}</span>}
              </form>
            </div>
          </div>
          }
          { modal == 'new_price_list' &&
            <PriceListModal setmodal={(type) => setModal(type)}></PriceListModal>
          }
          { modal == 'location' &&
            <AddressModal setmodal={(type) => setModal(type)} resetQuote={resetQuote} update={''}></AddressModal>
          }
          { modal == 'category' &&
            <CategoryModal setmodal={(type) => setModal(type)}></CategoryModal>
          }
        </div>
      </div>
    </>
  )
}

const mapStateToProps = (state) => {
  return {
    nav: state.nav,
    slab: state.slab,
    product: state.product,
    material: state.material,
    color: state.color,
    supplier: state.supplier,
    location: state.location
  }
}

const mapDispatchToProps = dispatch => {
  return {
    hideSideNav: () => dispatch({type: 'HIDE_SIDENAV'}),
    showSideNav: () => dispatch({type: 'SHOW_SIDENAV'}),
    changeView: (view) => dispatch({type: 'CHANGE_VIEW', value: view}),
    createType: (caseType, type, data) => dispatch({type: caseType, name: type, value: data}),
    resetType: (caseType) => dispatch({type: caseType}),
    addImages: (caseType, data) => dispatch({type: caseType, value: data}),





    createProduct: (type, data) => dispatch({type: 'CREATE_PRODUCT', name: type, value: data}),
    addProductImages: (data) => dispatch({type: 'ADD_PRODUCT_IMAGES', value: data}),
    addMaterial: (name, data) => dispatch({type: 'ADD', name: name, value: data}),
    resetMaterial: () => dispatch({type: 'RESET'}),
    addSupplier: (name, data) => dispatch({type: 'ADD', name: name, value: data}),
    resetSupplier: () => dispatch({type: 'RESET'}),
    resetQuote: () => dispatch({type: 'RESET_QUOTE'})
  }
}

Dashboard.getInitialProps = async (context) => {

  let data = new Object()
  let deepClone

  const token = getToken(context.req)
  let accessToken
  if(token){accessToken = token.split('=')[1]}
  
  data.slabs = await tableData(accessToken, 'slabs')
  data.materials = await tableData(accessToken, 'materials')
  data.colors = await tableData(accessToken, 'colors')
  data.suppliers = await tableData(accessToken, 'suppliers')
  data.locations = await tableData(accessToken, 'locations')
  deepClone = _.cloneDeep(data)
  
  return {
    token: accessToken,
    data: Object.keys(data).length > 0 ? data : null,
    originalData: Object.keys(deepClone).length > 0 ? deepClone : null,
    // params: query
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(withUser(Dashboard))
