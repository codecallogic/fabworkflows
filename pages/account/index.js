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
import QuoteFields from '../../components/account/quoteFields'
import Quote from '../../components/account/Quote'
import PriceListModal from '../../components/modals/PriceList'
import ContactModal from '../../components/modals/Contact'

//// TABLE
import Table from '../../components/table'
import TableAlt from '../../components/tableAlt'
import { tableData } from '../../helpers/tableData'
import { slabSort, productSort, remnantSort, materialSort, priceSort } from '../../helpers/sorts'
import { populateEditData } from '../../helpers/modals'

//// DATA
import { getToken } from '../../helpers/auth'
import _ from 'lodash'

//// FORMS
import SlabForm from '../../components/forms/slabForm'
import ProductForm from '../../components/forms/productForm'
import RemnantForm from '../../components/forms/remnantForm'
import QuoteForm from '../../components/forms/quoteForm'
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
import QuoteLineModal from '../../components/modals/QuoteLine'

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
  priceList,
  contact,
  quote,
  createType,
  resetType,
  addImages, 

  
  createProduct, 
  categories, 
  resetMaterial, 

 
  addressList, 
  misc_categories, 
  products, 
  resetQuote
}) => {
  const myRefs = useRef(null)
  
  console.log(originalData)
  
  const router = useRouter()
  const [allProductCategories, setAllProductCategories] = useState(categories)
  const [allCategories, setAllCategories] = useState(misc_categories)

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

  useEffect(() => {
    if(params) params.change ? changeView(params.change) : null
  }, [router.query.change])

  
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
        {nav.view == 'prices' &&
          <TableAlt
            token={token}
            title={'Price List'}
            typeOfData={'prices'}
            componentData={data.prices}
            allData={allData}
            setAllData={setAllData}
            modal={modal}
            setModal={setModal}
            sortOrder={priceSort}
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
            viewType={'prices'}
            modalType={'new_price_list'}
            editModalType={'price_list'}
            editDataType={{key: 'prices', caseType: 'CREATE_PRICE_LIST'}}
            submitDeleteRow={submitDeleteRow}
            loading={loading}
            setLoading={setLoading}
            dynamicSVG={dynamicSVG}
            setDynamicSVG={setDynamicSVG}
            deleteType="price/delete-price"
            searchType={'prices'}
            searchPlaceholder={'Search by name'}
          >
          </TableAlt>
        }
        {nav.view == 'contacts' &&
          <TableAlt
            token={token}
            title={'Contact List'}
            typeOfData={'contacts'}
            componentData={data.contacts}
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
            viewType={'contacts'}
            modalType={'new_contact'}
            editModalType={'contact'}
            editDataType={{key: 'contacts', caseType: 'CREATE_CONTACT'}}
            submitDeleteRow={submitDeleteRow}
            loading={loading}
            setLoading={setLoading}
            dynamicSVG={dynamicSVG}
            setDynamicSVG={setDynamicSVG}
            deleteType="contact/delete-contact"
            searchType={'contacts'}
            searchPlaceholder={'Search by contact name'}
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
        {nav.view == 'quote' &&
          <QuoteForm
            token={token}
            title={'New Quote'}
            typeOfData={'quotes'}
            allData={allData}
            setAllData={setAllData}
            dynamicSVG={dynamicSVG}
            setDynamicSVG={setDynamicSVG}
            submitCreate={submitCreate}
            modal={modal}
            setModal={setModal}
            stateData={quote}
            stateMethod={createType}
            originalData={originalData}
            message={message}
            setMessage={setMessage}
            loading={loading}
            setLoading={setLoading}
            resetState={resetType}
            edit={edit}
            setEdit={setEdit}
            submitUpdate={submitUpdate}
            changeView={changeView}
            submitDeleteImage={submitDeleteImage}
            editData={editData}
          >
          </QuoteForm>
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
              <div className="clientDashboard-view-new-item" onClick={() => changeView('quote')}>
                <SVGs svg={'document'}></SVGs>
                <span>New Quote</span>
              </div>
              <div className="clientDashboard-view-new-item" onClick={() => changeView('quote1')}>
                <SVGs svg={'document'}></SVGs>
                <span>Old Quote</span>
              </div>
              <div className="clientDashboard-view-new-item" onClick={() => changeView('prices')}>
                <SVGs svg={'price-list'}></SVGs>
                <span>Price List</span>
              </div>
              <div className="clientDashboard-view-new-item" onClick={() => (changeView('contacts'))}>
                <SVGs svg={'location'}></SVGs>
                <span>Contacts</span>
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
          { nav.view == 'quote1' &&
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
          { modal == 'add_quote_line' &&
            <QuoteLineModal
              token={token}
              message={message}
              setMessage={setMessage}
              setModal={setModal}
              loading={loading}
              setLoading={setLoading}
              edit={edit}
              setEdit={setEdit}
              stateData={quote}
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
            </QuoteLineModal>
          }
          { modal == 'new_price_list' &&
            <PriceListModal
              token={token}
              message={message}
              setMessage={setMessage}
              setModal={setModal}
              loading={loading}
              setLoading={setLoading}
              edit={edit}
              setEdit={setEdit}
              stateData={priceList}
              stateMethod={createType}
              dynamicSVG={dynamicSVG}
              setDynamicSVG={setDynamicSVG}
              resetState={resetType}
              submitCreate={submitCreate}
              addImages={addImages}
              allData={allData}
              setAllData={setAllData}
              submitUpdate={submitUpdate}
              changeView={changeView}
              submitDeleteImage={submitDeleteImage}
              editData={editData}
            >
            </PriceListModal>
          }
          { modal == 'new_contact' &&
            <ContactModal
              token={token}
              message={message}
              setMessage={setMessage}
              setModal={setModal}
              loading={loading}
              setLoading={setLoading}
              edit={edit}
              setEdit={setEdit}
              stateData={contact}
              stateMethod={createType}
              dynamicSVG={dynamicSVG}
              setDynamicSVG={setDynamicSVG}
              resetState={resetType}
              submitCreate={submitCreate}
              addImages={addImages}
              allData={allData}
              setAllData={setAllData}
              submitUpdate={submitUpdate}
              changeView={changeView}
              submitDeleteImage={submitDeleteImage}
              editData={editData}
            >
            </ContactModal>
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
    remnant: state.remnant,
    priceList: state.priceList,
    contact: state.contact,
    quote: state.quote
  }
}

const mapDispatchToProps = dispatch => {
  return {
    hideSideNav: () => dispatch({type: 'HIDE_SIDENAV'}),
    showSideNav: () => dispatch({type: 'SHOW_SIDENAV'}),
    changeView: (view) => dispatch({type: 'CHANGE_VIEW', value: view}),
    createType: (caseType, type, data) => dispatch({type: caseType, name: type, value: data}),
    resetType: (caseType) => dispatch({type: caseType}),
    addImages: (caseType, type, data) => dispatch({type: caseType, name: type, value: data}),
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
  data.quotes           = await tableData(accessToken, 'quotes/all-quotes')
  data.contacts         = await tableData(accessToken, 'contact/all-contacts')
  data.prices           = await tableData(accessToken, 'price/all-prices')
  deepClone             = _.cloneDeep(data)
  
  return {
    token: accessToken,
    data: Object.keys(data).length > 0 ? data : null,
    originalData: Object.keys(deepClone).length > 0 ? deepClone : null,
    // params: query
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(withUser(Dashboard))
