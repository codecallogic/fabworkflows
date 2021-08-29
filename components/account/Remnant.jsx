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

  const validateIsNumber = (type) => {
    const input = document.getElementById(type)
    const regex = /[^0-9|\n\r]/g
    input.value = input.value.split(regex).join('') + ' in'

    if(input.value == ' in') input.value = ''
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
        <label htmlFor="size_1">Size</label>
        <div className="form-group-double-dropdown-input units">
          <span className="units-cl-1"></span>
          <span className="units-cl-2"></span>
          <textarea id="l1" rows="1" wrap="off" onKeyDown={(e) => e.keyCode == 13 ? e.preventDefault() : null} name="l1" placeholder="L1 in" value={remnant.l1} onChange={(e) => (validateIsNumber('l1'), addRemnant('l1', e.target.value))} required></textarea>
          <textarea id="w1" rows="1" wrap="off" onKeyDown={(e) => e.keyCode == 13 ? e.preventDefault() : null} name="w1" placeholder="W1 in" value={remnant.w1} onChange={(e) => (validateIsNumber('w1'), addRemnant('w1', e.target.value))} required></textarea>
          <textarea id="l2" rows="1" wrap="off" onKeyDown={(e) => e.keyCode == 13 ? e.preventDefault() : null} name="l2" placeholder="L2 in (optional)" value={remnant.l2} onChange={(e) => (validateIsNumber('l2'), addRemnant('l2', e.target.value))} required></textarea>
        </div>
      </div>
      {/* <div className="form-group-triple-qr">
        <label htmlFor="qr_code">Generate QR Code</label>
        <button onClick={(e) => generateQRSlab(e)}>Generate</button>
        {!slab.qr_code && <img className="form-group-triple-qr-image-2" src='https://free-qr.com/images/placeholder.svg' alt="QR Code" />}
        {slab.qr_code && <a download="qr-code.png" href={slab.qr_code} alt="QR Code" title="QR-code"><img src={slab.qr_code} alt="QR Code" className="form-group-triple-qr-image" /></a>}
      </div> */}
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
          <div className="clientDashboard-view-slab_form-shapes-item-block"></div>
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
    addSupplier: (name, data) => dispatch({type: 'ADD', name: name, value: data}),
    addRemnant: (name, data) => dispatch({type: 'CREATE_REMNANT', name: name, value: data}),
    resetSupplier: () => dispatch({type: 'RESET'})
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Remnant)
