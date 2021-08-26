import TopNav from '../../../components/client/dashboardTopNav'
import SideNav from '../../../components/client/dashboardSideNav'
import SVGs from '../../../files/svgs'
import {connect} from 'react-redux'
import axios from 'axios'
import {API} from '../../../config'
import withUser from '../../withUser'
import {useEffect, useState} from 'react'
import QRCode from 'qrcode'
import {nanoid} from 'nanoid'

const Product = ({id, hideSideNav, showSideNav, product, createProduct, addProductImages, updateProduct}) => {
  const sendRedirect = true
  const [input_dropdown, setInputDropdown] = useState('')
  const [width, setWidth] = useState()
  const [error, setError] = useState('')
  const [selectedFiles, setSelectedFiles] = useState(product.images ? [...product.images] : [])
  const [imageCount, setImageCount] = useState(product.images ? product.images.length : 0)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    
    for(let key in product){
      if(key !== 'images') createProduct(key, product[key])
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

  }, [width])

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

  const generateQRProduct = async (e) => {
    let options = {
      type: 'image/png',
      width: 288,
      quality: 1,
      margin: 1,
    }
    
    e.preventDefault()
    e.stopPropagation()

    if(updateProduct.brand && updateProduct.model && updateProduct.category && updateProduct.description){
      try {

        let qrData = new Object()

        qrData.brand = updateProduct.brand
        qrData.model = updateProduct.model
        qrData.category = updateProduct.category
        qrData.description = updateProduct.description
        console.log(qrData)
        const image = await QRCode.toDataURL(JSON.stringify(qrData), options)
        createProduct('qr_code', image)
        setError('')
      } catch (err) {
        console.log(err)
        if(err) setError('Error generating QR code')
      }
    }else {
      if(!updateProduct.brand){setError('Product brand is empty, please fill out.'); window.scrollTo(0,document.body.scrollHeight); return}
      if(!updateProduct.model){setError('Product model is empty, please fill out.'); window.scrollTo(0,document.body.scrollHeight); return}
      if(!updateProduct.category){setError('Product category is empty, please fill out.'); window.scrollTo(0,document.body.scrollHeight); return}
      if(!updateProduct.description){setError('Product description is empty, please fill out.'); window.scrollTo(0,document.body.scrollHeight); return}
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
    addProductImages([...e.target.files])
    setImageCount(imageMax)
  }

  const handleUpdateProduct = async (e) => {
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
    let delete_images = []

    if(updateProduct.images.length > 0){
      if(product.images.length > 0){
        product.images.forEach((item) => {
          delete_images.push(item)
        })
      }
    }
    
    if(updateProduct.images.length > 0){
      updateProduct.images.forEach((item, idx) => {
        let fileID = nanoid()
        if(!item.key) return data.append('file', item, `products/product-${fileID}.${item.name.split('.')[1]}`)
      })
    }

    if(updateProduct){
      for(const key in updateProduct){
        if(key !== 'images') data.append(key, updateProduct[key])
      }
    }

    if(product.images.length > 0){data.append('delete_images', JSON.stringify(delete_images))}

    try {
      const responseProduct = await axios.post(`${API}/inventory/update-product`, data, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      setLoading(false)
      console.log(responseProduct)
      let id = responseProduct.data
      window.location.href = `/inventory/product/${id}`
    } catch (error) {
      console.log(error)
      setLoading(false)
      if(error) error.response ? setError(error.response.data) : setError('Error adding product to inventory')
    }
  }

  const deleteImage = async (item) => {
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
        const responseProduct = await axios.post(`${API}/inventory/delete-product-image`, {id: product._id, delete: item.key, images: selectedFiles})
        setError('')
        let response = responseProduct.data

        for(let key in response){
          if(key != 'images') createProduct(key, response[key])
        }
        setSelectedFiles(response.images)
        setLoading(false)
        // window.location.href = `/inventory/slab/${responseSlab.data.id}`
      } catch (error) {
        console.log(error.response)
        setLoading(false)
        if(error) error.response ? setError(error.response.data) : setError('Error deleting image from product')
      }
    }else{
      return setError('Click reset to change images')
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
                <span>Update Product #{id}</span>
                <div className="form-error-container">
                  {error && <span className="form-error"><SVGs svg={'error'}></SVGs></span>}
                </div>
              </div>
              <form className="clientDashboard-view-slab_form" onSubmit={handleUpdateProduct}>
              <div className="form-group-double-dropdown">
                  <label htmlFor="brand">Brand</label>
                  <div className="form-group-double-dropdown-input">
                    <textarea rows="1" wrap="off" onKeyDown={(e) => e.keyCode == 13 ? e.preventDefault() : null} name="brand" placeholder="(Select Brand)" onClick={() => setInputDropdown('product_brand')} value={updateProduct.brand} onChange={(e) => (setInputDropdown(''), createProduct('brand', e.target.value))}></textarea>
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
                    <textarea rows="1" wrap="off" onKeyDown={(e) => e.keyCode == 13 ? e.preventDefault() : null} name="model" placeholder="(Select Model)" onClick={() => setInputDropdown('product_model')} value={updateProduct.model} onChange={(e) => (setInputDropdown(''), createProduct('model', e.target.value))}></textarea>
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
                    <textarea rows="1" wrap="off" onKeyDown={(e) => e.keyCode == 13 ? e.preventDefault() : null} name="category" placeholder="(Select Category)" onClick={() => setInputDropdown('product_category')} value={updateProduct.category} onChange={(e) => (setInputDropdown(''), createProduct('category', e.target.value))}></textarea>
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
                    <textarea rows="1" wrap="off" onKeyDown={(e) => e.keyCode == 13 ? e.preventDefault() : null} name="location" placeholder="(Select Location)" onClick={() => setInputDropdown('product_location')} value={updateProduct.location} onChange={(e) => (setInputDropdown(''), createProduct('location', e.target.value))}></textarea>
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
                    <textarea id="description" rows="5" name="description" placeholder="(Description)" value={updateProduct.description} onChange={(e) => (createProduct('description', e.target.value))} required></textarea>
                  </div>
                </div>
                <div className="form-group-double-dropdown">
                  <label htmlFor="quantity">Quantity</label>
                  <div className="form-group-triple-input">
                    <textarea id="quantity" rows="1" wrap="off" onKeyDown={(e) => e.keyCode == 13 ? e.preventDefault() : null} name="quantity" placeholder="(Quantity)" value={updateProduct.quantity} onChange={(e) => (validateIsNumber('quantity'), createProduct('quantity', e.target.value))} required></textarea>
                  </div>
                </div>
                <div className="form-group-double-dropdown">
                  <label htmlFor="price">Price</label>
                  <div className="form-group-double-dropdown-input">
                    <SVGs svg={'dollar'} classprop="dollar"></SVGs>
                    <textarea id="price" rows="1" wrap="off" onKeyDown={(e) => e.keyCode == 13 ? e.preventDefault() : null} placeholder="0.00" className="dollar-input" value={updateProduct.price == 'NaN' ? '' : updateProduct.price} onChange={(e) => createProduct('price', validateIsPrice(e))} required></textarea>
                  </div>
                </div>
                <div className="form-group-triple-dropdown"></div>
                <div className="form-group-triple-qr">
                  <label htmlFor="material">Generate QR Code</label>
                  <button onClick={(e) => generateQRProduct(e)}>Generate</button>
                  {!updateProduct.qr_code && <img className="form-group-triple-qr-image-2" src='https://free-qr.com/images/placeholder.svg' alt="QR Code" />}
                  {updateProduct.qr_code && <a download="qr-code.png" href={updateProduct.qr_code} alt="QR Code" title="QR-code"><img src={updateProduct.qr_code} alt="QR Code" className="form-group-triple-qr-image" /></a>}
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
                        <div>{item.location ? (<><span className="form-group-triple-upload-item-delete" onClick={(e) => deleteImage(item)}><SVGs svg={'close'} classprop={'form-group-triple-upload-item-delete-svg'}></SVGs></span><img src={item.location} onClick={() => window.open(item.location, '_blank').focus()}></img></>) : <SVGs svg={'file-image'}></SVGs>} </div>
                      </a>
                    ))}
                    </div>
                    {imageCount < 3 && 
                      <>
                      <label onClick={() => (setSelectedFiles([]), setImageCount(0), addProductImages([]))} htmlFor="files_upload" className="form-group-triple-upload-more">
                        <SVGs svg={'upload'}></SVGs> 
                        Update
                      </label>
                      <input type="file" name="files_upload" accept="image/*" id="files_upload" multiple onChange={(e) => multipleFileChangeHandler(e)}/>
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
                  <button type="submit" className="form-button" onClick={() => setError('Update form is currently being built')}>{!loading && <span>Update Product</span>}{loading && <div className="loading"><span></span><span></span><span></span></div>}</button>
                  <div className="form-error-container">
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

Product.getInitialProps = async ({query, res}) => {
  let id = query.id

  let product = null

  try {
    const responseProduct = await axios.post(`${API}/inventory/product`, {id})
    if(responseProduct.data){
      product = responseProduct.data
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
    product: product
  }
}

const mapStateToProps = state => {
  return {
    updateProduct: state.product
  }
}

const mapDispatchToProps = dispatch => {
  return {
    hideSideNav: () => dispatch({type: 'HIDE_SIDENAV'}),
    showSideNav: () => dispatch({type: 'SHOW_SIDENAV'}),
    createProduct: (type, data) => dispatch({type: 'CREATE_PRODUCT', name: type, value: data}),
    addProductImages: (data) => dispatch({type: 'ADD_PRODUCT_IMAGES', value: data})
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(withUser(Product))
