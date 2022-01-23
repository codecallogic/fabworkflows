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

//// TABLE
import Table from '../../components/table'
import { tableData } from '../../helpers/tableData'
import { slabSort, productSort, remnantSort } from '../../helpers/sorts'
import { populateEditData } from '../../helpers/modals'

//// DATA
import { getToken } from '../../helpers/auth'
import _ from 'lodash'

//// FORMS
import SlabForm from '../../components/forms/slabForm'
import ProductForm from '../../components/forms/productForm'
import { submitCreate, submitUpdate, submitDeleteImage, submitDeleteRow, submitSearch, resetDataType } from '../../helpers/forms'

//// VALIDATIONS
import { 
  validateNumber, validatePrice, validateDate, generateQR, multipleImages, dateNow, phoneNumber, addressSelect
} from '../../helpers/validations'

//// MODALS
import MaterialModal from '../../components/modals/Material'
import ColorModal from '../../components/modals/Color'
import SupplierModal from '../../components/modals/Supplier'
import LocationModal from '../../components/modals/Location'
import BrandModal from '../../components/modals/Brand'
import ModelModal from '../../components/modals/Model'
import CategoryModal from '../../components/modals/Category'

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
  product,
  brand,
  model,
  category,
  createType,
  resetType,
  addImages, 

  
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
  const [selectedFiles, setSelectedFiles] = useState([])
  const [imageCount, setImageCount] = useState(0)
  const [error, setError] = useState('')
  const [allMaterials, setAllMaterials] = useState(materials)
  const [allColors, setAllColors] = useState(colors)
  const [allSuppliers, setAllSuppliers] = useState(suppliers)
  const [allLocations, setAllLocations] = useState(locations)
  const [allBrands, setAllBrands] = useState(brands)
  const [allProductCategories, setAllProductCategories] = useState(categories)
  const [allCategories, setAllCategories] = useState(misc_categories)
  const [allModels, setAllModels] = useState(models)

  ///// STATE MANAGEMENT
  const [width, setWidth] = useState()
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState('')
  const [search, setSearch] = useState('')
  const [selectID, setSelectID] = useState('')
  const [controls, setControls] = useState('')
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

  useEffect(() => {setMessage(''), setLoading('')}, [nav.view])

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

  useEffect(() => {
    let timeOutSearch
    
    if(search.length > 0){
      setLoading('searching')
      timeOutSearch = setTimeout(() => {
        if(nav.view == 'slabs'){
          submitSearch(search, setLoading, setMessage, 'slabs/search-slabs', 'slabs', allData, setAllData, token, setDynamicSVG, changeView)
        }
        if(nav.view == 'products'){
          submitSearch(search, setLoading, setMessage, 'products/search-products', 'products', allData, setAllData, token, setDynamicSVG, changeView)
        }
      }, 2000)
    }
    
    if(search.length == 0){ 
      if(nav.view == 'slabs'){
        resetDataType('searching', setLoading, setMessage, 'slabs/all-slabs', 'slabs', allData, setAllData, token, setDynamicSVG, changeView)
      }
      if(nav.view == 'products'){
        resetDataType('searching', setLoading, setMessage, 'products/all-products', 'products', allData, setAllData, token, setDynamicSVG, changeView)
      }
    }

    return () => clearTimeout(timeOutSearch)

  }, [search])



  const resetCheckboxes = () => {
    const els = document.querySelectorAll('.table-rows-checkbox-input')
    els.forEach( (el) => { el.checked = false })
  }

  const editData = (keyType, caseType) => {
    let stateMethods = new Object()
    stateMethods.createType = createType

    return populateEditData(allData, keyType, caseType, stateMethods, selectID)
  }
  

  ///////////////////////////////////////////////////////////////////////////////

  useEffect(() => {
    if(params) params.change ? changeView(params.change) : null
  }, [router.query.change])

  // useEffect(() => {
  //   setSelectedFiles([]), 
  //   setImageCount(0), 
  //   addProductImages([])
  // }, [nav.view])



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
            token={token}
            title={'Slab List'}
            typeOfData={'slabs'}
            componentData={data.slabs}
            allData={allData}
            setAllData={setAllData}
            modal={modal}
            setModal={setModal}
            sortOrder={slabSort}
            selectID={selectID}
            setSelectID={setSelectID}
            controls={controls}
            setControls={setControls}
            controlsType={'slabControls'}
            searchEnable={true}
            search={search}
            setSearch={setSearch}
            message={message}
            setMessage={setMessage}
            resetCheckboxes={resetCheckboxes}
            editData={editData}
            changeView={changeView}
            setEdit={setEdit}
            viewType={'slab'}
            modalType={''}
            editDataType={{key: 'slabs', caseType: 'CREATE_SLAB'}}
            submitDeleteRow={submitDeleteRow}
            loading={loading}
            setLoading={setLoading}
            dynamicSVG={dynamicSVG}
            setDynamicSVG={setDynamicSVG}
            deleteType="slabs/delete-slab"
          >
          </Table>
        }
        {nav.view == 'products' &&
          <Table
            token={token}
            title={'Product List'}
            typeOfData={'products'}
            componentData={data.products}
            allData={allData}
            setAllData={setAllData}
            modal={modal}
            setModal={setModal}
            sortOrder={productSort}
            selectID={selectID}
            setSelectID={setSelectID}
            controls={controls}
            setControls={setControls}
            controlsType={'productControls'}
            searchEnable={true}
            search={search}
            setSearch={setSearch}
            message={message}
            setMessage={setMessage}
            resetCheckboxes={resetCheckboxes}
            editData={editData}
            changeView={changeView}
            setEdit={setEdit}
            viewType={'product'}
            modalType={''}
            editDataType={{key: 'products', caseType: 'CREATE_PRODUCT'}}
            submitDeleteRow={submitDeleteRow}
            loading={loading}
            setLoading={setLoading}
            dynamicSVG={dynamicSVG}
            setDynamicSVG={setDynamicSVG}
            deleteType="products/delete-product"
          >
          </Table>
        }
        {nav.view == 'remnants' &&
          <Table
            token={token}
            title={'Remnant List'}
            typeOfData={'remnants'}
            componentData={data.remnants}
            allData={allData}
            setAllData={setAllData}
            modal={modal}
            setModal={setModal}
            sortOrder={remnantSort}
            selectID={selectID}
            setSelectID={setSelectID}
            controls={controls}
            setControls={setControls}
            controlsType={'remnantControls'}
            searchEnable={true}
            search={search}
            setSearch={setSearch}
            message={message}
            setMessage={setMessage}
            resetCheckboxes={resetCheckboxes}
            editData={editData}
            changeView={changeView}
            setEdit={setEdit}
            viewType={'remnant'}
            modalType={''}
            editDataType={{key: 'remnants', caseType: 'CREATE_REMNANT'}}
            submitDeleteRow={submitDeleteRow}
            loading={loading}
            setLoading={setLoading}
            dynamicSVG={dynamicSVG}
            setDynamicSVG={setDynamicSVG}
            deleteType="remnants/delete-remnant"
          >
          </Table>
        }
        {nav.view == 'trackers' &&
          <span className="table-stack">
          <Table
            token={token}
            title={'Slab List'}
            typeOfData={'slabs'}
            componentData={data.slabs}
            allData={allData}
            setAllData={setAllData}
            modal={modal}
            setModal={setModal}
            sortOrder={slabSort}
            selectID={selectID}
            setSelectID={setSelectID}
            controls={controls}
            setControls={setControls}
            controlsType={'slabControls'}
            searchEnable={true}
            search={search}
            setSearch={setSearch}
            message={message}
            setMessage={setMessage}
            resetCheckboxes={resetCheckboxes}
            editData={editData}
            changeView={changeView}
            setEdit={setEdit}
            viewType={'slab'}
            modalType={''}
            editDataType={{key: 'slabs', caseType: 'CREATE_SLAB'}}
            submitDeleteRow={submitDeleteRow}
            loading={loading}
            setLoading={setLoading}
            dynamicSVG={dynamicSVG}
            setDynamicSVG={setDynamicSVG}
            deleteType="slabs/delete-slab"
          >
          </Table>
          <Table
            token={token}
            title={'Product List'}
            typeOfData={'products'}
            componentData={data.products}
            allData={allData}
            setAllData={setAllData}
            modal={modal}
            setModal={setModal}
            sortOrder={productSort}
            selectID={selectID}
            setSelectID={setSelectID}
            controls={controls}
            setControls={setControls}
            controlsType={'productControls'}
            searchEnable={true}
            search={search}
            setSearch={setSearch}
            message={message}
            setMessage={setMessage}
            resetCheckboxes={resetCheckboxes}
            editData={editData}
            changeView={changeView}
            setEdit={setEdit}
            viewType={'product'}
            modalType={''}
            editDataType={{key: 'products', caseType: 'CREATE_PRODUCT'}}
            submitDeleteRow={submitDeleteRow}
            loading={loading}
            setLoading={setLoading}
            dynamicSVG={dynamicSVG}
            setDynamicSVG={setDynamicSVG}
            deleteType="products/delete-product"
          >
          </Table>
          </span>
        }


        {/* ///// FORMS //// */}
        {nav.view == 'slab' &&
          <SlabForm
            token={token}
            title={'New Slab'}
            typeOfData={'slabs'}
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
            edit={edit}
            setEdit={setEdit}
            submitUpdate={submitUpdate}
            changeView={changeView}
            submitDeleteImage={submitDeleteImage}
            editData={editData}
          >
          </SlabForm>
        }
        {nav.view == 'product' &&
          <ProductForm
            token={token}
            title={'New Product'}
            typeOfData={'products'}
            allData={allData}
            setAllData={setAllData}
            dynamicSVG={dynamicSVG}
            setDynamicSVG={setDynamicSVG}
            submitCreate={submitCreate}
            modal={modal}
            setModal={setModal}
            stateData={product}
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
            edit={edit}
            setEdit={setEdit}
            submitUpdate={submitUpdate}
            changeView={changeView}
            submitDeleteImage={submitDeleteImage}
            editData={editData}
          >
          </ProductForm>
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
              <div className="clientDashboard-view-new-item" onClick={() => (setEdit(''), changeView('slab'), resetType('RESET_SLAB'))}>
                <SVGs svg={'slab'}></SVGs>
                <span>New Slab</span>
              </div>
              <div className="clientDashboard-view-new-item" onClick={() => (setEdit(''), changeView('product'), resetType('RESET_PRODUCT'))}>
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
          { modal == 'add_brand' &&
            <BrandModal
              token={token}
              message={message}
              setMessage={setMessage}
              setModal={setModal}
              loading={loading}
              setLoading={setLoading}
              edit={edit}
              setEdit={setEdit}
              stateData={brand}
              stateMethod={createType}
              dynamicSVG={dynamicSVG}
              setDynamicSVG={setDynamicSVG}
              resetState={resetType}
              submitCreate={submitCreate}
              allData={allData}
              setAllData={setAllData}
            >
            </BrandModal>
          }
          { modal == 'add_model' &&
            <ModelModal
              token={token}
              message={message}
              setMessage={setMessage}
              setModal={setModal}
              loading={loading}
              setLoading={setLoading}
              edit={edit}
              setEdit={setEdit}
              stateData={model}
              stateMethod={createType}
              dynamicSVG={dynamicSVG}
              setDynamicSVG={setDynamicSVG}
              resetState={resetType}
              submitCreate={submitCreate}
              allData={allData}
              setAllData={setAllData}
            >
            </ModelModal>
          }
          { modal == 'add_category' &&
            <CategoryModal
              token={token}
              message={message}
              setMessage={setMessage}
              setModal={setModal}
              loading={loading}
              setLoading={setLoading}
              edit={edit}
              setEdit={setEdit}
              stateData={category}
              stateMethod={createType}
              dynamicSVG={dynamicSVG}
              setDynamicSVG={setDynamicSVG}
              resetState={resetType}
              submitCreate={submitCreate}
              allData={allData}
              setAllData={setAllData}
            >
            </CategoryModal>
          }
          { modal == 'new_price_list' &&
            <PriceListModal setmodal={(type) => setModal(type)}></PriceListModal>
          }
          { modal == 'location' &&
            <AddressModal setmodal={(type) => setModal(type)} resetQuote={resetQuote} update={''}></AddressModal>
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
    location: state.location,
    product: state.product,
    brand: state.brand,
    model: state.model,
    category: state.category,
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
  
  data.slabs            = await tableData(accessToken, 'slabs/all-slabs')
  data.materials        = await tableData(accessToken, 'materials/all-materials')
  data.colors           = await tableData(accessToken, 'colors/all-colors')
  data.suppliers        = await tableData(accessToken, 'suppliers/all-suppliers')
  data.locations        = await tableData(accessToken, 'locations/all-locations')
  data.products         = await tableData(accessToken, 'products/all-products')
  data.remnants         = await tableData(accessToken, 'remnants/all-remnants')
  data.brands           = await tableData(accessToken, 'brands/all-brands')
  data.models           = await tableData(accessToken, 'models/all-models')
  data.categories       = await tableData(accessToken, 'categories/all-categories')
  deepClone             = _.cloneDeep(data)
  
  return {
    token: accessToken,
    data: Object.keys(data).length > 0 ? data : null,
    originalData: Object.keys(deepClone).length > 0 ? deepClone : null,
    // params: query
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(withUser(Dashboard))
