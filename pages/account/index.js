import TopNav from '../../components/client/dashboardTopNav'
import SideNav from '../../components/client/dashboardSideNav'
import {connect} from 'react-redux'
import SVGs from '../../files/svgs'
import React, { useState, useEffect } from 'react'
import QRCode from 'qrcode'
import {nanoid} from 'nanoid'
import withUser from '../withUser'
import {API} from '../../config'
import axios from 'axios'
import {useRouter} from 'next/router'
import SlabFields from '../../components/account/slabFields'
axios.defaults.withCredentials = true

const formatter = new Intl.NumberFormat('en-US', {
  minimumFractionDigits: 2,      
  maximumFractionDigits: 2,
});

const Dashboard = ({nav, params, hideSideNav, showSideNav, changeView, slab, createSlab, addSlabImages, product, createProduct, addProductImages, materials, colors, suppliers}) => {
  // console.log(product)
  const router = useRouter()
  const [input_dropdown, setInputDropdown] = useState('')
  const [width, setWidth] = useState()
  const [selectedFiles, setSelectedFiles] = useState([])
  const [imageCount, setImageCount] = useState(0)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

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
              <div className="clientDashboard-view-new-item" onClick={() => (changeView('slab'))}>
                <SVGs svg={'slab'}></SVGs>
                <span>New Slab</span>
              </div>
              <div className="clientDashboard-view-new-item" onClick={() => changeView('product')}>
                <SVGs svg={'box'}></SVGs>
                <span>New Product</span>
              </div>
              <div className="clientDashboard-view-new-item" onClick={() => changeView('slab-fields')}>
                <SVGs svg={'box'}></SVGs>
                <span>Slab Fields</span>
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
                    <div className="form-group-double-dropdown-input-list">
                      <div className="form-group-double-dropdown-input-list-item border_bottom"><SVGs svg={'plus'}></SVGs> Add new</div>
                      {materials && materials.sort( (a, b) => a.name > b.name ? 1 : -1).map( (item, idx) => (
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
                    <div className="form-group-double-dropdown-input-list">
                      <div className="form-group-double-dropdown-input-list-item border_bottom"><SVGs svg={'plus'}></SVGs> Add new</div>
                      {colors && colors.sort( (a, b) => a.name > b.name ? 1 : -1).map( (item, idx) => (
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
                    <div className="form-group-double-dropdown-input-list">
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
                    <div className="form-group-double-dropdown-input-list">
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
                    <div className="form-group-double-dropdown-input-list">
                      <div className="form-group-double-dropdown-input-list-item border_bottom"><SVGs svg={'plus'}></SVGs> Add new</div>
                      {suppliers && suppliers.sort( (a, b) => a.name > b.name ? 1 : -1).map( (item, idx) => (
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
                    <div className="form-group-double-dropdown-input-list">
                      <div className="form-group-double-dropdown-input-list-item border_bottom"><SVGs svg={'plus'}></SVGs> Add new</div>
                      <div className="form-group-double-dropdown-input-list-item" onClick={(e) => (createSlab('location', e.target.innerText), setInputDropdown(''))}>Warehouse</div>
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
                  <button type="submit" className="form-button" onClick={() => setError('Please complete entire form')}>Add Slab</button>
                  <div className="form-error-container">
                  {loading ? <iframe src="https://giphy.com/embed/sSgvbe1m3n93G" width="30" height="30" frameBorder="0" className="giphy-loading-slab" allowFullScreen></iframe> : null }
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
                    <div className="form-group-double-dropdown-input-list">
                      <div className="form-group-double-dropdown-input-list-item border_bottom"><SVGs svg={'plus'}></SVGs> Add new</div>
                      <div className="form-group-double-dropdown-input-list-item" onClick={(e) => (createProduct('brand', e.target.innerText), setInputDropdown(''))}>Cambria</div>
                      <div className="form-group-double-dropdown-input-list-item" onClick={(e) => (createProduct('brand', e.target.innerText), setInputDropdown(''))}>Oupont</div>
                      <div className="form-group-double-dropdown-input-list-item" onClick={(e) => (createProduct('brand', e.target.innerText), setInputDropdown(''))}>Compac</div>
                      <div className="form-group-double-dropdown-input-list-item" onClick={(e) => (createProduct('brand', e.target.innerText), setInputDropdown(''))}>Element Surfaces</div>
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
                    <div className="form-group-double-dropdown-input-list">
                      <div className="form-group-double-dropdown-input-list-item border_bottom"><SVGs svg={'plus'}></SVGs> Add new</div>
                      <div className="form-group-double-dropdown-input-list-item" onClick={(e) => (createProduct('model', e.target.innerText), setInputDropdown(''))}>Loloi Franca</div>
                      <div className="form-group-double-dropdown-input-list-item" onClick={(e) => (createProduct('model', e.target.innerText), setInputDropdown(''))}>Native Trails</div>
                      <div className="form-group-double-dropdown-input-list-item" onClick={(e) => (createProduct('model', e.target.innerText), setInputDropdown(''))}>Farmhouse</div>
                      <div className="form-group-double-dropdown-input-list-item" onClick={(e) => (createProduct('model', e.target.innerText), setInputDropdown(''))}>Indian Granite</div>
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
                    <div className="form-group-double-dropdown-input-list">
                      <div className="form-group-double-dropdown-input-list-item border_bottom"><SVGs svg={'plus'}></SVGs> Add new</div>
                      <div className="form-group-double-dropdown-input-list-item" onClick={(e) => (createProduct('category', e.target.innerText), setInputDropdown(''))}>Sinks</div>
                      <div className="form-group-double-dropdown-input-list-item" onClick={(e) => (createProduct('category', e.target.innerText), setInputDropdown(''))}>Faucets</div>
                      <div className="form-group-double-dropdown-input-list-item" onClick={(e) => (createProduct('category', e.target.innerText), setInputDropdown(''))}>Tools</div>
                      <div className="form-group-double-dropdown-input-list-item" onClick={(e) => (createProduct('category', e.target.innerText), setInputDropdown(''))}>Other</div>
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
                    <div className="form-group-double-dropdown-input-list">
                      <div className="form-group-double-dropdown-input-list-item border_bottom"><SVGs svg={'plus'}></SVGs> Add new</div>
                      <div className="form-group-double-dropdown-input-list-item" onClick={(e) => (createProduct('location', e.target.innerText), setInputDropdown(''))}>Warehouse</div>
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
                  <button type="submit" className="form-button" onClick={() => setError('Please complete entire form')}>Add Product</button>
                  <div className="form-error-container">
                  {loading ? <iframe src="https://giphy.com/embed/sSgvbe1m3n93G" width="30" height="30" frameBorder="0" className="giphy-loading-slab" allowFullScreen></iframe> : null }
                  {error && <span className="form-error" id="error-message"><SVGs svg={'error'}></SVGs> {error}</span>}
                  </div>
                </div>
              </form>
            </div>
          }
          { nav.view == 'slab-fields' &&
            <SlabFields preloadMaterials={materials} preloadColors={colors} preloadSuppliers={suppliers}></SlabFields>
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
    product: state.product
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
    addProductImages: (data) => dispatch({type: 'ADD_PRODUCT_IMAGES', value: data})
  }
}

Dashboard.getInitialProps = ({query}) => {
  
  return {
    params: query
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(withUser(Dashboard))
