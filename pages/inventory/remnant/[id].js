import TopNav from '../../../components/client/dashboardTopNav'
import SideNav from '../../../components/client/dashboardSideNav'
import {connect} from 'react-redux'
import SVGs from '../../../files/svgs'
import React, { useState, useEffect, useRef } from 'react'
import QRCode from 'qrcode'
import {nanoid} from 'nanoid'
import {API} from '../../../config'
import axios from 'axios'

const Remnant = ({hideSideNav, showSideNav, preloadMaterials, addRemnant, remnant, addRemnantImages, preloadRemnant}) => {
  const myRefs = useRef(null)
  
  const [input_dropdown, setInputDropdown] = useState('')
  const [width, setWidth] = useState()
  const [error, setError] = useState('')
  const [edit, setEdit] = useState('')
  const [loading, setLoading] = useState(false)
  const [selectedFiles, setSelectedFiles] = useState(preloadRemnant.images ? preloadRemnant.images : [])
  const [imageCount, setImageCount] = useState(preloadRemnant.images ? preloadRemnant.images.length : 0)
  const [allMaterials, setAllMaterials] = useState(preloadMaterials ? preloadMaterials : [])

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
    
    for(let key in preloadRemnant){
      if(key != 'images') addRemnant(key, preloadRemnant[key])
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

  const validateIsNumberSize = (type) => {
    const input = document.getElementById(type)
    const regex = /[^0-9|\n\r]/g
    input.value = input.value.split(regex).join('') + ' in'

    if(input.value == ' in') input.value = ''
  }

  const validateIsNumber = (type) => {
    const input = document.getElementById(type)
    const regex = /[^0-9|\n\r]/g
    input.value = input.value.split(regex).join('')
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

    if(remnant.l1 && remnant.w1){
      try {

        let qrData = new Object()

        qrData.l1 = remnant.l1
        qrData.w1 = remnant.w1
        
        const image = await QRCode.toDataURL(JSON.stringify(qrData), options)
        addRemnant('qr_code', image)
        setError('')
      } catch (err) {
        console.log(err)
        if(err) setError('Error generating QR code')
      }
    }else {
      if(!remnant.l1){setError('L1 size is empty, please fill out.'); window.scrollTo(0,document.body.scrollHeight); return}
      if(!remnant.w1){setError('W1 size is empty, please fill out.'); window.scrollTo(0,document.body.scrollHeight); return}
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
    addRemnantImages([...e.target.files])
    setImageCount(imageMax)
  }

  const deleteImage = async (item) => {
    console.log(item)
    console.log(remnant)
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
        const responseRemnant = await axios.post(`${API}/inventory/delete-remnant-image`, {id: remnant._id, delete: item.key, images: selectedFiles})
        setError('')
        let response = responseRemnant.data

        console.log(response)

        for(let key in response){
          if(key != 'images') addRemnant(key, response[key])
        }
        setSelectedFiles(response.images)
        setLoading(false)
        // window.location.href = `/inventory/slab/${responseSlab.data.id}`
      } catch (error) {
        console.log(error)
        console.log(error.response)
        setLoading(false)
        if(error) error.response ? setError(error.response.data) : setError('Error deleting image from remnant')
      }
    }else{
      return setError('Click reset to change images')
    }
  }

  const submitUpdateRemnant = async (e) => {
    e.preventDefault()
    setError('')
    if(!remnant.name){setError('Name required'); window.scrollTo(0,document.body.scrollHeight); return}
    if(!remnant.material){setError('Material required'); window.scrollTo(0,document.body.scrollHeight); return}
    if(!remnant.shape){setError('Shape required'); window.scrollTo(0,document.body.scrollHeight); return}
    if(!remnant.l1){setError('L1 required'); window.scrollTo(0,document.body.scrollHeight); return}
    if(!remnant.w1){setError('W1 required'); window.scrollTo(0,document.body.scrollHeight); return}
    setLoading(true)
    
    let data = new FormData()
    let delete_images = []

    if(remnant.images.length > 0){
      if(preloadRemnant.images.length > 0){
        preloadRemnant.images.forEach((item) => {
          delete_images.push(item)
        })
      }
    }
    
    if(remnant.images.length > 0){
      remnant.images.forEach((item, idx) => {
        let fileID = nanoid()
        if(!item.key) return data.append('file', item, `remnants/remnant-${fileID}.${item.name.split('.')[1]}`)
      })
    }

    if(remnant){
      for(const key in remnant){
        if(key !== 'images') data.append(key, remnant[key])
      }
    }

    if(preloadRemnant.images.length > 0){data.append('delete_images', JSON.stringify(delete_images))}

    try {
      const responseRemnant = await axios.post(`${API}/inventory/update-remnant`, data, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      setLoading(false)
      console.log(responseRemnant)
      let id = responseRemnant.data
      window.location.href = `/inventory/remnant/${id}`
    } catch (error) {
      console.log(error)
      setLoading(false)
      if(error) error.response ? setError(error.response.data) : setError('Error updating remnant in inventory')
    }
  }
  
  return (
    <>
    <TopNav></TopNav>
    <div className="clientDashboard">
      <SideNav width={width}></SideNav>
      <div className="clientDashboard-view">
        <div className="clientDashboard-view-slab_form-container">
        <div className="clientDashboard-view-slab_form-heading">
          <span>Update Remnant </span>
          <div className="form-error-container">
            {error && <span className="form-error"><SVGs svg={'error'}></SVGs></span>}
          </div>
        </div>
        <form className="clientDashboard-view-slab_form" onSubmit={submitUpdateRemnant}>
          <div className="form-group-double-dropdown">
            <label htmlFor="name_remnant">Name</label>
            <div className="form-group-double-dropdown-input">
              <textarea id="name_remnant" rows="1" name="name_remnant" placeholder="(Remnant Name)" value={remnant.name} onChange={(e) => addRemnant('name', e.target.value)} onFocus={(e) => e.target.placeholder = ''} onBlur={(e) => e.target.placeholder = '(Remnant Name)'} wrap="off" onKeyDown={(e) => e.keyCode == 13 ? e.preventDefault() : null} readOnly={edit == 'readOnly' ? true : false} required></textarea>
            </div>
          </div>
          <div className="form-group-double-dropdown">
            <label htmlFor="material">Material</label>
            <div className="form-group-double-dropdown-input">
              <textarea rows="1" wrap="off" onKeyDown={(e) => e.keyCode == 13 ? e.preventDefault() : null} name="material" placeholder="(Select Material)" onClick={() => setInputDropdown('remnant_material')} value={remnant.material} onChange={(e) => (setInputDropdown(''), addRemnant('material', e.target.value))}></textarea>
              <div onClick={() => (input_dropdown !== 'remnant_material' ? setInputDropdown('remnant_material') : setInputDropdown(''))}><SVGs svg={'dropdown-arrow'}></SVGs></div>
              { input_dropdown == 'remnant_material' &&
              <div className="form-group-double-dropdown-input-list" ref={myRefs}>
                {/* <div className="form-group-double-dropdown-input-list-item border_bottom" onClick={() => (setInputDropdown(''), setModal('add_material'))}><SVGs svg={'plus'}></SVGs> Add new</div> */}
                {allMaterials && allMaterials.sort( (a, b) => a.name > b.name ? 1 : -1).map( (item, idx) => (
                <div key={idx} className="form-group-double-dropdown-input-list-item" onClick={(e) => (addRemnant('material', e.target.innerText), setInputDropdown(''))}>{item.name}</div>
                ))}
              </div>
              }
            </div>
          </div>
          <div className="form-group-double-dropdown">
            <label htmlFor="lot">Lot / Block</label>
            <div className="form-group-double-dropdown-input">
              <textarea id="lot" rows="1" name="lot" placeholder="(Lot/Block)" value={remnant.lot} onChange={(e) => (validateIsNumber('lot'), addRemnant('lot', e.target.value))} onFocus={(e) => e.target.placeholder = ''} onBlur={(e) => e.target.placeholder = '(Lot / Block)'} wrap="off" onKeyDown={(e) => e.keyCode == 13 ? e.preventDefault() : null} readOnly={edit == 'readOnly' ? true : false} required></textarea>
            </div>
          </div>
          <div className="form-group-double-dropdown">
            <label htmlFor="bundle">Bundle</label>
            <div className="form-group-double-dropdown-input">
              <textarea id="bundle" rows="1" name="bundle" placeholder="(Bundle)" value={remnant.bundle} onChange={(e) => (addRemnant('bundle', e.target.value))} onFocus={(e) => e.target.placeholder = ''} onBlur={(e) => e.target.placeholder = '(Bundle)'} wrap="off" onKeyDown={(e) => e.keyCode == 13 ? e.preventDefault() : null} readOnly={edit == 'readOnly' ? true : false} required></textarea>
            </div>
          </div>
          <div className="form-group-double-dropdown">
            <label htmlFor="supplier_ref">Supplier Ref</label>
            <div className="form-group-double-dropdown-input">
              <textarea id="supplier_ref" rows="1" name="supplier_ref" placeholder="(Supplier Ref)" value={remnant.supplier_ref} onChange={(e) => (addRemnant('supplier_ref', e.target.value))} onFocus={(e) => e.target.placeholder = ''} onBlur={(e) => e.target.placeholder = '(Supplier Ref)'} wrap="off" onKeyDown={(e) => e.keyCode == 13 ? e.preventDefault() : null} readOnly={edit == 'readOnly' ? true : false} required></textarea>
            </div>
          </div>
          <div className="form-group-double-dropdown">
            <label htmlFor="bin">Bin #</label>
            <div className="form-group-double-dropdown-input">
              <textarea id="bin" rows="1" name="bin" placeholder="(Bin)" value={remnant.bin} onChange={(e) => (validateIsNumber('bin'), addRemnant('bin', e.target.value))} onFocus={(e) => e.target.placeholder = ''} onBlur={(e) => e.target.placeholder = '(Bin)'} wrap="off" onKeyDown={(e) => e.keyCode == 13 ? e.preventDefault() : null} readOnly={edit == 'readOnly' ? true : false} required></textarea>
            </div>
          </div>
          <div className="form-group-double-dropdown">
            <label htmlFor="shape">Shape</label>
            <div className="form-group-double-dropdown-input">
              <textarea rows="1" wrap="off" onKeyDown={(e) => e.keyCode == 13 ? e.preventDefault() : null} name="shape" placeholder="(Select Shape)" onClick={() => setInputDropdown('remnant_shape')} value={remnant.shape} onChange={(e) => (setInputDropdown(''), addRemnant('shape', e.target.value))}></textarea>
              <div onClick={() => (input_dropdown !== 'slab_color' ? setInputDropdown('remnant_shape') : setInputDropdown(''))}><SVGs svg={'dropdown-arrow'}></SVGs></div>
              { input_dropdown == 'remnant_shape' &&
              <div className="form-group-double-dropdown-input-list" ref={myRefs}>
                <div className="form-group-double-dropdown-input-list-item" onClick={(e) => (addRemnant('shape', e.target.innerText), setInputDropdown(''))}>Remnant L Right</div>
                <div className="form-group-double-dropdown-input-list-item" onClick={(e) => (addRemnant('shape', e.target.innerText), setInputDropdown(''))}>Remnant L Left</div>
                <div className="form-group-double-dropdown-input-list-item" onClick={(e) => (addRemnant('shape', e.target.innerText), setInputDropdown(''))}>Remnant Rectangular</div>
              </div>
              }
            </div>
          </div>
          <div className="form-group-double-dropdown">
            <label>A x B</label>
            <div className="form-group-double-dropdown-input units">
              <span></span>
              <textarea id="l1" rows="1" wrap="off" onKeyDown={(e) => e.keyCode == 13 ? e.preventDefault() : null} name="l1" placeholder="A in" value={remnant.l1} onChange={(e) => (validateIsNumberSize('l1'), addRemnant('l1', e.target.value))} required></textarea>
              <textarea id="w1" rows="1" wrap="off" onKeyDown={(e) => e.keyCode == 13 ? e.preventDefault() : null} name="w1" placeholder="B in" value={remnant.w1} onChange={(e) => (validateIsNumberSize('w1'), addRemnant('w1', e.target.value))} required></textarea>
            </div>
          </div>
          <div className="form-group-double-dropdown">
            <label>C x D</label>
            <div className="form-group-double-dropdown-input units">
              <span></span>
              <textarea id="l2" rows="1" wrap="off" onKeyDown={(e) => e.keyCode == 13 ? e.preventDefault() : null} name="l2" placeholder="C in" value={remnant.l2} onChange={(e) => (validateIsNumberSize('l2'), addRemnant('l2', e.target.value))} required></textarea>
              <textarea id="w2" rows="1" wrap="off" onKeyDown={(e) => e.keyCode == 13 ? e.preventDefault() : null} name="w2" placeholder="D in" value={remnant.w2} onChange={(e) => (validateIsNumberSize('w2'), addRemnant('w2', e.target.value))} required></textarea>
            </div>
          </div>
          <div className="form-group-double-dropdown">
            <label htmlFor="notes">Notes</label>
            <div className="form-group-triple-input">
              <textarea id="notes" rows="5" name="notes" placeholder="(Notes)" value={remnant.notes} onChange={(e) => (addRemnant('notes', e.target.value))}></textarea>
            </div>
          </div>
          <div className="form-group-triple-qr">
            <label htmlFor="qr_code">Generate QR Code</label>
            <button onClick={(e) => generateQR(e)}>Generate</button>
            {!remnant.qr_code && <img className="form-group-triple-qr-image-2" src='https://free-qr.com/images/placeholder.svg' alt="QR Code" />}
            {remnant.qr_code && <a download="qr-code.png" href={remnant.qr_code} alt="QR Code" title="QR-code"><img src={remnant.qr_code} alt="QR Code" className="form-group-triple-qr-image" /></a>}
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
                <label onClick={() => (setSelectedFiles([]), setImageCount(0), addRemnantImages([]))} htmlFor="files_upload" className="form-group-triple-upload-more">
                  <SVGs svg={'upload'}></SVGs> 
                  Update
                </label>
                <input type="file" name="files_upload" accept="image/*" id="files_upload" multiple onChange={(e) => multipleFileChangeHandler(e)}/>
                </>
              }
              {imageCount == 3 && 
                <>
                <label onClick={() => (setSelectedFiles([]), setImageCount(0), addRemnantImages([]))} className="form-group-triple-upload-more">
                  <SVGs svg={'reset'}></SVGs> 
                  Reset
                </label>
                </>
              }
              </>
            }
          </div>
          <div className="form-button-container">
            <button type="submit" className="form-button" onClick={() => setError('Please complete entire form')}>{!loading && <span>Update Remnant</span>}{loading && <div className="loading"><span></span><span></span><span></span></div>}</button>
            <div className="form-error-container">
            {error && <span className="form-error" id="error-message"><SVGs svg={'error'}></SVGs> {error}</span>}
            </div>
          </div>
        </form>
        <div className="clientDashboard-view-slab_form-shapes">
          <div className="clientDashboard-view-slab_form-shapes-container">
            <div className="clientDashboard-view-slab_form-shapes-item">
              <div className="clientDashboard-view-slab_form-shapes-item-box">
                <div className="clientDashboard-view-slab_form-shapes-item-box-title">Remnant Slab - Right "R"</div>
                <div className="clientDashboard-view-slab_form-shapes-item-box-container">
                  <div className="clientDashboard-view-slab_form-shapes-item-box-remnant">
                    <div className="clientDashboard-view-slab_form-shapes-item-box-remnant-image-right">
                      <div className="clientDashboard-view-slab_form-shapes-item-block-section_top remnant-right-top remnant-right-l2"></div>
                      <div className="clientDashboard-view-slab_form-shapes-item-block-section_bottom remnant-right-bottom remnant-right-w2"></div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="clientDashboard-view-slab_form-shapes-item-box">
                <div className="clientDashboard-view-slab_form-shapes-item-box-title">Remnant Slab - Left "L"</div>
                <div className="clientDashboard-view-slab_form-shapes-item-box-container">
                  <div className="clientDashboard-view-slab_form-shapes-item-box-remnant">
                    <div className="clientDashboard-view-slab_form-shapes-item-box-remnant-image-left">
                      <div className="clientDashboard-view-slab_form-shapes-item-block-section_top remnant-left-top remnant-left-l2"></div>
                      <div className="clientDashboard-view-slab_form-shapes-item-block-section_bottom remnant-left-bottom remnant-left-w2"></div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="clientDashboard-view-slab_form-shapes-item-box">
                <div className="clientDashboard-view-slab_form-shapes-item-box-container">
                  <div className="clientDashboard-view-slab_form-shapes-item-box-remnant">
                    <div className="clientDashboard-view-slab_form-shapes-item-box-title">Remnant Block</div>
                    <div className="clientDashboard-view-slab_form-shapes-item-box-remnant-image-left">
                      <div className="clientDashboard-view-slab_form-shapes-item-block-section_top remnant-rectangle-top"></div>
                      <div className="clientDashboard-view-slab_form-shapes-item-block-section_bottom remnant-rectangle-bottom"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  </>
  )
}

const mapStateToProps = (state) => {
  return {
    remnant: state.remnant
  }
}

const mapDispatchToProps = dispatch => {
  return {
    hideSideNav: () => dispatch({type: 'HIDE_SIDENAV'}),
    showSideNav: () => dispatch({type: 'SHOW_SIDENAV'}),
    addRemnant: (name, data) => dispatch({type: 'CREATE_REMNANT', name: name, value: data}),
    addRemnantImages: (data) => dispatch({type: 'ADD_REMNANT_IMAGES', value: data}),
  }
}

Remnant.getInitialProps = async ({query, res}) => {
  let id = query.id

  let remnant = null

  try {
    const responseRemnant = await axios.post(`${API}/inventory/remnant`, {id})
    if(responseRemnant.data){
      remnant = responseRemnant.data
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
    preloadRemnant: remnant
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Remnant)
