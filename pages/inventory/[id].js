import TopNav from '../../components/client/dashboardTopNav'
import SideNav from '../../components/client/dashboardSideNav'
import SVGs from '../../files/svgs'
import {connect} from 'react-redux'
import axios from 'axios'
import {API} from '../../config'
import withUser from '../withUser'
import {useEffect, useState} from 'react'
import QRCode from 'qrcode'

// http://localhost:3000/inventory/60fa370f5d01d515b87ae169

const Slab = ({id, hideSideNav, showSideNav, slab, createSlab, addSlabImages, updateSlab}) => {
  const sendRedirect = true
  const [input_dropdown, setInputDropdown] = useState('')
  const [width, setWidth] = useState()
  const [error, setError] = useState('')
  const [selectedFiles, setSelectedFiles] = useState(slab.images ? [...slab.images] : [])
  const [imageCount, setImageCount] = useState(slab.images ? slab.images.length : 0)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    
    for(let key in slab){
      if(key !== 'images') createSlab(key, slab[key])
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
    
    setSelectedFiles( prevState => [...selectedFiles, ...e.target.files])
    addSlabImages([...selectedFiles, ...e.target.files])
    setImageCount(imageMax)
  }

  const handleUpdateSlab = (e) => {
    e.preventDefault()
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
              <form className="clientDashboard-view-slab_form" onSubmit={handleUpdateSlab}>
                <div className="form-group-double-dropdown">
                  <label htmlFor="material">Material</label>
                  <div className="form-group-double-dropdown-input">
                    <textarea rows="2" name="material" placeholder="(Select Material)" onClick={() => setInputDropdown('slab_material')} value={updateSlab.material} onChange={(e) => createSlab('material', e.target.value)}></textarea>
                    <div onClick={() => (input_dropdown !== 'slab_material' ? setInputDropdown('slab_material') : setInputDropdown(''))}><SVGs svg={'dropdown-arrow'}></SVGs></div>
                    { input_dropdown == 'slab_material' &&
                    <div className="form-group-double-dropdown-input-list">
                      <div className="form-group-double-dropdown-input-list-item border_bottom"><SVGs svg={'plus'}></SVGs> Add new</div>
                      <div className="form-group-double-dropdown-input-list-item" onClick={(e) => (createSlab('material', e.target.innerText), setInputDropdown(''))}>Bianco Carrara</div>
                      <div className="form-group-double-dropdown-input-list-item" onClick={(e) => (createSlab('material', e.target.innerText), setInputDropdown(''))}>Calacatta Milano</div>
                      <div className="form-group-double-dropdown-input-list-item" onClick={(e) => (createSlab('material', e.target.innerText), setInputDropdown(''))}>Calacatta Mirragio</div>
                      <div className="form-group-double-dropdown-input-list-item" onClick={(e) => (createSlab('material', e.target.innerText), setInputDropdown(''))}>Calacatta Sierra</div>
                      <div className="form-group-double-dropdown-input-list-item" onClick={(e) => (createSlab('material', e.target.innerText), setInputDropdown(''))}>Calacatta Trevi</div>
                      <div className="form-group-double-dropdown-input-list-item" onClick={(e) => (createSlab('material', e.target.innerText), setInputDropdown(''))}>Carrara Lumos</div>
                      <div className="form-group-double-dropdown-input-list-item" onClick={(e) => (createSlab('material', e.target.innerText), setInputDropdown(''))}>White Soul</div>
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
                    <div className="form-group-double-dropdown-input-list">
                      <div className="form-group-double-dropdown-input-list-item border_bottom"><SVGs svg={'plus'}></SVGs> Add new</div>
                      <div className="form-group-double-dropdown-input-list-item" onClick={(e) => (createSlab('color', e.target.innerText), setInputDropdown(''))}>Summerhill</div>
                      <div className="form-group-double-dropdown-input-list-item" onClick={(e) => (createSlab('color', e.target.innerText), setInputDropdown(''))}>Agatha Black</div>
                      <div className="form-group-double-dropdown-input-list-item" onClick={(e) => (createSlab('color', e.target.innerText), setInputDropdown(''))}>Alpine Valley</div>
                      <div className="form-group-double-dropdown-input-list-item" onClick={(e) => (createSlab('color', e.target.innerText), setInputDropdown(''))}>Artic Valley</div>
                      <div className="form-group-double-dropdown-input-list-item" onClick={(e) => (createSlab('color', e.target.innerText), setInputDropdown(''))}>Aspin White</div>
                      <div className="form-group-double-dropdown-input-list-item" onClick={(e) => (createSlab('color', e.target.innerText), setInputDropdown(''))}>Peacock Green</div>
                      <div className="form-group-double-dropdown-input-list-item" onClick={(e) => (createSlab('color', e.target.innerText), setInputDropdown(''))}>Raja Pink</div>
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
                    <div className="form-group-double-dropdown-input-list">
                      <div className="form-group-double-dropdown-input-list-item border_bottom"><SVGs svg={'plus'}></SVGs> Add new</div>
                      <div className="form-group-double-dropdown-input-list-item" onClick={(e) => (createSlab('grade', e.target.innerText), setInputDropdown(''))}>Entry Level Granite</div>
                      <div className="form-group-double-dropdown-input-list-item" onClick={(e) => (createSlab('grade', e.target.innerText), setInputDropdown(''))}>Mid Level Granite</div>
                      <div className="form-group-double-dropdown-input-list-item" onClick={(e) => (createSlab('grade', e.target.innerText), setInputDropdown(''))}>High Grade Granite</div>
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
                    <div className="form-group-double-dropdown-input-list">
                      <div className="form-group-double-dropdown-input-list-item border_bottom"><SVGs svg={'plus'}></SVGs> Add new</div>
                      <div className="form-group-double-dropdown-input-list-item" onClick={(e) => (createSlab('finish', e.target.innerText), setInputDropdown(''))}>Natural Cleft</div>
                      <div className="form-group-double-dropdown-input-list-item" onClick={(e) => (createSlab('finish', e.target.innerText), setInputDropdown(''))}>Polished Stone Finish</div>
                      <div className="form-group-double-dropdown-input-list-item" onClick={(e) => (createSlab('finish', e.target.innerText), setInputDropdown(''))}>Tumbled Stone Finish</div>
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
                    <div className="form-group-double-dropdown-input-list">
                      <div className="form-group-double-dropdown-input-list-item border_bottom"><SVGs svg={'plus'}></SVGs> Add new</div>
                      <div className="form-group-double-dropdown-input-list-item" onClick={(e) => (createSlab('supplier', e.target.innerText), setInputDropdown(''))}>MSI</div>
                      <div className="form-group-double-dropdown-input-list-item" onClick={(e) => (createSlab('supplier', e.target.innerText), setInputDropdown(''))}>Slabware</div>
                      <div className="form-group-double-dropdown-input-list-item" onClick={(e) => (createSlab('supplier', e.target.innerText), setInputDropdown(''))}>Your Company</div>
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
                    <div className="form-group-double-dropdown-input-list">
                      <div className="form-group-double-dropdown-input-list-item border_bottom"><SVGs svg={'plus'}></SVGs> Add new</div>
                      <div className="form-group-double-dropdown-input-list-item" onClick={(e) => (createSlab('location', e.target.innerText), setInputDropdown(''))}>Warehouse</div>
                    </div>
                    }
                  </div>
                </div>
                <div className="form-group-triple">
                  <label htmlFor="material">Lot Number</label>
                  <div className="form-group-triple-input">
                    <textarea id="lot" rows="2" placeholder="(Lot #)" value={updateSlab.lot_number} onChange={(e) => (validateIsNumber('lot'), createSlab('lot_number', e.target.value))} required></textarea>
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
                      <input type="file" name="files_upload" accept="image/*" id="files_upload" multiple onChange={(e) => multipleFileChangeHandler(e)}/>
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
                    <div className={`form-group-triple-button-list-item ` + (updateSlab.order_status ? updateSlab.order_status.split(',')[0] == 'Ordered' ? ` selected` : null : null)} onClick={(e) => (createSlab('order_status', `Ordered, ${dateNow()}`), setInputDropdown(''))}>{updateSlab.order_status ? updateSlab.order_status.split(',')[0] == 'Ordered' ? updateSlab.order_status : 'Ordered' : 'Ordered'}</div>
                    <div className={`form-group-triple-button-list-item ` + (updateSlab.order_status ? updateSlab.order_status.split(',')[0] == 'Received' ? ` selected` : null : null)} onClick={(e) => (createSlab('order_status', `Received, ${dateNow()}`), setInputDropdown(''))}>{updateSlab.order_status ? updateSlab.order_status.split(',')[0] == 'Received' ? updateSlab.order_status : 'Received' : 'Received'}</div>
                    <div className={`form-group-triple-button-list-item ` + (updateSlab.order_status ? updateSlab.order_status.split(',')[0] == 'Delivered' ? ` selected` : null : null)} onClick={(e) => (createSlab('order_status', `Delivered, ${dateNow()}`), setInputDropdown(''))}>{updateSlab.order_status ? updateSlab.order_status.split(',')[0] == 'Delivered' ? updateSlab.order_status : 'Delivered' : 'Delivered'}</div>
                  </div>
                </div>
                <div className="form-button-container">
                  <button type="submit" className="form-button" onClick={() => setError('Update form is currently being built')}>Update Slab</button>
                  <div className="form-error-container">
                  {loading ? <iframe src="https://giphy.com/embed/sSgvbe1m3n93G" width="30" height="30" frameBorder="0" className="giphy-loading-slab" allowFullScreen></iframe> : null }
                  {error && <span className="form-error" id="error-message"><SVGs svg={'error'}></SVGs> {error}</span>}
                  </div>
                </div>
              </form>
            </div>
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
    updateSlab: state.slab
  }
}

const mapDispatchToProps = dispatch => {
  return {
    hideSideNav: () => dispatch({type: 'HIDE_SIDENAV'}),
    showSideNav: () => dispatch({type: 'SHOW_SIDENAV'}),
    createSlab: (type, data) => dispatch({type: 'CREATE_SLAB', name: type, value: data}),
    addSlabImages: (data) => dispatch({type: 'ADD_SLAB_IMAGES', value: data})
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(withUser(Slab))
