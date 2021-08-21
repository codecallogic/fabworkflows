import SVGs from '../../files/svgs'
import React, { useState, useEffect } from 'react'
import {connect} from 'react-redux'

const SlabItems = ({material, addMaterial}) => {

  const [error, setError] = useState('')
  const [modal, setModal] = useState('add_material')
  const [loading, setLoading] = useState('')
  const [input_dropdown, setInputDropdown] = useState('')
  
  return (
    <>
    <div className="clientDashboard-view-slab_form-container">
      <div className="clientDashboard-view-slab_form-heading">
        <span>Slab Fields</span>
        <div className="form-error-container">
          {error && <span className="form-error"><SVGs svg={'error'}></SVGs></span>}
        </div>
      </div>
      <form className="clientDashboard-view-slab_form">
        <div className="clientDashboard-view-form-left">
          <div className="clientDashboard-view-form-left-box">
            <div className="clientDashboard-view-form-left-box-heading">
              <span>Add Material</span>
              <span onClick={() => setModal('add_material')}><SVGs svg={'plus'}></SVGs></span>
            </div>
            <div className="clientDashboard-view-form-left-box-container">
            </div>
          </div>
        </div>
        <div className="clientDashboard-view-form-right">

        </div>
      </form>
    </div>
    { modal == 'add_material' &&
      <div className="addFieldItems-modal">
      <div className="addFieldItems-modal-box">
        <div className="addFieldItems-modal-box-header">
          <span className="addFieldItems-modal-form-title">New Material</span>
          <div onClick={() => (setLoginModal(false), clientSignUp('RESET'), setError(''), setMessage(''))}><SVGs svg={'close'}></SVGs></div>
        </div>
        <form className="addFieldItems-modal-form" onSubmit={(e) => addFieldItems(e)}>
          <div className="form-group-single-textarea">
            <div className="form-group-single-textarea-field">
              <label htmlFor="name_material">Name</label>
              <textarea id="name_material" rows="1" name="name_material" placeholder="(Material Name)" value={material.name} onChange={(e) => addMaterial('name', e.target.value)} onFocus={(e) => e.target.placeholder = ''} onBlur={(e) => e.target.placeholder = '(Material Name)'} wrap="off" onKeyDown={(e) => e.keyCode == 13 ? e.preventDefault() : null} required></textarea>
            </div>
          </div>
          <div className="form-group-single-textarea-dropdown">
            <label htmlFor="material_color">Color</label>
            <div className="form-group-single-textarea-dropdown-input">
              <textarea rows="1" wrap="off" onKeyDown={(e) => e.keyCode == 13 ? e.preventDefault() : null} name="color" placeholder="(Material Color)" value={material.color} onClick={() => (setInputDropdown('material_color'))} onChange={(e) => addMaterial('color', e.target.value)} readOnly></textarea>
              <div onClick={() => (input_dropdown !== 'material_color' ? setInputDropdown('material_color') : setInputDropdown(''))}><SVGs svg={'dropdown-arrow'}></SVGs></div>
              { input_dropdown == 'material_color' &&
              <div className="form-group-single-textarea-dropdown-input-list">
                <div className="form-group-single-textarea-dropdown-input-list-item" onClick={(e) => (addMaterial('color', e.target.innerText), setInputDropdown(''))}>Brown</div>
                <div className="form-group-single-textarea-dropdown-input-list-item" onClick={(e) => (addMaterial('color', e.target.innerText), setInputDropdown(''))}>Blue</div>
                <div className="form-group-single-textarea-dropdown-input-list-item" onClick={(e) => (addMaterial('color', e.target.innerText), setInputDropdown(''))}>Gold</div>
              </div>
              }
            </div>
          </div>
          <div className="form-group-single-textarea-dropdown">
            <label htmlFor="material_composition">Composition</label>
            <div className="form-group-single-textarea-dropdown-input">
              <textarea rows="1" wrap="off" onKeyDown={(e) => e.keyCode == 13 ? e.preventDefault() : null} name="color" placeholder="(Material Composition)" value={material.color} onClick={() => (setInputDropdown('material_composition'))} onChange={(e) => addMaterial('color', e.target.value)} readOnly></textarea>
              <div onClick={() => (input_dropdown !== 'material_composition' ? setInputDropdown('material_composition') : setInputDropdown(''))}><SVGs svg={'dropdown-arrow'}></SVGs></div>
              { input_dropdown == 'material_composition' &&
              <div className="form-group-single-textarea-dropdown-input-list">
                <div className="form-group-single-textarea-dropdown-input-list-item" onClick={(e) => (addMaterial('color', e.target.innerText), setInputDropdown(''))}>Brown</div>
                <div className="form-group-single-textarea-dropdown-input-list-item" onClick={(e) => (addMaterial('color', e.target.innerText), setInputDropdown(''))}>Blue</div>
                <div className="form-group-single-textarea-dropdown-input-list-item" onClick={(e) => (addMaterial('color', e.target.innerText), setInputDropdown(''))}>Gold</div>
              </div>
              }
            </div>
          </div>
          <button type="submit" className="form-button w100">{!loading && <span>Reset Password</span>} {loading && <div className="loading"><span></span><span></span><span></span></div>}</button>
        </form>
      </div>
    </div>
    }
    </>
  )
}

const mapStateToProps = (state) => {
  return {
    material: state.material
  }
}

const mapDispatchToProps = dispatch => {
  return {
    addMaterial: (name, data) => dispatch({type: 'ADD', name: name, value: data})
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(SlabItems)
