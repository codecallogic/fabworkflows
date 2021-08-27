import TopNav from '../../../components/client/dashboardTopNav'
import SideNav from '../../../components/client/dashboardSideNav'
import SVGs from '../../../files/svgs'
import {connect} from 'react-redux'
import axios from 'axios'
import {API} from '../../../config'
import withUser from '../../withUser'
import {useEffect, useState, useRef} from 'react'
import QRCode from 'qrcode'
import {nanoid} from 'nanoid'

const Slab = ({id, hideSideNav, showSideNav, slab, createSlab, addSlabImages, updateSlab, materials, colors, suppliers, locations, material, supplier, addMaterial, resetMaterial, addSupplier, resetSupplier}) => {
  const myRefs = useRef(null)
  
  const sendRedirect = true
  const [input_dropdown, setInputDropdown] = useState('')
  const [width, setWidth] = useState()
  const [error, setError] = useState('')
  const [selectedFiles, setSelectedFiles] = useState(slab.images ? slab.images : [])
  const [imageCount, setImageCount] = useState(slab.images ? slab.images.length : 0)
  const [loading, setLoading] = useState(false)
  const [modal, setModal] = useState('')
  const [edit, setEdit] = useState('')
  const [color, setColor] = useState('')
  const [allMaterials, setAllMaterials] = useState(materials)
  const [allColors, setAllColors] = useState(colors)
  const [allSuppliers, setAllSuppliers] = useState(suppliers)
  const [allLocations, setAllLocations] = useState(locations)
  const [location, setLocation] = useState('')

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
    
    for(let key in slab){
      if(key != 'images') createSlab(key, slab[key])
    }
    
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

  }, [width, slab.order_status])

  const validateIsPrice = (evt) => {
    let newValue = Number(evt.target.value.replace(/\D/g, '')) / 100
    let formatter = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    })
    
    return formatter.format(newValue)
  }

  const validateIsNumber = (type) => {
    const input = document.getElementById(type)
    
    const regex = /[^0-9|\n\r]/g

    if(type == 'quantity' || type == 'block' || type == 'lot') input.value = input.value.split(regex).join('')
    if(type == 'size_1' || type == 'size_2') input.value = input.value.split(regex).join('') + ' in'
    if(type == 'thickness') input.value = input.value.split(regex).join('') + ' cm'

    if(input.value == ' in') input.value = ''
    if(input.value == ' cm') input.value = ''
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

  const generateQR = async (e) => {
    let options = {
      type: 'image/png',
      width: 288,
      quality: 1,
      margin: 1,
    }
    
    e.preventDefault()
    e.stopPropagation()

    if(updateSlab.size_1 && updateSlab.size_2 && updateSlab.lot_number && updateSlab.material){
      try {

        let qrData = new Object()

        qrData.name = updateSlab.material
        qrData.size_width = updateSlab.size_1
        qrData.size_height = updateSlab.size_2
        qrData.lot = updateSlab.lot_number
        
        const image = await QRCode.toDataURL(JSON.stringify(qrData), options)
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

  const multipleFileChangeHandler = (e) => {
    let imageMax = imageCount + e.target.files.length
    if(imageMax > 3){ setError('Max number of images is 3'); window.scrollTo(0,document.body.scrollHeight); return}

    if(e.target.files.length > 0){
      let array = Array.from(e.target.files)
      array.forEach( (item) => {
        let url = URL.createObjectURL(item);
        item.location = url
      })
    }
    
    setSelectedFiles( prevState => [...e.target.files])
    addSlabImages([...e.target.files])
    setImageCount(imageMax)
  }

  const handleUpdateSlab = async (e) => {
    e.preventDefault()
    setError('')
    if(!updateSlab.qr_code){setError('QR Code required'); window.scrollTo(0,document.body.scrollHeight); return}
    if(!updateSlab.material){setError('Material required'); window.scrollTo(0,document.body.scrollHeight); return}
    if(!updateSlab.color){setError('Color required'); window.scrollTo(0,document.body.scrollHeight); return}
    if(!updateSlab.grade){setError('Grade required'); window.scrollTo(0,document.body.scrollHeight); return}
    if(!updateSlab.finish){setError('Finish required'); window.scrollTo(0,document.body.scrollHeight); return}
    if(!updateSlab.supplier){setError('Supplier required'); window.scrollTo(0,document.body.scrollHeight); return}
    if(!updateSlab.location){setError('Location required'); window.scrollTo(0,document.body.scrollHeight); return}
    setLoading(true)
    
    let data = new FormData()
    let delete_images = []

    if(updateSlab.images.length > 0){
      if(slab.images.length > 0){
        slab.images.forEach((item) => {
          delete_images.push(item)
        })
      }
    }
    
    if(updateSlab.images.length > 0){
      updateSlab.images.forEach((item, idx) => {
        let fileID = nanoid()
        if(!item.key) return data.append('file', item, `slabs/slab-${fileID}.${item.name.split('.')[1]}`)
      })
    }

    if(updateSlab){
      for(const key in updateSlab){
        if(key !== 'images') data.append(key, updateSlab[key])
      }
    }

    if(slab.images.length > 0){data.append('delete_images', JSON.stringify(delete_images))}

    try {
      const responseSlab = await axios.post(`${API}/inventory/update-slab`, data, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      setLoading(false)
      console.log(responseSlab)
      let id = responseSlab.data
      window.location.href = `/inventory/slab/${id}`
    } catch (error) {
      console.log(error)
      setLoading(false)
      if(error) error.response ? setError(error.response.data) : setError('Error adding slab to inventory')
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

  const deleteImage = async (item) => {
    console.log(item)
    console.log(slab)
    let storedImages = []

    selectedFiles.forEach((item, idx) => {
      if(item.key){
        return storedImages.push('true')
      }else{
        return storedImages.push('false')
      }
    })

    if(!storedImages.includes('false')){
      setLoading(true)
      try {
        const responseSlab = await axios.post(`${API}/inventory/delete-slab-image`, {id: slab._id, delete: item.key, images: selectedFiles})
        setError('')
        let response = responseSlab.data

        for(let key in response){
          if(key != 'images') createSlab(key, response[key])
        }
        setSelectedFiles(response.images)
        setLoading(false)
        // window.location.href = `/inventory/slab/${responseSlab.data.id}`
      } catch (error) {
        console.log(error.response)
        setLoading(false)
        if(error) error.response ? setError(error.response.data) : setError('Error deleting image from slab')
      }
    }else{
      return setError('Click reset to change images')
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
  
  return (
    <>
      <TopNav></TopNav>
      <div className="clientDashboard">
        <SideNav width={width} redirect={sendRedirect}></SideNav>
        <div className="clientDashboard-view">
        <div className="clientDashboard-view-slab_form-container">
              <div className="clientDashboard-view-slab_form-heading">
                <span>Update Slab #{id}</span>
                <div className="form-error-container">
                  {error && <span className="form-error"><SVGs svg={'error'}></SVGs></span>}
                </div>
              </div>
              <form className="clientDashboard-view-slab_form" onSubmit={(e) => (handleUpdateSlab(e))}>
                <div className="form-group-double-dropdown">
                  <label htmlFor="material">Material</label>
                  <div className="form-group-double-dropdown-input">
                    <textarea rows="2" name="material" placeholder="(Select Material)" onClick={() => setInputDropdown('slab_material')} value={updateSlab.material} onChange={(e) => createSlab('material', e.target.value)}></textarea>
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
                    <textarea rows="2" name="color" placeholder="(Select Color)" onClick={() => setInputDropdown('slab_color')} value={updateSlab.color} onChange={(e) => createSlab('color', e.target.value)}></textarea>
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
                    <textarea id="quantity" rows="2" name="quantity" placeholder="(Quantity)" value={updateSlab.quantity} onChange={(e) => (validateIsNumber('quantity'), createSlab('quantity', e.target.value))} required></textarea>
                  </div>
                </div>
                <div className="form-group-triple">
                  <label htmlFor="material">Size</label>
                  <div className="form-group-triple-input units">
                    <span></span>
                    <textarea id="size_1" rows="2" name="size_1" placeholder="# in" value={updateSlab.size_1} onChange={(e) => (validateIsNumber('size_1'), createSlab('size_1', e.target.value))} required></textarea>
                    <textarea id="size_2" rows="2" name="size_2" placeholder="# in" value={updateSlab.size_2} onChange={(e) => (validateIsNumber('size_2'), createSlab('size_2', e.target.value))} required></textarea>
                  </div>
                </div>
                <div className="form-group-triple">
                  <label htmlFor="material">Thickness</label>
                  <div className="form-group-triple-input">
                    <textarea id="thickness" rows="2" name="thickness" placeholder="(Thickness)" value={updateSlab.thickness} onChange={(e) => (validateIsNumber('thickness'), createSlab('thickness', e.target.value))} required></textarea>
                  </div>
                </div>
                <div className="form-group-double-dropdown">
                  <label htmlFor="grade">Grade</label>
                  <div className="form-group-double-dropdown-input">
                    <textarea rows="2" name="grade" placeholder="(Select Grade)" onClick={() => setInputDropdown('slab_grade')} value={updateSlab.grade} onChange={(e) => createSlab('grade', e.target.value)}></textarea>
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
                    <textarea rows="2" name="finish" placeholder="(Select Finish)" onClick={() => setInputDropdown('slab_finish')} value={updateSlab.finish} onChange={(e) => createSlab('finish', e.target.value)}></textarea>
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
                    <textarea id="price_slab" rows="2" placeholder="0.00" className="dollar-input" value={updateSlab.price_slab} onChange={(e) => createSlab('price_slab', validateIsPrice(e))} required></textarea>
                  </div>
                </div>
                <div className="form-group-triple">
                  <label htmlFor="price_sqft">Price per Sqft</label>
                  <div className="form-group-double-dropdown-input">
                    <SVGs svg={'dollar'} classprop="dollar"></SVGs>
                    <textarea id="price_sqft" rows="2" placeholder="0.00" className="dollar-input" value={updateSlab.price_sqft} onChange={(e) => createSlab('price_sqft', validateIsPrice(e))} required></textarea>
                  </div>
                </div>
                <div className="form-group-triple">
                  <label htmlFor="block">Block Number</label>
                  <div className="form-group-triple-input">
                    <textarea id="block" rows="2" placeholder="(Block #)" value={updateSlab.block} onChange={(e) => (validateIsNumber('block'), createSlab('block', e.target.value))} required></textarea>
                  </div>
                </div>
                <div className="form-group-double-dropdown">
                  <label htmlFor="supplier">Supplier</label>
                  <div className="form-group-double-dropdown-input">
                    <textarea rows="2" name="supplier" placeholder="(Select Supplier)" onClick={() => setInputDropdown('supplier')} value={updateSlab.supplier} onChange={(e) => createSlab('supplier', e.target.value)} required></textarea>
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
                    <textarea rows="2" name="location" placeholder="(Select Location)" value={updateSlab.location} onClick={() => setInputDropdown('location')} onChange={(e) => createSlab('location', e.target.value)} required></textarea>
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
                  <label htmlFor="material">Lot Number</label>
                  <div className="form-group-triple-input">
                    <textarea id="lot" rows="2" placeholder="(Lot #)" value={updateSlab.lot_number} onChange={(e) => (createSlab('lot_number', e.target.value))} required></textarea>
                  </div>
                </div>
                <div className="form-group-triple">
                  <label htmlFor="delivery_date">Delivery Date</label>
                  <div className="form-group-triple-input">
                    <textarea id="delivery_date" rows="2" placeholder="(Delivery Date)" name="delivery_date" value={updateSlab.delivery_date} onChange={(e) => handleDate(e)} required></textarea>
                  </div>
                </div>
                <div className="form-group-triple-dropdown"></div>
                <div className="form-group-triple-qr">
                  <label htmlFor="material">Generate QR Code</label>
                  <button onClick={(e) => generateQR(e)}>Generate</button>
                  {!updateSlab.qr_code && <img className="form-group-triple-qr-image-2" src='https://free-qr.com/images/placeholder.svg' alt="QR Code" />}
                  {updateSlab.qr_code && <a download="qr-code.png" href={updateSlab.qr_code} alt="QR Code" title="QR-code"><img src={updateSlab.qr_code} alt="QR Code" className="form-group-triple-qr-image" /></a>}
                </div>
                <div className="form-group-triple form-group-triple-upload">
                  {/* <div className="form-group-triple-title">Add Images</div> */}
                  {selectedFiles.length < 1 && 
                  <>
                    <label htmlFor="files_upload" className="form-group-triple-upload-add">
                      <SVGs svg={'upload'}></SVGs> 
                      Browse Files
                    </label>
                    <input type="file" name="files_upload" accept="image/*" id="files_upload" multiple onChange={(e) => multipleFileChangeHandler(e)}/>
                  </>
                  }
                  {selectedFiles.length > 0 && <>
                    <div className="form-group-triple-upload-item-container">
                    {selectedFiles.map((item, idx) => (
                      <a className="form-group-triple-upload-item" key={idx}>
                        <div>{item.location ? (<><span className="form-group-triple-upload-item-delete" onClick={(e) => deleteImage(item)}><SVGs svg={'close'} classprop={'form-group-triple-upload-item-delete-svg'}></SVGs></span><img src={item.location} onClick={() => window.open(item.location, '_blank').focus()}></img></>): <SVGs svg={'file-image'}></SVGs>} </div>
                      </a>
                    ))}
                    </div>
                    {imageCount < 3 && 
                      <>
                      <label onClick={() => (setSelectedFiles([]), setImageCount(0), addSlabImages([]))} htmlFor="files_upload" className="form-group-triple-upload-more">
                        <SVGs svg={'upload'}></SVGs> 
                        Update
                      </label>
                      <input type="file" name="files_upload" accept="image/*" id="files_upload" multiple onChange={(e) => multipleFileChangeHandler(e)}/>
                      </>
                    }
                    {imageCount == 3 && 
                      <>
                      <label onClick={() => (setError(''), setSelectedFiles([]), setImageCount(0), addSlabImages([]))} className="form-group-triple-upload-more">
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
                    <div className={`form-group-triple-button-list-item ` + (updateSlab.ordered_status ? updateSlab.ordered_status.split(',')[0] == 'Ordered' ? ` selected` : null : null)} onClick={(e) => (updateSlab.ordered_status ? createSlab('ordered_status', '') : createSlab('ordered_status', `Ordered, ${dateNow()}`), setInputDropdown(''))}>{updateSlab.ordered_status ? updateSlab.ordered_status.split(',')[0] == 'Ordered' ? updateSlab.ordered_status : 'Ordered' : 'Ordered'}</div>
                    <div className={`form-group-triple-button-list-item ` + (updateSlab.received_status ? updateSlab.received_status.split(',')[0] == 'Received' ? ` selected` : null : null)} onClick={(e) => (updateSlab.received_status ? createSlab('received_status', '') : createSlab('received_status', `Received, ${dateNow()}`), setInputDropdown(''))}>{updateSlab.received_status ? updateSlab.received_status.split(',')[0] == 'Received' ? updateSlab.received_status : 'Received' : 'Received'}</div>
                    <div className={`form-group-triple-button-list-item ` + (updateSlab.delivered_status ? updateSlab.delivered_status.split(',')[0] == 'Delivered' ? ` selected` : null : null)} onClick={(e) => (updateSlab.delivered_status ? createSlab('delivered_status', '') : createSlab('delivered_status', `Delivered, ${dateNow()}`), setInputDropdown(''))}>{updateSlab.delivered_status ? updateSlab.delivered_status.split(',')[0] == 'Delivered' ? updateSlab.delivered_status : 'Delivered' : 'Delivered'}</div>
                  </div>
                </div>
                <div className="form-button-container">
                  <button type="submit" className="form-button" onClick={() => setError('Update form is currently being built')}>{!loading && <span>Update Slab</span>}{loading && <div className="loading"><span></span><span></span><span></span></div>}</button>
                  <div className="form-error-container">
                  {error && <span className="form-error" id="error-message"><SVGs svg={'error'}></SVGs> {error}</span>}
                  </div>
                </div>
              </form>
            </div>
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
                    <textarea id="supplier_phone" rows="1" name="supplier_phone" placeholder="(Supplier Phone)" value={supplier.phone} onChange={(e) => (validateIsNumber('supplier_phone'), addSupplier('phone', e.target.value), handleNumber(e, 'supplier_phone', 'phone'))} onFocus={(e) => e.target.placeholder = ''} onBlur={(e) => e.target.placeholder = '(Supplier Phone)'} wrap="off" onKeyDown={(e) => e.keyCode == 13 ? e.preventDefault() : null} readOnly={edit == 'readOnly' ? true : false} required></textarea>
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
        </div>
      </div>
    </>
  )
}

Slab.getInitialProps = async ({query, res}) => {
  let id = query.id

  let slab = null

  try {
    const responseSlab = await axios.post(`${API}/inventory/slab`, {id})
    if(responseSlab.data){
      slab = responseSlab.data
    }else{
      res.writeHead(307, {
        Location: '/account'
      });
      res.end();
    }
    
  } catch (error) {
    if(error){
      res.writeHead(307, {
        Location: '/account'
      });
      res.end();
    }
  }

  return {
    id: id,
    slab: slab
  }
}

const mapStateToProps = state => {
  return {
    updateSlab: state.slab,
    material: state.material,
    supplier: state.supplier
  }
}

const mapDispatchToProps = dispatch => {
  return {
    hideSideNav: () => dispatch({type: 'HIDE_SIDENAV'}),
    showSideNav: () => dispatch({type: 'SHOW_SIDENAV'}),
    createSlab: (type, data) => dispatch({type: 'CREATE_SLAB', name: type, value: data}),
    addSlabImages: (data) => dispatch({type: 'ADD_SLAB_IMAGES', value: data}),
    addMaterial: (name, data) => dispatch({type: 'ADD', name: name, value: data}),
    resetMaterial: () => dispatch({type: 'RESET'}),
    addSupplier: (name, data) => dispatch({type: 'ADD', name: name, value: data}),
    resetSupplier: () => dispatch({type: 'RESET'})
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(withUser(Slab))
