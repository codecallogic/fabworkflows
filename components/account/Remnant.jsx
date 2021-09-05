import {connect} from 'react-redux'
import SVGs from '../../files/svgs'
import React, { useState, useEffect, useRef } from 'react'
import QRCode from 'qrcode'
import {nanoid} from 'nanoid'
import {API} from '../../config'
import axios from 'axios'

const Remnant = ({preloadMaterials, preloadColors, addRemnant, remnant, addRemnantImages, material, addMaterial, resetMaterial}) => {
  const myRefs = useRef(null)
  
  const [input_dropdown, setInputDropdown] = useState('')
  const [modal, setModal] = useState('')
  const [error, setError] = useState('')
  const [edit, setEdit] = useState('')
  const [loading, setLoading] = useState(false)
  const [selectedFiles, setSelectedFiles] = useState([])
  const [imageCount, setImageCount] = useState(remnant.images ? remnant.images.length : 0)
  const [allMaterials, setAllMaterials] = useState(preloadMaterials ? preloadMaterials : [])
  const [allColors, setAllColors] = useState(preloadColors ? preloadColors : [])
  const [color, setColor] = useState('')

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
    console.log([...selectedFiles, ...e.target.files])
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
    addRemnantImages([...selectedFiles, ...e.target.files])
    setImageCount(imageMax)
  }

  const submitAddRemnant= async (e) => {
    e.preventDefault()
    setError('')
    if(!remnant.name){setError('Name required'); window.scrollTo(0,document.body.scrollHeight); return}
    if(!remnant.material){setError('Material required'); window.scrollTo(0,document.body.scrollHeight); return}
    if(!remnant.color){setError('Color required'); window.scrollTo(0,document.body.scrollHeight); return}
    if(!remnant.shape){setError('Shape required'); window.scrollTo(0,document.body.scrollHeight); return}
    if(!remnant.l1){setError('L1 required'); window.scrollTo(0,document.body.scrollHeight); return}
    if(!remnant.w1){setError('W1 required'); window.scrollTo(0,document.body.scrollHeight); return}
    setLoading(true)
    
    let data = new FormData()
    
    if(remnant.images.length > 0){
      remnant.images.forEach((item) => {
        let fileID = nanoid()
        data.append('file', item, `remnant-${fileID}.${item.name.split('.')[1]}`)
      })
    }

    if(remnant){
      for(const key in remnant){
        if(key !== 'images') data.append(key, remnant[key])
      }
    }

    try {
      const responseRemnant = await axios.post(`${API}/inventory/create-remnant`, data, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      setLoading(false)
      console.log(responseRemnant.data)
      window.location.href = `/remnants`
    } catch (error) {
      console.log(error)
      setLoading(false)
      if(error) error.response ? setError(error.response.data) : setError('Error adding remnant to inventory')
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
  
  return (
    <div className="clientDashboard-view-slab_form-container">
    <div className="clientDashboard-view-slab_form-heading">
      <span>New Remnant </span>
      <div className="form-error-container">
        {error && <span className="form-error"><SVGs svg={'error'}></SVGs></span>}
      </div>
    </div>
    <form className="clientDashboard-view-slab_form" onSubmit={submitAddRemnant}>
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
            <div className="form-group-double-dropdown-input-list-item border_bottom" onClick={() => (setInputDropdown(''), setModal('add_material'))}><SVGs svg={'plus'}></SVGs> Add new</div>
            {allMaterials && allMaterials.sort( (a, b) => a.name > b.name ? 1 : -1).map( (item, idx) => (
            <div key={idx} className="form-group-double-dropdown-input-list-item" onClick={(e) => (addRemnant('material', e.target.innerText), setInputDropdown(''))}>{item.name}</div>
            ))}
          </div>
          }
        </div>
      </div>
      <div className="form-group-double-dropdown">
        <label htmlFor="color">Color Name</label>
        <div className="form-group-double-dropdown-input">
          <textarea rows="1" wrap="off" onKeyDown={(e) => e.keyCode == 13 ? e.preventDefault() : null} name="color" placeholder="(Select Color)" onClick={() => setInputDropdown('remnant_color')} value={remnant.color} onChange={(e) => (setInputDropdown(''), addRemnant('color', e.target.value))}></textarea>
          <div onClick={() => (input_dropdown !== 'remnant_color' ? setInputDropdown('remnant_color') : setInputDropdown(''))}><SVGs svg={'dropdown-arrow'}></SVGs></div>
          { input_dropdown == 'remnant_color' &&
          <div className="form-group-double-dropdown-input-list" ref={myRefs}>
            <div className="form-group-double-dropdown-input-list-item border_bottom" onClick={() => (setInputDropdown(''), setModal('add_color'))}><SVGs svg={'plus'}></SVGs> Add new</div>
            {allColors && allColors.sort( (a, b) => a.name > b.name ? 1 : -1).map( (item, idx) => (
            <div key={idx} className="form-group-double-dropdown-input-list-item" onClick={(e) => (addRemnant('color', e.target.innerText), setInputDropdown(''))}>{item.name}</div>
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
      <div className="form-group-double-dropdown"></div>
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
            <a className="form-group-triple-upload-item" href={item.location} target="_blank" rel="noreferrer" key={idx}>
              <div>{item.location ? <img src={item.location}></img> : <SVGs svg={'file-image'}></SVGs>} </div>
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
        <button type="submit" className="form-button" onClick={() => setError('Please complete entire form')}>{!loading && <span>Add Remnant</span>}{loading && <div className="loading"><span></span><span></span><span></span></div>}</button>
        <div className="form-error-container">
        {error && <span className="form-error" id="error-message"><SVGs svg={'error'}></SVGs> {error}</span>}
        </div>
      </div>
    </form>
    <div className="clientDashboard-view-slab_form-shapes">
      <div className="clientDashboard-view-slab_form-shapes-container">
        <div className="clientDashboard-view-slab_form-shapes-item">
          <div className="clientDashboard-view-slab_form-shapes-item-box">
            <div className="clientDashboard-view-slab_form-shapes-item-box-title">Remnant Slab - Right L</div>
            <div className="clientDashboard-view-slab_form-shapes-item-box-container">
              <div className="clientDashboard-view-slab_form-shapes-item-box-remnant">
                <div className="clientDashboard-view-slab_form-shapes-item-box-remnant-image-right-reverse">
                  <SVGs svg={'arrow-left'} classprop={'clientDashboard-view-slab_form-shapes-item-box-remnant-image-right-reverse-svg_1'}></SVGs>
                  <SVGs svg={'arrow-right'} classprop={'clientDashboard-view-slab_form-shapes-item-box-remnant-image-right-reverse-svg_2'}></SVGs>

                  <SVGs svg={'arrow-bottom'} classprop={'clientDashboard-view-slab_form-shapes-item-box-remnant-image-right-reverse-svg_3'}></SVGs>
                  <SVGs svg={'arrow-top'} classprop={'clientDashboard-view-slab_form-shapes-item-box-remnant-image-right-reverse-svg_4'}></SVGs>

                  <div className="clientDashboard-view-slab_form-shapes-item-block-section_top remnant-right-reverse-top remnant-right-reverse-l2">
                    <SVGs svg={'arrow-left'} classprop={'remnant-right-reverse-l2-svg_1'}></SVGs>
                    <SVGs svg={'arrow-right'} classprop={'remnant-right-reverse-l2-svg_2'}></SVGs>
                  </div>
                  <div className="clientDashboard-view-slab_form-shapes-item-block-section_bottom remnant-right-reverse-bottom remnant-right-reverse-w2">
                    <SVGs svg={'arrow-top'} classprop={'remnant-right-reverse-w2-svg_1'}></SVGs>
                    <SVGs svg={'arrow-bottom'} classprop={'remnant-right-reverse-w2-svg_2'}></SVGs>
                  </div>
                </div>
                <div className="clientDashboard-view-slab_form-shapes-item-box-remnant-image-right">
                  <SVGs svg={'arrow-left'} classprop={'clientDashboard-view-slab_form-shapes-item-box-remnant-image-right-svg_1'}></SVGs>
                  <SVGs svg={'arrow-right'} classprop={'clientDashboard-view-slab_form-shapes-item-box-remnant-image-right-svg_2'}></SVGs>

                  <SVGs svg={'arrow-bottom'} classprop={'clientDashboard-view-slab_form-shapes-item-box-remnant-image-right-svg_3'}></SVGs>
                  <SVGs svg={'arrow-top'} classprop={'clientDashboard-view-slab_form-shapes-item-box-remnant-image-right-svg_4'}></SVGs>
                  <div className="clientDashboard-view-slab_form-shapes-item-block-section_top remnant-right-top remnant-right-l2">
                    <SVGs svg={'arrow-top'} classprop={'remnant-right-l2-svg_1'}></SVGs>
                    <SVGs svg={'arrow-bottom'} classprop={'remnant-right-l2-svg_2'}></SVGs>
                  </div>
                  <div className="clientDashboard-view-slab_form-shapes-item-block-section_bottom remnant-right-bottom remnant-right-w2">
                    <SVGs svg={'arrow-left'} classprop={'remnant-right-w2-svg_1'}></SVGs>
                    <SVGs svg={'arrow-right'} classprop={'remnant-right-w2-svg_2'}></SVGs>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="clientDashboard-view-slab_form-shapes-item-box">
            <div className="clientDashboard-view-slab_form-shapes-item-box-title">Remnant Slab - Left L</div>
            <div className="clientDashboard-view-slab_form-shapes-item-box-remnant-image-left-reverse">
                  <SVGs svg={'arrow-left'} classprop={'clientDashboard-view-slab_form-shapes-item-box-remnant-image-left-reverse-svg_1'}></SVGs>
                  <SVGs svg={'arrow-right'} classprop={'clientDashboard-view-slab_form-shapes-item-box-remnant-image-left-reverse-svg_2'}></SVGs>
                  <SVGs svg={'arrow-bottom'} classprop={'clientDashboard-view-slab_form-shapes-item-box-remnant-image-left-reverse-svg_3'}></SVGs>
                  <SVGs svg={'arrow-top'} classprop={'clientDashboard-view-slab_form-shapes-item-box-remnant-image-left-reverse-svg_4'}></SVGs>

                  <div className="clientDashboard-view-slab_form-shapes-item-block-section_top remnant-left-reverse-top remnant-left-reverse-l2">
                    <SVGs svg={'arrow-left'} classprop={'remnant-left-reverse-l2-svg_1'}></SVGs>
                    <SVGs svg={'arrow-right'} classprop={'remnant-left-reverse-l2-svg_2'}></SVGs>
                  </div>
                  <div className="clientDashboard-view-slab_form-shapes-item-block-section_bottom remnant-left-reverse-bottom remnant-left-reverse-w2">
                    <SVGs svg={'arrow-top'} classprop={'remnant-left-reverse-w2-svg_1'}></SVGs>
                    <SVGs svg={'arrow-bottom'} classprop={'remnant-left-reverse-w2-svg_2'}></SVGs>
                  </div>
                </div>
                <div className="clientDashboard-view-slab_form-shapes-item-box-remnant-image-left">
                  <SVGs svg={'arrow-left'} classprop={'clientDashboard-view-slab_form-shapes-item-box-remnant-image-left-svg_1'}></SVGs>
                  <SVGs svg={'arrow-right'} classprop={'clientDashboard-view-slab_form-shapes-item-box-remnant-image-left-svg_2'}></SVGs>
                  <SVGs svg={'arrow-bottom'} classprop={'clientDashboard-view-slab_form-shapes-item-box-remnant-image-left-svg_3'}></SVGs>
                  <SVGs svg={'arrow-top'} classprop={'clientDashboard-view-slab_form-shapes-item-box-remnant-image-left-svg_4'}></SVGs>
                  <div className="clientDashboard-view-slab_form-shapes-item-block-section_top remnant-left-top remnant-left-l2">
                    <SVGs svg={'arrow-top'} classprop={'remnant-left-l2-svg_1'}></SVGs>
                    <SVGs svg={'arrow-bottom'} classprop={'remnant-left-l2-svg_2'}></SVGs>
                  </div>
                  <div className="clientDashboard-view-slab_form-shapes-item-block-section_bottom remnant-left-bottom remnant-left-w2">
                    <SVGs svg={'arrow-left'} classprop={'remnant-left-w2-svg_1'}></SVGs>
                    <SVGs svg={'arrow-right'} classprop={'remnant-left-w2-svg_2'}></SVGs>
                  </div>
                </div>
          </div>
          <div className="clientDashboard-view-slab_form-shapes-item-box">
            <div className="clientDashboard-view-slab_form-shapes-item-box-container">
              <div className="clientDashboard-view-slab_form-shapes-item-box-remnant-box">
                <div className="clientDashboard-view-slab_form-shapes-item-box-title">Remnant Slab - Rectangular </div>
                <div className="clientDashboard-view-slab_form-shapes-item-box-remnant-image-box">
                  <div className="clientDashboard-view-slab_form-shapes-item-block-section_top remnant-rectangle-top">
                    <SVGs svg={'arrow-left'} classprop={'remnant-rectangle-top-svg_1'}></SVGs>
                    <SVGs svg={'arrow-right'} classprop={'remnant-rectangle-top-svg_2'}></SVGs>
                  </div>
                  <div className="clientDashboard-view-slab_form-shapes-item-block-section_bottom remnant-rectangle-bottom">
                    <SVGs svg={'arrow-top'} classprop={'remnant-rectangle-bottom-svg_1'}></SVGs>
                    <SVGs svg={'arrow-bottom'} classprop={'remnant-rectangle-bottom-svg_2'}></SVGs>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
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
  </div>
  )
}

const mapStateToProps = (state) => {
  return {
    slab: state.slab,
    remnant: state.remnant,
    material: state.material
  }
}

const mapDispatchToProps = dispatch => {
  return {
    addRemnant: (name, data) => dispatch({type: 'CREATE_REMNANT', name: name, value: data}),
    addRemnantImages: (data) => dispatch({type: 'ADD_REMNANT_IMAGES', value: data}),
    addMaterial: (name, data) => dispatch({type: 'ADD', name: name, value: data}),
    resetMaterial: () => dispatch({type: 'RESET'}),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Remnant)
