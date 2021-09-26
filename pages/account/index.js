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
import Remnant from '../../components/account/Remnant'
import PriceListModal from '../../components/modals/PriceList'
axios.defaults.withCredentials = true

const formatter = new Intl.NumberFormat('en-US', {
  minimumFractionDigits: 2,      
  maximumFractionDigits: 2,
});

const Dashboard = ({nav, params, hideSideNav, showSideNav, changeView, slab, createSlab, addSlabImages, product, createProduct, addProductImages, materials, colors, suppliers, locations, brands, models, categories, material, supplier, addMaterial, resetMaterial, addSupplier, resetSupplier}) => {
  const myRefs = useRef(null)
  // console.log(product)
  const router = useRouter()
  const [input_dropdown, setInputDropdown] = useState('')
  const [width, setWidth] = useState()
  const [selectedFiles, setSelectedFiles] = useState([])
  const [imageCount, setImageCount] = useState(0)
  const [modal, setModal] = useState('')
  const [edit, setEdit] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [color, setColor] = useState('')
  const [allMaterials, setAllMaterials] = useState(materials)
  const [allColors, setAllColors] = useState(colors)
  const [allSuppliers, setAllSuppliers] = useState(suppliers)
  const [allLocations, setAllLocations] = useState(locations)
  const [location, setLocation] = useState('')
  const [allBrands, setAllBrands] = useState(brands)
  const [brand, setBrand] = useState('')
  const [allCategories, setAllCategories] = useState(categories)
  const [category, setCategory] = useState('')
  const [allModels, setAllModels] = useState(models)
  const [model, setModel] = useState('')

  const handleClickOutside = (event) => {
    if(myRefs.current){
      if(!myRefs.current.contains(event.target)){
        setInputDropdown('')
      }
    }
  }

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

  const validateIsNumber = (type) => {
    const input = document.getElementById(type)
    
    const regex = /[^0-9|\n\r]/g

    if(type == 'quantity' || type == 'block' || type == 'lot') input.value = input.value.split(regex).join('')
    if(type == 'size_1' || type == 'size_2') input.value = input.value.split(regex).join('') + ' in'
    if(type == 'thickness') input.value = input.value.split(regex).join('') + ' cm'

    if(input.value == ' in') input.value = ''
    if(input.value == ' cm') input.value = ''
  }

  const validateIsPrice = (evt) => {
    let newValue = Number(evt.target.value.replace(/\D/g, '')) / 100
    let formatter = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    })
    
    return formatter.format(newValue)
  }

  function checkValue(str, max){
    if (str.charAt(0) !== '0' || str == '00') {
      var num = parseInt(str);
      if (isNaN(num) || num <= 0 || num > max) num = 1;
      str = num > parseInt(max.toString().charAt(0)) && num.toString().length == 1 ? '0' + num : num.toString();
    };
    return str;
  }

  const handleDate = (e) => {
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

    createSlab('delivery_date', input)

    let date_regex = /^(0[1-9]|1[0-2])\/(0[1-9]|1\d|2\d|3[01])\/(19|20)\d{2}$/

    if(!date_regex.test(input)){
      name.classList.add('red');
      if(input == '') name.classList.remove("red")
      return
    }
  }

  const dateNow = () => {
    let date = new Date(Date.now())
    let hr = date.getHours()
    let min = date.getMinutes();

    if (min < 10) {
      min = "0" + min;
    }

    let ampm = "am";
    if( hr > 12 ) {
        hr -= 12;
        ampm = "pm";
    }


    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

    var month = monthNames[date.getUTCMonth()]
    var day = date.getUTCDate()
    var year = date.getUTCFullYear()

    return `${month} ${day}, ${year}, ${hr}:${min} ${ampm}`
  }

  const generateQRSlab = async (e) => {
    let options = {
      type: 'image/png',
      width: 288,
      quality: 1,
      margin: 1,
    }
    
    e.preventDefault()
    e.stopPropagation()

    if(slab.size_1 && slab.size_2 && slab.lot_number && slab.material){
      try {

        let qrData = new Object()

        qrData.name = slab.material
        qrData.size_width = slab.size_1
        qrData.size_height = slab.size_2
        qrData.lot = slab.lot_number
        
        const image = await QRCode.toDataURL('https://www.slabware.com/', options)
        createSlab('qr_code', image)
        setError('')
      } catch (err) {
        console.log(err)
        if(err) setError('Error generating QR code')
      }
    }else {
      if(!slab.size_1){setError('Slab size is empty, please fill out.'); window.scrollTo(0,document.body.scrollHeight); return}
      if(!slab.size_2){setError('Slab size is empty, please fill out.'); window.scrollTo(0,document.body.scrollHeight); return}
      if(!slab.lot_number){setError('Slab lot is empty, please fill out.'); window.scrollTo(0,document.body.scrollHeight); return}
      if(!slab.material){setError('Slab material is empty, please fill out.'); window.scrollTo(0,document.body.scrollHeight); return}
    }
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

  const multipleFileChangeHandler = (e, type) => {
    let imageMax = imageCount + e.target.files.length
    if(imageMax > 3){ setError('Max number of images is 3'); window.scrollTo(0,document.body.scrollHeight); return}

    if(e.target.files.length > 0){
      let array = Array.from(e.target.files)
      array.forEach( (item) => {
        let url = URL.createObjectURL(item);
        item.location = url
      })
    }
    if(type == 'slab'){
      setSelectedFiles( prevState => [...selectedFiles, ...e.target.files])
      addSlabImages([...selectedFiles, ...e.target.files])
      setImageCount(imageMax)
    }

    if(type == 'product'){
      setSelectedFiles( prevState => [...selectedFiles, ...e.target.files])
      addProductImages([...selectedFiles, ...e.target.files])
      setImageCount(imageMax)
    }
  }

  const handleAddSlab = async (e) => {
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

  const handleNumber = (e, id, data) => {
    const input = document.getElementById(id)
    let phoneNumber = input.value.replace(/\D/g, '');

    const phoneNumberLength = phoneNumber.length

    if(phoneNumberLength < 4) return phoneNumber

    if( phoneNumberLength < 7){
      return addSupplier(data, `(${phoneNumber.slice(0,3)}) ${phoneNumber.slice(3,7)}`)
    }

    return addSupplier(data, `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(
      3,
      6
    )}-${phoneNumber.slice(6, 10)}`)
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
              <div className="clientDashboard-view-new-item" onClick={() => (window.location.href = 'account?change=slab')}>
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
              <div className="clientDashboard-view-new-item" onClick={() => (window.location.href = 'account?change=quote')}>
                <SVGs svg={'document'}></SVGs>
                <span>New Quote</span>
              </div>
              <div className="clientDashboard-view-new-item" onClick={() => (setModal('new_price_list'))}>
                <SVGs svg={'price-list'}></SVGs>
                <span>New Price List</span>
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
          {
            nav.view == 'slab' && 
            <div className="clientDashboard-view-slab_form-container">
              <div className="clientDashboard-view-slab_form-heading">
                <span>New Slab </span>
                <div className="form-error-container">
                  {error && <span className="form-error"><SVGs svg={'error'}></SVGs></span>}
                </div>
              </div>
              <form className="clientDashboard-view-slab_form" onSubmit={handleAddSlab}>
                <div className="form-group-double-dropdown">
                  <label htmlFor="material">Material</label>
                  <div className="form-group-double-dropdown-input">
                    <textarea rows="1" wrap="off" onKeyDown={(e) => e.keyCode == 13 ? e.preventDefault() : null} name="material" placeholder="(Select Material)" onClick={() => setInputDropdown('slab_material')} value={slab.material} onChange={(e) => (setInputDropdown(''), createSlab('material', e.target.value))}></textarea>
                    <div onClick={() => (input_dropdown !== 'slab_material' ? setInputDropdown('slab_material') : setInputDropdown(''))}><SVGs svg={'dropdown-arrow'}></SVGs></div>
                    { input_dropdown == 'slab_material' &&
                    <div className="form-group-double-dropdown-input-list" ref={myRefs}>
                      <div className="form-group-double-dropdown-input-list-item border_bottom" onClick={() => (setInputDropdown(''), setModal('add_material'))}><SVGs svg={'plus'}></SVGs> Add new</div>
                      {allMaterials && allMaterials.sort( (a, b) => a.name > b.name ? 1 : -1).map( (item, idx) => (
                      <div key={idx} className="form-group-double-dropdown-input-list-item" onClick={(e) => (createSlab('material', e.target.innerText), setInputDropdown(''))}>{item.name}</div>
                      ))}
                    </div>
                    }
                  </div>
                </div>
                <div className="form-group-double-dropdown">
                  <label htmlFor="color">Color Name</label>
                  <div className="form-group-double-dropdown-input">
                    <textarea rows="1" wrap="off" onKeyDown={(e) => e.keyCode == 13 ? e.preventDefault() : null} name="color" placeholder="(Select Color)" onClick={() => setInputDropdown('slab_color')} value={slab.color} onChange={(e) => (setInputDropdown(''), createSlab('color', e.target.value))}></textarea>
                    <div onClick={() => (input_dropdown !== 'slab_color' ? setInputDropdown('slab_color') : setInputDropdown(''))}><SVGs svg={'dropdown-arrow'}></SVGs></div>
                    { input_dropdown == 'slab_color' &&
                    <div className="form-group-double-dropdown-input-list" ref={myRefs}>
                      <div className="form-group-double-dropdown-input-list-item border_bottom" onClick={() => (setInputDropdown(''), setModal('add_color'))}><SVGs svg={'plus'}></SVGs> Add new</div>
                      {allColors && allColors.sort( (a, b) => a.name > b.name ? 1 : -1).map( (item, idx) => (
                      <div key={idx} className="form-group-double-dropdown-input-list-item" onClick={(e) => (createSlab('color', e.target.innerText), setInputDropdown(''))}>{item.name}</div>
                      ))}
                    </div>
                    }
                  </div>
                </div>
                <div className="form-group-triple">
                  <label htmlFor="quantity">Quantity</label>
                  <div className="form-group-triple-input">
                    <textarea id="quantity" rows="1" wrap="off" onKeyDown={(e) => e.keyCode == 13 ? e.preventDefault() : null} name="quantity" placeholder="(Quantity)" value={slab.quantity} onChange={(e) => (validateIsNumber('quantity'), createSlab('quantity', e.target.value))} required></textarea>
                  </div>
                </div>
                <div className="form-group-triple">
                  <label htmlFor="size_1">Size</label>
                  <div className="form-group-triple-input units">
                    <span></span>
                    <textarea id="size_1" rows="1" wrap="off" onKeyDown={(e) => e.keyCode == 13 ? e.preventDefault() : null} name="size_1" placeholder="# in" value={slab.size_1} onChange={(e) => (validateIsNumber('size_1'), createSlab('size_1', e.target.value))} required></textarea>
                    <textarea id="size_2" rows="1" wrap="off" onKeyDown={(e) => e.keyCode == 13 ? e.preventDefault() : null} name="size_2" placeholder="# in" value={slab.size_2} onChange={(e) => (validateIsNumber('size_2'), createSlab('size_2', e.target.value))} required></textarea>
                  </div>
                </div>
                <div className="form-group-triple">
                  <label htmlFor="thickness">Thickness</label>
                  <div className="form-group-triple-input">
                    <textarea id="thickness" rows="1" wrap="off" onKeyDown={(e) => e.keyCode == 13 ? e.preventDefault() : null} name="thickness" placeholder="(Thickness)" value={slab.thickness} onChange={(e) => (validateIsNumber('thickness'), createSlab('thickness', e.target.value))} required></textarea>
                  </div>
                </div>
                <div className="form-group-double-dropdown">
                  <label htmlFor="grade">Grade</label>
                  <div className="form-group-double-dropdown-input">
                    <textarea rows="1" wrap="off" onKeyDown={(e) => e.keyCode == 13 ? e.preventDefault() : null} name="grade" placeholder="(Select Grade)" onClick={() => (setInputDropdown(''), setInputDropdown('slab_grade'))} value={slab.grade} onChange={(e) => createSlab('grade', e.target.value)}></textarea>
                    <div onClick={() => (input_dropdown !== 'slab_grade' ? setInputDropdown('slab_grade') : setInputDropdown(''))}><SVGs svg={'dropdown-arrow'}></SVGs></div>
                    { input_dropdown == 'slab_grade' &&
                    <div className="form-group-double-dropdown-input-list" ref={myRefs}>
                      <div className="form-group-double-dropdown-input-list-item" onClick={(e) => (createSlab('grade', e.target.innerText), setInputDropdown(''))}>A</div>
                      <div className="form-group-double-dropdown-input-list-item" onClick={(e) => (createSlab('grade', e.target.innerText), setInputDropdown(''))}>B</div>
                      <div className="form-group-double-dropdown-input-list-item" onClick={(e) => (createSlab('grade', e.target.innerText), setInputDropdown(''))}>C</div>
                    </div>
                    }
                  </div>
                </div>
                <div className="form-group-double-dropdown">
                  <label htmlFor="finish">Finish</label>
                  <div className="form-group-double-dropdown-input">
                    <textarea rows="1" wrap="off" onKeyDown={(e) => e.keyCode == 13 ? e.preventDefault() : null} name="finish" placeholder="(Select Finish)" onClick={() => setInputDropdown('slab_finish')} value={slab.finish} onChange={(e) => (setInputDropdown(''), createSlab('finish', e.target.value))}></textarea>
                    <div onClick={() => (input_dropdown !== 'slab_finish' ? setInputDropdown('slab_finish') : setInputDropdown(''))}><SVGs svg={'dropdown-arrow'}></SVGs></div>
                    { input_dropdown == 'slab_finish' &&
                    <div className="form-group-double-dropdown-input-list" ref={myRefs}>
                      <div className="form-group-double-dropdown-input-list-item" onClick={(e) => (createSlab('finish', e.target.innerText), setInputDropdown(''))}>Brushed</div>
                      <div className="form-group-double-dropdown-input-list-item" onClick={(e) => (createSlab('finish', e.target.innerText), setInputDropdown(''))}>Polished</div>
                      <div className="form-group-double-dropdown-input-list-item" onClick={(e) => (createSlab('finish', e.target.innerText), setInputDropdown(''))}>Honed</div>
                      <div className="form-group-double-dropdown-input-list-item" onClick={(e) => (createSlab('finish', e.target.innerText), setInputDropdown(''))}>Leather</div>
                    </div>
                    }
                  </div>
                </div>
                <div className="form-group-triple">
                  <label htmlFor="price_slab">Price per Slab</label>
                  <div className="form-group-double-dropdown-input">
                    <SVGs svg={'dollar'} classprop="dollar"></SVGs>
                    <textarea id="price_slab" rows="1" wrap="off" onKeyDown={(e) => e.keyCode == 13 ? e.preventDefault() : null} placeholder="0.00" className="dollar-input" value={slab.price_slab == 'NaN' ? '' : slab.price_slab.replace("$", "")} onChange={(e) => createSlab('price_slab', validateIsPrice(e))} required></textarea>
                  </div>
                </div>
                <div className="form-group-triple">
                  <label htmlFor="price_sqft">Price per Sqft</label>
                  <div className="form-group-double-dropdown-input">
                    <SVGs svg={'dollar'} classprop="dollar"></SVGs>
                    <textarea id="price_sqft" rows="1" wrap="off" onKeyDown={(e) => e.keyCode == 13 ? e.preventDefault() : null} placeholder="0.00" className="dollar-input" value={slab.price_sqft == 'NaN' ? '' : slab.price_sqft.replace("$", "")} onChange={(e) => createSlab('price_sqft', validateIsPrice(e))} required></textarea>
                  </div>
                </div>
                <div className="form-group-triple">
                  <label htmlFor="block">Block Number</label>
                  <div className="form-group-triple-input">
                    <textarea id="block" rows="1" wrap="off" onKeyDown={(e) => e.keyCode == 13 ? e.preventDefault() : null} placeholder="(Block #)" value={slab.block} onChange={(e) => (validateIsNumber('block'), createSlab('block', e.target.value))} required></textarea>
                  </div>
                </div>
                <div className="form-group-double-dropdown">
                  <label htmlFor="supplier">Supplier</label>
                  <div className="form-group-double-dropdown-input">
                    <textarea rows="1" wrap="off" onKeyDown={(e) => e.keyCode == 13 ? e.preventDefault() : null} name="supplier" placeholder="(Select Supplier)" onClick={() => setInputDropdown('supplier')} value={slab.supplier} onChange={(e) => (setInputDropdown(''), createSlab('supplier', e.target.value))} required></textarea>
                    <div onClick={() => (input_dropdown !== 'supplier' ? setInputDropdown('supplier') : setInputDropdown(''))}><SVGs svg={'dropdown-arrow'}></SVGs></div>
                    { input_dropdown == 'supplier' &&
                    <div className="form-group-double-dropdown-input-list" ref={myRefs}>
                      <div className="form-group-double-dropdown-input-list-item border_bottom" onClick={() => (setInputDropdown(''), setModal('add_supplier'))}><SVGs svg={'plus'}></SVGs> Add new</div>
                      {allSuppliers && allSuppliers.sort( (a, b) => a.name > b.name ? 1 : -1).map( (item, idx) => (
                      <div key={idx} className="form-group-double-dropdown-input-list-item" onClick={(e) => (createSlab('supplier', e.target.innerText), setInputDropdown(''))}>{item.name}</div>
                      ))}
                    </div>
                    }
                  </div>
                </div>
                <div className="form-group-double-dropdown">
                  <label htmlFor="location">Location</label>
                  <div className="form-group-double-dropdown-input">
                    <textarea rows="1" wrap="off" onKeyDown={(e) => e.keyCode == 13 ? e.preventDefault() : null} name="location" placeholder="(Select Location)" value={slab.location} onClick={() => setInputDropdown('location')} onChange={(e) => (setInputDropdown(''), createSlab('location', e.target.value))} required></textarea>
                    <div onClick={() => (input_dropdown !== 'location' ? setInputDropdown('location') : setInputDropdown(''))}><SVGs svg={'dropdown-arrow'}></SVGs></div>
                    { input_dropdown == 'location' &&
                    <div className="form-group-double-dropdown-input-list" ref={myRefs}>
                      <div className="form-group-double-dropdown-input-list-item border_bottom" onClick={() => (setInputDropdown(''), setModal('add_location'))}><SVGs svg={'plus'}></SVGs> Add new</div>
                      {allLocations && allLocations.sort( (a, b) => a.name > b.name ? 1 : -1).map( (item, idx) => (
                      <div key={idx} className="form-group-double-dropdown-input-list-item" onClick={(e) => (createSlab('location', e.target.innerText), setInputDropdown(''))}>{item.name}</div>
                      ))}
                    </div>
                    }
                  </div>
                </div>
                <div className="form-group-triple">
                  <label htmlFor="lot">Lot Number</label>
                  <div className="form-group-triple-input">
                    <textarea id="lot" rows="1" wrap="off" onKeyDown={(e) => e.keyCode == 13 ? e.preventDefault() : null} placeholder="(Lot #)" value={slab.lot_number} onChange={(e) => (createSlab('lot_number', e.target.value))} required></textarea>
                  </div>
                </div>
                <div className="form-group-triple">
                  <label htmlFor="delivery_date">Delivery Date</label>
                  <div className="form-group-triple-input">
                    <textarea id="delivery_date" rows="1" wrap="off" onKeyDown={(e) => e.keyCode == 13 ? e.preventDefault() : null} placeholder="(Delivery Date)" name="delivery_date" value={slab.delivery_date} onChange={(e) => handleDate(e)} required></textarea>
                  </div>
                </div>
                <div className="form-group-triple-dropdown"></div>
                <div className="form-group-triple-qr">
                  <label htmlFor="qr_code">Generate QR Code</label>
                  <button onClick={(e) => generateQRSlab(e)}>Generate</button>
                  {!slab.qr_code && <img className="form-group-triple-qr-image-2" src='https://free-qr.com/images/placeholder.svg' alt="QR Code" />}
                  {slab.qr_code && <a download="qr-code.png" href={slab.qr_code} alt="QR Code" title="QR-code"><img src={slab.qr_code} alt="QR Code" className="form-group-triple-qr-image" /></a>}
                </div>
                <div className="form-group-triple form-group-triple-upload">
                  {/* <div className="form-group-triple-title">Add Images</div> */}
                  {selectedFiles.length < 1 && 
                  <>
                    <label htmlFor="files_upload" className="form-group-triple-upload-add">
                      <SVGs svg={'upload'}></SVGs> 
                      Browse Files
                    </label>
                    <input type="file" name="files_upload" accept="image/*" id="files_upload" multiple onChange={(e) => multipleFileChangeHandler(e, 'slab')}/>
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
                      <input type="file" name="files_upload" accept="image/*" id="files_upload" multiple onChange={(e) => multipleFileChangeHandler(e, 'slab')}/>
                      </>
                    }
                    {imageCount == 3 && 
                      <>
                      <label onClick={() => (setSelectedFiles([]), setImageCount(0), addSlabImages([]))} className="form-group-triple-upload-more">
                        <SVGs svg={'reset'}></SVGs> 
                        Reset
                      </label>
                      </>
                    }
                    </>
                  }
                </div>
                <div className="form-group-triple-button-list">
                  <label htmlFor="material">Order Status</label>
                  <div className="form-group-triple-button-list">
                    <div className={`form-group-triple-button-list-item ` + (slab.ordered_status ? slab.ordered_status.split(',')[0] == 'Ordered' ? ` selected` : null : null)} onClick={(e) => (slab.ordered_status ? createSlab('ordered_status', '') : createSlab('ordered_status', `Ordered, ${dateNow()}`), setInputDropdown(''))}>{slab.ordered_status ? slab.ordered_status.split(',')[0] == 'Ordered' ? slab.ordered_status : 'Ordered' : 'Ordered'}</div>
                    <div className={`form-group-triple-button-list-item ` + (slab.received_status ? slab.received_status.split(',')[0] == 'Received' ? ` selected` : null : null)} onClick={(e) => (slab.delivered_status ? createSlab('received_status', '') : createSlab('received_status', `Received, ${dateNow()}`), setInputDropdown(''))}>{slab.received_status ? slab.received_status.split(',')[0] == 'Received' ? slab.received_status : 'Received' : 'Received'}</div>
                    <div className={`form-group-triple-button-list-item ` + (slab.delivered_status ? slab.delivered_status.split(',')[0] == 'Delivered' ? ` selected` : null : null)} onClick={(e) => (slab.delivered_status ? createSlab('delivered_status', '') : createSlab('delivered_status', `Delivered, ${dateNow()}`), setInputDropdown(''))}>{slab.delivered_status ? slab.delivered_status.split(',')[0] == 'Delivered' ? slab.delivered_status : 'Delivered' : 'Delivered'}</div>
                  </div>
                </div>
                <div className="form-button-container">
                  <button type="submit" className="form-button" onClick={() => setError('Please complete entire form')}>{!loading && <span>Add Slab</span>}{loading && <div className="loading"><span></span><span></span><span></span></div>}</button>
                  <div className="form-error-container">
                  {error && <span className="form-error" id="error-message"><SVGs svg={'error'}></SVGs> {error}</span>}
                  </div>
                </div>
              </form>
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
                      {allCategories && allCategories.sort( (a, b) => a.name > b.name ? 1 : -1).map( (item, idx) => (
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
          { modal == 'add_material' &&
            <div className="addFieldItems-modal">
            <div className="addFieldItems-modal-box">
              <div className="addFieldItems-modal-box-header">
                <span className="addFieldItems-modal-form-title">{edit ? 'Edit Material' : 'New Material'}</span>
                <div onClick={() => (setModal(''), resetMaterial(), setError(''))}><SVGs svg={'close'}></SVGs></div>
              </div>
              <form className="addFieldItems-modal-form" onSubmit={(e) => submitAddMaterial(e)}>
                <div className="form-group-single-textarea">
                  <div className="form-group-single-textarea-field">
                    <label htmlFor="name_material">Name</label>
                    <textarea id="name_material" rows="1" name="name_material" placeholder="(Material Name)" value={material.name} onChange={(e) => addMaterial('name', e.target.value)} onFocus={(e) => e.target.placeholder = ''} onBlur={(e) => e.target.placeholder = '(Material Name)'} wrap="off" onKeyDown={(e) => e.keyCode == 13 ? e.preventDefault() : null} autoFocus={true} required></textarea>
                  </div>
                </div>
                <div className="form-group-single-textarea">
                  <label htmlFor="material_description">Description</label>
                  <div className="form-group-single-textarea-field">
                    <textarea rows="5" wrap="wrap" name="description" placeholder="(Material Description)" value={material.description} onChange={(e) => addMaterial('description', e.target.value)}></textarea>
                  </div>
                </div>
                {!edit && <button type="submit" className="form-button w100">{!loading && <span>Add Material</span>} {loading && <div className="loading"><span></span><span></span><span></span></div>}</button>}
                {edit == 'material' && <button onClick={(e) => updateMaterial(e)} className="form-button w100">{!loading && <span>Update Material</span>} {loading && <div className="loading"><span></span><span></span><span></span></div>}</button>}
                {error && <span className="form-error"><SVGs svg={'error'}></SVGs>{error}</span>}
              </form>
            </div>
            </div>
          }
          { modal == 'add_color' &&
            <div className="addFieldItems-modal">
            <div className="addFieldItems-modal-box">
              <div className="addFieldItems-modal-box-header">
                <span className="addFieldItems-modal-form-title">{edit ? 'Edit Color' : 'New Color'}</span>
                <div onClick={() => (setModal(''), setError(''), setEdit(''))}><SVGs svg={'close'}></SVGs></div>
              </div>
              <form className="addFieldItems-modal-form" onSubmit={(e) => submitAddColor(e)}>
                <div className="form-group-single-textarea">
                  <div className="form-group-single-textarea-field">
                    <label htmlFor="name_color">Name</label>
                    <textarea id="name_color" rows="1" name="name_color" placeholder="(Color Name)" value={color} onChange={(e) => setColor(e.target.value)} onFocus={(e) => e.target.placeholder = ''} onBlur={(e) => e.target.placeholder = '(Color Name)'} wrap="off" onKeyDown={(e) => e.keyCode == 13 ? e.preventDefault() : null} autoFocus={true} required></textarea>
                  </div>
                </div>
                {!edit && <button type="submit" className="form-button w100">{!loading && <span>Add Color</span>} {loading && <div className="loading"><span></span><span></span><span></span></div>}</button>}
                {edit == 'color' && <button onClick={(e) => updateColor(e)} className="form-button w100">{!loading && <span>Update Color</span>} {loading && <div className="loading"><span></span><span></span><span></span></div>}</button>}
                {error && <span className="form-error"><SVGs svg={'error'}></SVGs>{error}</span>}
              </form>
            </div>
          </div>
          }
          { modal == 'add_supplier' &&
            <div className="addFieldItems-modal">
            <div className="addFieldItems-modal-box">
              <div className="addFieldItems-modal-box-header">
                <span className="addFieldItems-modal-form-title">{edit ? edit == 'readOnly' ? 'Supplier' : 'Edit Supplier' : 'New Supplier'}</span>
                <div onClick={() => (setModal(''), setError(''), setEdit(''))}><SVGs svg={'close'}></SVGs></div>
              </div>
              <form className="addFieldItems-modal-form" onSubmit={(e) => submitAddSupplier(e)}>
                <div className="form-group-single-textarea">
                  <div className="form-group-single-textarea-field">
                    <label htmlFor="name_supplier">Name</label>
                    <textarea id="name_supplier" rows="1" name="name_supplier" placeholder="(Supplier Name)" value={supplier.name} onChange={(e) => addSupplier('name', e.target.value)} onFocus={(e) => e.target.placeholder = ''} onBlur={(e) => e.target.placeholder = '(Supplier Name)'} wrap="off" onKeyDown={(e) => e.keyCode == 13 ? e.preventDefault() : null} readOnly={edit == 'readOnly' ? true : false} autoFocus={true} required></textarea>
                  </div>
                </div>
                <div className="form-group-single-textarea">
                  <div className="form-group-single-textarea-field">
                    <label htmlFor="supplier_phone">Phone</label>
                    <textarea id="supplier_phone" rows="1" name="supplier_phone" placeholder="(Supplier Phone)" value={supplier.phone} onChange={(e) => (validateIsNumber('supplier_phone'), addSupplier('phone', e.target.value), handleNumber(e, 'supplier_phone', 'phone'))} onFocus={(e) => e.target.placeholder = ''} onBlur={(e) => e.target.placeholder = '(Supplier Phone)'} wrap="off" onKeyDown={(e) => e.keyCode == 13 ? e.preventDefault() : null} readOnly={edit == 'readOnly' ? true : false}required></textarea>
                  </div>
                </div>
                <div className="form-group-single-textarea">
                  <div className="form-group-single-textarea-field">
                    <label htmlFor="supplier_address">Address</label>
                    <textarea id="supplier_address" rows="1" name="supplier_address" placeholder="(Supplier Address)" value={supplier.address} onChange={(e) => addSupplier('address', e.target.value)} onFocus={(e) => e.target.placeholder = ''} onBlur={(e) => e.target.placeholder = '(Supplier Address)'} wrap="off" onKeyDown={(e) => e.keyCode == 13 ? e.preventDefault() : null} readOnly={edit == 'readOnly' ? true : false} required></textarea>
                  </div>
                </div>
                <div className="form-group-single-textarea">
                  <div className="form-group-single-textarea-field">
                    <label htmlFor="supplier_tax_id">Tax ID</label>
                    <textarea id="supplier_tax_id" rows="1" name="supplier_tax_id" placeholder="(Supplier Tax ID)" value={supplier.tax_id} onChange={(e) => (validateIsNumber('supplier_tax_id'), addSupplier('tax_id', e.target.value))} onFocus={(e) => e.target.placeholder = ''} onBlur={(e) => e.target.placeholder = '(Supplier Tax ID)'} wrap="off" onKeyDown={(e) => e.keyCode == 13 ? e.preventDefault() : null} readOnly={edit == 'readOnly' ? true : false}></textarea>
                  </div>
                </div>
                <div className="form-group-single-textarea">
                  <div className="form-group-single-textarea-field">
                    <label htmlFor="supplier_note">Note</label>
                    <textarea id="supplier_note" rows="4" name="supplier_note" placeholder="(Note)" value={supplier.note} onChange={(e) => addSupplier('note', e.target.value)} onFocus={(e) => e.target.placeholder = ''} onBlur={(e) => e.target.placeholder = '(Note)'} readOnly={edit == 'readOnly' ? true : false}></textarea>
                  </div>
                </div>
                <div className="form-group-single-textarea">
                  <div className="form-group-single-textarea-field">
                    <label htmlFor="supplier_contact_name">Contact Name</label>
                    <textarea id="supplier_contact_name" rows="1" name="supplier_contact_name" placeholder="(Contact Name)" value={supplier.contact_name} onChange={(e) => addSupplier('contact_name', e.target.value)} onFocus={(e) => e.target.placeholder = ''} onBlur={(e) => e.target.placeholder = '(Contact Name)'} wrap="off" onKeyDown={(e) => e.keyCode == 13 ? e.preventDefault() : null} readOnly={edit == 'readOnly' ? true : false}></textarea>
                  </div>
                </div>
                <div className="form-group-single-textarea">
                  <div className="form-group-single-textarea-field">
                    <label htmlFor="supplier_contact_phone">Contact Phone</label>
                    <textarea id="supplier_contact_phone" rows="1" name="supplier_contact_phone" placeholder="(Contact Phone)" value={supplier.contact_phone} onChange={(e) => (validateIsNumber('supplier_contact_phone'), addSupplier('contact_phone', e.target.value), handleNumber(e, 'supplier_contact_phone', 'contact_phone'))} onFocus={(e) => e.target.placeholder = ''} onBlur={(e) => e.target.placeholder = '(Contact Phone)'} wrap="off" onKeyDown={(e) => e.keyCode == 13 ? e.preventDefault() : null} readOnly={edit == 'readOnly' ? true : false}></textarea>
                  </div>
                </div>
                <div className="form-group-single-textarea">
                  <div className="form-group-single-textarea-field">
                    <label htmlFor="supplier_contact_email">Contact Email</label>
                    <textarea id="supplier_contact_email" rows="1" name="supplier_contact_email" placeholder="(Contact Email)" value={supplier.contact_email} onChange={(e) => addSupplier('contact_email', e.target.value)} onFocus={(e) => e.target.placeholder = ''} onBlur={(e) => e.target.placeholder = '(Contact Email)'} wrap="off" onKeyDown={(e) => e.keyCode == 13 ? e.preventDefault() : null} readOnly={edit == 'readOnly' ? true : false}></textarea>
                  </div>
                </div>
                <div className="form-group-single-textarea">
                  <div className="form-group-single-textarea-field">
                    <label htmlFor="supplier_bank">Bank</label>
                    <textarea id="supplier_bank" rows="1" name="supplier_bank" placeholder="(Bank)" value={supplier.bank} onChange={(e) => addSupplier('bank', e.target.value)} onFocus={(e) => e.target.placeholder = ''} onBlur={(e) => e.target.placeholder = '(Bank)'} wrap="off" onKeyDown={(e) => e.keyCode == 13 ? e.preventDefault() : null} readOnly={edit == 'readOnly' ? true : false}></textarea>
                  </div>
                </div>
                <div className="form-group-single-textarea">
                  <div className="form-group-single-textarea-field">
                    <label htmlFor="supplier_account">Account</label>
                    <textarea id="supplier_account" rows="1" name="supplier_account" placeholder="(Account)" value={supplier.account} onChange={(e) => (validateIsNumber('supplier_account'), addSupplier('account', e.target.value))} onFocus={(e) => e.target.placeholder = ''} onBlur={(e) => e.target.placeholder = '(Account)'} wrap="off" onKeyDown={(e) => e.keyCode == 13 ? e.preventDefault() : null} readOnly={edit == 'readOnly' ? true : false}></textarea>
                  </div>
                </div>
                <div className="form-group-single-textarea">
                  <div className="form-group-single-textarea-field">
                    <label htmlFor="supplier_agency">Agency</label>
                    <textarea id="supplier_agency" rows="1" name="supplier_agency" placeholder="(Agency)" value={supplier.agency} onChange={(e) => addSupplier('agency', e.target.value)} onFocus={(e) => e.target.placeholder = ''} onBlur={(e) => e.target.placeholder = '(Agency)'} wrap="off" onKeyDown={(e) => e.keyCode == 13 ? e.preventDefault() : null} readOnly={edit == 'readOnly' ? true : false}></textarea>
                  </div>
                </div>
                <div className="form-group-single-textarea">
                  <div className="form-group-single-textarea-field">
                    <label htmlFor="supplier_bank_note">Bank Note</label>
                    <textarea id="supplier_bank_note" rows="4" name="supplier_bank_note" placeholder="(Bank Note)" value={supplier.bank_note} onChange={(e) => addSupplier('bank_note', e.target.value)} onFocus={(e) => e.target.placeholder = ''} onBlur={(e) => e.target.placeholder = '(Bank Note)'} readOnly={edit == 'readOnly' ? true : false}></textarea>
                  </div>
                </div>
                {!edit && <button type="submit" className="form-button w100">{!loading && <span>Add Supplier</span>} {loading && <div className="loading"><span></span><span></span><span></span></div>}</button>}
                {edit == 'supplier' && <button onClick={(e) => updateSupplier(e)} className="form-button w100">{!loading && <span>Update Supplier</span>} {loading && <div className="loading"><span></span><span></span><span></span></div>}</button>}
                {error && <span className="form-error"><SVGs svg={'error'}></SVGs>{error}</span>}
              </form>
            </div>
          </div>
          }
          { modal == 'add_location' &&
            <div className="addFieldItems-modal">
            <div className="addFieldItems-modal-box">
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
          }
          { modal == 'add_brand' &&
            <div className="addFieldItems-modal">
            <div className="addFieldItems-modal-box">
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
            <div className="addFieldItems-modal">
            <div className="addFieldItems-modal-box">
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
            <div className="addFieldItems-modal">
            <div className="addFieldItems-modal-box">
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
    supplier: state.supplier
  }
}

const mapDispatchToProps = dispatch => {
  return {
    hideSideNav: () => dispatch({type: 'HIDE_SIDENAV'}),
    showSideNav: () => dispatch({type: 'SHOW_SIDENAV'}),
    changeView: (view) => dispatch({type: 'CHANGE_VIEW', value: view}),
    createSlab: (type, data) => dispatch({type: 'CREATE_SLAB', name: type, value: data}),
    createProduct: (type, data) => dispatch({type: 'CREATE_PRODUCT', name: type, value: data}),
    addSlabImages: (data) => dispatch({type: 'ADD_SLAB_IMAGES', value: data}),
    addProductImages: (data) => dispatch({type: 'ADD_PRODUCT_IMAGES', value: data}),
    addMaterial: (name, data) => dispatch({type: 'ADD', name: name, value: data}),
    resetMaterial: () => dispatch({type: 'RESET'}),
    addSupplier: (name, data) => dispatch({type: 'ADD', name: name, value: data}),
    resetSupplier: () => dispatch({type: 'RESET'})
  }
}

Dashboard.getInitialProps = ({query}) => {
  
  return {
    params: query
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(withUser(Dashboard))
