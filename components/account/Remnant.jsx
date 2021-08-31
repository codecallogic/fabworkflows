import {connect} from 'react-redux'
import SVGs from '../../files/svgs'
import React, { useState, useEffect, useRef } from 'react'

const Remnant = ({preloadMaterials, addRemnant, remnant, slab}) => {
  const myRefs = useRef(null)
  
  const [input_dropdown, setInputDropdown] = useState('')
  const [error, setError] = useState('')
  const [edit, setEdit] = useState('')
  const [loading, setLoading] = useState(false)
  const [selectedFiles, setSelectedFiles] = useState([])
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

  const submitAddRemnant = () => {

  }

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
    addProductImages([...e.target.files])
    setImageCount(imageMax)
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
        <label>L x W</label>
        <div className="form-group-double-dropdown-input units">
          <span></span>
          <textarea id="l1" rows="1" wrap="off" onKeyDown={(e) => e.keyCode == 13 ? e.preventDefault() : null} name="l1" placeholder="L in" value={remnant.l1} onChange={(e) => (validateIsNumberSize('l1'), addRemnant('l1', e.target.value))} required></textarea>
          <textarea id="w1" rows="1" wrap="off" onKeyDown={(e) => e.keyCode == 13 ? e.preventDefault() : null} name="w1" placeholder="W in" value={remnant.w1} onChange={(e) => (validateIsNumberSize('w1'), addRemnant('w1', e.target.value))} required></textarea>
        </div>
      </div>
      <div className="form-group-double-dropdown">
        <label>L2 x W2</label>
        <div className="form-group-double-dropdown-input units">
          <span></span>
          <textarea id="l2" rows="1" wrap="off" onKeyDown={(e) => e.keyCode == 13 ? e.preventDefault() : null} name="l2" placeholder="L2 in" value={remnant.l2} onChange={(e) => (validateIsNumberSize('l2'), addRemnant('l2', e.target.value))} required></textarea>
          <textarea id="w2" rows="1" wrap="off" onKeyDown={(e) => e.keyCode == 13 ? e.preventDefault() : null} name="w2" placeholder="W2 in" value={remnant.w2} onChange={(e) => (validateIsNumberSize('w2'), addRemnant('w2', e.target.value))} required></textarea>
        </div>
      </div>
      <div className="form-group-double-dropdown">
        <label htmlFor="notes">Notes</label>
        <div className="form-group-triple-input">
          <textarea id="notes" rows="5" name="notes" placeholder="(Notes)" value={remnant.notes} onChange={(e) => (addRemnant('notes', e.target.value))} required></textarea>
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
            <label onClick={() => (setSelectedFiles([]), setImageCount(0), addRemnantImages([]))} className="form-group-triple-upload-more">
              <SVGs svg={'reset'}></SVGs> 
              Reset
            </label>
            </>
          }
          </>
        }
      </div>
      {/* <div className="form-button-container">
        <button type="submit" className="form-button" onClick={() => setError('Please complete entire form')}>{!loading && <span>Add Slab</span>}{loading && <div className="loading"><span></span><span></span><span></span></div>}</button>
        <div className="form-error-container">
        {error && <span className="form-error" id="error-message"><SVGs svg={'error'}></SVGs> {error}</span>}
        </div>
      </div> */}
    </form>
    <div className="clientDashboard-view-slab_form-shapes">
      <div className="clientDashboard-view-slab_form-shapes-container">
        <div className="clientDashboard-view-slab_form-shapes-item">
          <div className="clientDashboard-view-slab_form-shapes-item-block">
            <div className="clientDashboard-view-slab_form-shapes-item-block-section_top"></div>
            <div className="clientDashboard-view-slab_form-shapes-item-block-section_bottom"></div>
          </div>
        </div>
        <div className="clientDashboard-view-slab_form-shapes-item">
          <div className="clientDashboard-view-slab_form-shapes-item-box">
            <div className="clientDashboard-view-slab_form-shapes-item-box-title">Remnant Slab - Right "L"</div>
            <div className="clientDashboard-view-slab_form-shapes-item-box-container">
              <div className="clientDashboard-view-slab_form-shapes-item-box-description">
                <div className="clientDashboard-view-slab_form-shapes-item-box-description-item">
                  <label>Material:</label>
                  <span>Quartz</span>
                </div>
                <div className="clientDashboard-view-slab_form-shapes-item-box-description-item">
                  <label>Bin #:</label>
                  <span>24</span>
                </div>
                <div className="clientDashboard-view-slab_form-shapes-item-box-description-item">
                  <label>Unique ID:</label>
                  <span>dDAakoAD1AD</span>
                </div>
                <div className="clientDashboard-view-slab_form-shapes-item-box-description-item">
                  <label>Lot #:</label>
                  <span>101</span>
                </div>
                <div className="clientDashboard-view-slab_form-shapes-item-box-description-item">
                  <label>L1 X W1</label>
                  <span>72 in x 30 in</span>
                </div>
                <div className="clientDashboard-view-slab_form-shapes-item-box-description-item">
                  <label>L2 X W2</label>
                  <span>59 X 38</span>
                </div>
              </div>
              <div className="clientDashboard-view-slab_form-shapes-item-box-remnant">
                <div className="clientDashboard-view-slab_form-shapes-item-box-remnant-image">
                  <div className="clientDashboard-view-slab_form-shapes-item-block-section_top remnant-l2"></div>
                  <div className="clientDashboard-view-slab_form-shapes-item-block-section_bottom remnant-w2"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  )
}

const mapStateToProps = (state) => {
  return {
    slab: state.slab,
    remnant: state.remnant
  }
}

const mapDispatchToProps = dispatch => {
  return {
    addRemnant: (name, data) => dispatch({type: 'CREATE_REMNANT', name: name, value: data}),
    addRemnantImages: (name, data) => dispatch({type: 'CREATE_REMNANT', name: name, value: data}),
    resetSupplier: () => dispatch({type: 'RESET'})
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Remnant)
