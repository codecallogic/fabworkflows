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
import TableAlt from '../../components/tableAlt'
import { tableData } from '../../helpers/tableData'
import { slabSort, productSort, remnantSort, materialSort } from '../../helpers/sorts'
import { populateEditData } from '../../helpers/modals'

//// DATA
import { getToken } from '../../helpers/auth'
import _ from 'lodash'

//// FORMS
import SlabForm from '../../components/forms/slabForm'
import ProductForm from '../../components/forms/productForm'
import RemnantForm from '../../components/forms/remnantForm'
import { submitCreate, submitUpdate, submitDeleteImage, submitDeleteRow, submitSearch, resetDataType } from '../../helpers/forms'

//// VALIDATIONS
import { 
  validateNumber, validateSize, validatePrice, validateDate, generateQR, multipleImages, dateNow, phoneNumber, addressSelect
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
  remnant,
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
      timeOutSearch = setTimeout(() => {
        if(nav.view == 'slabs'){
          submitSearch(search, setLoading, setMessage, 'slabs/search-slabs', 'slabs', allData, setAllData, token, setDynamicSVG, changeView, 'slabs')
        }
        if(nav.view == 'products'){
          submitSearch(search, setLoading, setMessage, 'products/search-products', 'products', allData, setAllData, token, setDynamicSVG, changeView, 'products')
        }
        if(nav.view == 'remnants'){
          submitSearch(search, setLoading, setMessage, 'remnants/search-remnants', 'remnants', allData, setAllData, token, setDynamicSVG, changeView, 'remnants')
        }
        if(nav.view == 'trackers' && loading == 'slabs'){
          submitSearch(search, setLoading, setMessage, 'slabs/search-slabs', 'slabs', allData, setAllData, token, setDynamicSVG, changeView, 'trackers')
        }
        if(nav.view == 'trackers' && loading == 'products'){
          submitSearch(search, setLoading, setMessage, 'products/search-products', 'products', allData, setAllData, token, setDynamicSVG, changeView, 'trackers')
        }
      }, 2000)
    }
    
    if(search.length == 0){ 
      if(nav.view == 'slabs'){
        resetDataType(loading, setLoading, setMessage, 'slabs/all-slabs', 'slabs', allData, setAllData, token, setDynamicSVG, changeView, 'slabs')
      }
      if(nav.view == 'products'){
        resetDataType(loading, setLoading, setMessage, 'products/all-products', 'products', allData, setAllData, token, setDynamicSVG, changeView, 'products')
      }
      if(nav.view == 'remnants'){
        resetDataType(loading, setLoading, setMessage, 'remnants/all-remnants', 'remnants', allData, setAllData, token, setDynamicSVG, changeView, 'remnants')
      }
      if(nav.view == 'trackers' && loading == 'slabs'){
        resetDataType(loading, setLoading, setMessage, 'slabs/all-slabs', 'slabs', allData, setAllData, token, setDynamicSVG, changeView, 'trackers')
      }
      if(nav.view == 'trackers' && loading == 'products'){
        resetDataType(loading, setLoading, setMessage, 'products/all-products', 'products', allData, setAllData, token, setDynamicSVG, changeView, 'trackers')
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
            searchType={'slabs'}
            searchPlaceholder={'Search by material or color'}
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
            searchType={'products'}
            searchPlaceholder={'Search by brand, model, or category'}
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
            searchType={'remnants'}
            searchPlaceholder={'Search by name, material, or color'}
          >
          </Table>
        }
        {nav.view == 'trackers' &&
          <div className="table-stack">
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
            searchType={'slabs'}
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
            searchType={'products'}
          >
          </Table>
          </div>
        }
        {nav.view == 'materials' &&
          <TableAlt
            token={token}
            title={'Material List'}
            typeOfData={'materials'}
            componentData={data.materials}
            allData={allData}
            setAllData={setAllData}
            modal={modal}
            setModal={setModal}
            sortOrder={materialSort}
            selectID={selectID}
            setSelectID={setSelectID}
            controls={controls}
            setControls={setControls}
            controlsType={'materialControls'}
            searchEnable={false}
            search={search}
            setSearch={setSearch}
            message={message}
            setMessage={setMessage}
            resetCheckboxes={resetCheckboxes}
            editData={editData}
            changeView={changeView}
            setEdit={setEdit}
            viewType={'materials'}
            modalType={'add_material'}
            editModalType={'material'}
            editDataType={{key: 'materials', caseType: 'CREATE_MATERIAL'}}
            submitDeleteRow={submitDeleteRow}
            loading={loading}
            setLoading={setLoading}
            dynamicSVG={dynamicSVG}
            setDynamicSVG={setDynamicSVG}
            deleteType="materials/delete-material"
            searchType={'materials'}
            searchPlaceholder={'Search by name'}
          >
          </TableAlt>
        }
        {nav.view == 'colors' &&
          <TableAlt
            token={token}
            title={'Color List'}
            typeOfData={'colors'}
            componentData={data.colors}
            allData={allData}
            setAllData={setAllData}
            modal={modal}
            setModal={setModal}
            sortOrder={materialSort}
            selectID={selectID}
            setSelectID={setSelectID}
            controls={controls}
            setControls={setControls}
            controlsType={'colorControls'}
            searchEnable={false}
            search={search}
            setSearch={setSearch}
            message={message}
            setMessage={setMessage}
            resetCheckboxes={resetCheckboxes}
            editData={editData}
            changeView={changeView}
            setEdit={setEdit}
            viewType={'colors'}
            modalType={'add_color'}
            editModalType={'color'}
            editDataType={{key: 'colors', caseType: 'CREATE_COLOR'}}
            submitDeleteRow={submitDeleteRow}
            loading={loading}
            setLoading={setLoading}
            dynamicSVG={dynamicSVG}
            setDynamicSVG={setDynamicSVG}
            deleteType="colors/delete-color"
            searchType={'colors'}
            searchPlaceholder={'Search by name'}
          >
          </TableAlt>
        }
        {nav.view == 'suppliers' &&
          <TableAlt
            token={token}
            title={'Supplier List'}
            typeOfData={'suppliers'}
            componentData={data.suppliers}
            allData={allData}
            setAllData={setAllData}
            modal={modal}
            setModal={setModal}
            sortOrder={materialSort}
            selectID={selectID}
            setSelectID={setSelectID}
            controls={controls}
            setControls={setControls}
            controlsType={'supplierControls'}
            searchEnable={false}
            search={search}
            setSearch={setSearch}
            message={message}
            setMessage={setMessage}
            resetCheckboxes={resetCheckboxes}
            editData={editData}
            changeView={changeView}
            setEdit={setEdit}
            viewType={'suppliers'}
            modalType={'add_supplier'}
            editModalType={'supplier'}
            editDataType={{key: 'suppliers', caseType: 'CREATE_SUPPLIER'}}
            submitDeleteRow={submitDeleteRow}
            loading={loading}
            setLoading={setLoading}
            dynamicSVG={dynamicSVG}
            setDynamicSVG={setDynamicSVG}
            deleteType="suppliers/delete-supplier"
            searchType={'suppliers'}
            searchPlaceholder={'Search by name'}
          >
          </TableAlt>
        }
        {nav.view == 'locations' &&
          <TableAlt
            token={token}
            title={'Location List'}
            typeOfData={'locations'}
            componentData={data.locations}
            allData={allData}
            setAllData={setAllData}
            modal={modal}
            setModal={setModal}
            sortOrder={materialSort}
            selectID={selectID}
            setSelectID={setSelectID}
            controls={controls}
            setControls={setControls}
            controlsType={'locationControls'}
            searchEnable={false}
            search={search}
            setSearch={setSearch}
            message={message}
            setMessage={setMessage}
            resetCheckboxes={resetCheckboxes}
            editData={editData}
            changeView={changeView}
            setEdit={setEdit}
            viewType={'locations'}
            modalType={'add_location'}
            editModalType={'location'}
            editDataType={{key: 'locations', caseType: 'CREATE_LOCATION'}}
            submitDeleteRow={submitDeleteRow}
            loading={loading}
            setLoading={setLoading}
            dynamicSVG={dynamicSVG}
            setDynamicSVG={setDynamicSVG}
            deleteType="locations/delete-location"
            searchType={'locations'}
            searchPlaceholder={'Search by name'}
          >
          </TableAlt>
        }
        {nav.view == 'brands' &&
          <TableAlt
            token={token}
            title={'Brand List'}
            typeOfData={'brands'}
            componentData={data.brands}
            allData={allData}
            setAllData={setAllData}
            modal={modal}
            setModal={setModal}
            sortOrder={materialSort}
            selectID={selectID}
            setSelectID={setSelectID}
            controls={controls}
            setControls={setControls}
            controlsType={'brandControls'}
            searchEnable={false}
            search={search}
            setSearch={setSearch}
            message={message}
            setMessage={setMessage}
            resetCheckboxes={resetCheckboxes}
            editData={editData}
            changeView={changeView}
            setEdit={setEdit}
            viewType={'brands'}
            modalType={'add_brand'}
            editModalType={'brand'}
            editDataType={{key: 'brands', caseType: 'CREATE_BRAND'}}
            submitDeleteRow={submitDeleteRow}
            loading={loading}
            setLoading={setLoading}
            dynamicSVG={dynamicSVG}
            setDynamicSVG={setDynamicSVG}
            deleteType="brands/delete-brand"
            searchType={'brands'}
            searchPlaceholder={'Search by name'}
          >
          </TableAlt>
        }
        {nav.view == 'categories' &&
          <TableAlt
            token={token}
            title={'Category List'}
            typeOfData={'categories'}
            componentData={data.categories}
            allData={allData}
            setAllData={setAllData}
            modal={modal}
            setModal={setModal}
            sortOrder={materialSort}
            selectID={selectID}
            setSelectID={setSelectID}
            controls={controls}
            setControls={setControls}
            controlsType={'categoryControls'}
            searchEnable={false}
            search={search}
            setSearch={setSearch}
            message={message}
            setMessage={setMessage}
            resetCheckboxes={resetCheckboxes}
            editData={editData}
            changeView={changeView}
            setEdit={setEdit}
            viewType={'categories'}
            modalType={'add_category'}
            editModalType={'category'}
            editDataType={{key: 'categories', caseType: 'CREATE_CATEGORY'}}
            submitDeleteRow={submitDeleteRow}
            loading={loading}
            setLoading={setLoading}
            dynamicSVG={dynamicSVG}
            setDynamicSVG={setDynamicSVG}
            deleteType="categories/delete-category"
            searchType={'categories'}
            searchPlaceholder={'Search by name'}
          >
          </TableAlt>
        }
        {nav.view == 'models' &&
          <TableAlt
            token={token}
            title={'Model List'}
            typeOfData={'models'}
            componentData={data.models}
            allData={allData}
            setAllData={setAllData}
            modal={modal}
            setModal={setModal}
            sortOrder={materialSort}
            selectID={selectID}
            setSelectID={setSelectID}
            controls={controls}
            setControls={setControls}
            controlsType={'modelControls'}
            searchEnable={false}
            search={search}
            setSearch={setSearch}
            message={message}
            setMessage={setMessage}
            resetCheckboxes={resetCheckboxes}
            editData={editData}
            changeView={changeView}
            setEdit={setEdit}
            viewType={'models'}
            modalType={'add_model'}
            editModalType={'model'}
            editDataType={{key: 'models', caseType: 'CREATE_MODEL'}}
            submitDeleteRow={submitDeleteRow}
            loading={loading}
            setLoading={setLoading}
            dynamicSVG={dynamicSVG}
            setDynamicSVG={setDynamicSVG}
            deleteType="models/delete-model"
            searchType={'models'}
            searchPlaceholder={'Search by name'}
          >
          </TableAlt>
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
        {nav.view == 'remnant' &&
          <RemnantForm
            token={token}
            title={'New Remnant'}
            typeOfData={'remnants'}
            allData={allData}
            setAllData={setAllData}
            dynamicSVG={dynamicSVG}
            setDynamicSVG={setDynamicSVG}
            submitCreate={submitCreate}
            modal={modal}
            setModal={setModal}
            stateData={remnant}
            stateMethod={createType}
            originalData={originalData}
            message={message}
            setMessage={setMessage}
            loading={loading}
            setLoading={setLoading}
            validateNumber={validateNumber}
            validateSize={validateSize}
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
          </RemnantForm>
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
              <div className="clientDashboard-view-new-item" onClick={() => (setEdit(''), changeView('remnant'), resetType('RESET_REMNANT'))}>
                <SVGs svg={'remnant'}></SVGs>
                <span>New Remnant</span>
              </div>
              <div className="clientDashboard-view-new-item" onClick={() => (setEdit(''), changeView('materials'), resetType('RESET_MATERIAL'))}>
                <SVGs svg={'materials'}></SVGs>
                <span>Materials</span>
              </div>
              <div className="clientDashboard-view-new-item" onClick={() => (setEdit(''), changeView('colors'), resetType('RESET_COLOR'))}>
                <SVGs svg={'colors'}></SVGs>
                <span>Colors</span>
              </div>
              <div className="clientDashboard-view-new-item" onClick={() => (setEdit(''), changeView('suppliers'), resetType('RESET_SUPPLIER'))}>
                <SVGs svg={'supplier'}></SVGs>
                <span>Suppliers</span>
              </div>
              <div className="clientDashboard-view-new-item" onClick={() => (setEdit(''), changeView('locations'), resetType('RESET_LOCATION'))}>
                <SVGs svg={'location'}></SVGs>
                <span>Locations</span>
              </div>
              <div className="clientDashboard-view-new-item" onClick={() => (setEdit(''), changeView('brands'), resetType('RESET_BRAND'))}>
                <SVGs svg={'brand'}></SVGs>
                <span>Brands</span>
              </div>
              <div className="clientDashboard-view-new-item" onClick={() => (setEdit(''), changeView('categories'), resetType('RESET_CATEGORY'))}>
                <SVGs svg={'category'}></SVGs>
                <span>Categories</span>
              </div>
              <div className="clientDashboard-view-new-item" onClick={() => (setEdit(''), changeView('models'), resetType('RESET_MODEL'))}>
                <SVGs svg={'model'}></SVGs>
                <span>Model</span>
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
              submitUpdate={submitUpdate}
              changeView={changeView}
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
              submitUpdate={submitUpdate}
              changeView={changeView}
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
              submitUpdate={submitUpdate}
              changeView={changeView}
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
              submitUpdate={submitUpdate}
              changeView={changeView}
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
              submitUpdate={submitUpdate}
              changeView={changeView}
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
              submitUpdate={submitUpdate}
              changeView={changeView}
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
              submitUpdate={submitUpdate}
              changeView={changeView}
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
    remnant: state.remnant
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
  data.remnants         = await tableData(accessToken, 'remnants/all-remnants')
  deepClone             = _.cloneDeep(data)
  
  return {
    token: accessToken,
    data: Object.keys(data).length > 0 ? data : null,
    originalData: Object.keys(deepClone).length > 0 ? deepClone : null,
    // params: query
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(withUser(Dashboard))
