import SVGs from '../../files/svgs'
import React, { useState, useEffect } from 'react'
import {connect} from 'react-redux'
import {API} from '../../config'
import axios from 'axios'

const SlabItems = ({material, addMaterial, resetMaterial, preloadMaterials, preloadColors, preloadSuppliers, preloadLocations, addSupplier, supplier}) => {
  const [error, setError] = useState('')
  const [modal, setModal] = useState('')
  const [edit, setEdit] = useState('')
  const [loading, setLoading] = useState('')
  const [input_dropdown, setInputDropdown] = useState('')
  const [allMaterials, setAllMaterials] = useState(preloadMaterials ? preloadMaterials : [])
  const [allColors, setAllColors] = useState(preloadColors ? preloadColors : [])
  const [allSuppliers, setAllSuppliers] = useState(preloadSuppliers ? preloadSuppliers : [])
  const [allLocations, setAllLocations] = useState(preloadLocations ? preloadLocations : [])
  const [color, setColor] = useState('')
  const [colorID, setColorID] = useState('')
  const [location, setLocation] = useState('')
  const [locationID, setLocationID] = useState('')
  const [filter, setFilter] = useState('')
  const [filterType, setFilterType] = useState('')
  const [asc, setAsc] = useState(-1)
  const [desc, setDesc] = useState(1)

  const onPointerDown = () => {}
  const onPointerUp = () => {}
  const onPointerMove = () => {}
  const [isDragging, setIsDragging] = useState(false)

  const [translate, setTranslate] = useState({
    x: 0,
    y: 0
  });

  const handlePointerDown = (e) => {
    setIsDragging(true)
    onPointerDown(e)
  }

  const handlePointerUp = (e) => {
    setIsDragging(false)
    onPointerUp(e)
  }

  const handlePointerMove = (e) => {
    if (isDragging) handleDragMove(e);

    onPointerMove(e);
  };

  const handleDragMove = (e) => {
    setTranslate({
      x: translate.x + e.movementX,
      y: translate.y + e.movementY
    });
  };

  
  // console.log(allMaterials)
  const validateIsNumber = (type) => {
    const input = document.getElementById(type)
    const regex = /[^0-9|\n\r]/g
    input.value = input.value.split(regex).join('')
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

  const editMaterial = (item) => {
    setModal('add_material')
    setEdit('material')
    for(const key in item){
      addMaterial(key, item[key])
    }
  }


  const deleteMaterial = async (id) => {
    try {
      const responseDelete = await axios.post(`${API}/inventory/delete-material`, {id: id})
      // console.log(responseDelete)
      setAllMaterials(responseDelete.data)
    } catch (error) {
      console.log(error)
      if(error) error.response ? setError(error.response.data) : setError('Error deleting from inventory')
    }
  }

  const updateMaterial = async (e) => {
    e.preventDefault()
    try {
      const responseUpdate = await axios.post(`${API}/inventory/update-material`, material)
      // console.log(responseUpdate)
      setModal('')
      setError('')
      setEdit('')
      setAllMaterials(responseUpdate.data)
    } catch (error) {
      console.log(error)
      if(error) error.response ? setError(error.response.data) : setError('Error deleting from inventory')
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

  const editColor = (item) => {
    // console.log(item)
    setModal('add_color')
    setEdit('color')
    setColor(item.name)
    setColorID(item._id)
  }

  const updateColor = async (e) => {
    e.preventDefault()
    try {
      const responseUpdate = await axios.post(`${API}/inventory/update-color`, {id: colorID, name: color})
      // console.log(responseUpdate)
      setModal('')
      setError('')
      setEdit('')
      setAllColors(responseUpdate.data)
    } catch (error) {
      console.log(error)
      if(error) error.response ? setError(error.response.data) : setError('Error deleting from inventory')
    }
  }


  const deleteColor = async (id) => {
    try {
      const responseDelete = await axios.post(`${API}/inventory/delete-color`, {id: id})
      // console.log(responseDelete)
      setAllColors(responseDelete.data)
    } catch (error) {
      console.log(error)
      if(error) error.response ? setError(error.response.data) : setError('Error deleting from inventory')
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

  const editSupplier = (item) => {
    setModal('add_supplier')
    setEdit('supplier')
    for(const key in item){
      addSupplier(key, item[key])
    }
  }


  const deleteSupplier = async (id) => {
    try {
      const responseDelete = await axios.post(`${API}/inventory/delete-supplier`, {id: id})
      // console.log(responseDelete)
      setAllSuppliers(responseDelete.data)
    } catch (error) {
      console.log(error)
      if(error) error.response ? setError(error.response.data) : setError('Error deleting from inventory')
    }
  }

  const updateSupplier = async (e) => {
    e.preventDefault()
    try {
      const responseUpdate = await axios.post(`${API}/inventory/update-supplier`, supplier)
      // console.log(responseUpdate)
      setModal('')
      setError('')
      setEdit('')
      setAllSuppliers(responseUpdate.data)
    } catch (error) {
      console.log(error)
      if(error) error.response ? setError(error.response.data) : setError('Error deleting from inventory')
    }
  }

  const submitAddLocation = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const responseColor = await axios.post(`${API}/inventory/add-location`, {name: location})
      setLocation('')
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

  const editLocation = (item) => {
    setModal('add_location')
    setEdit('location')
    setLocation(item.name)
    setLocationID(item._id)
  }

  const deleteLocation = async (id) => {
    try {
      const responseDelete = await axios.post(`${API}/inventory/delete-location`, {id: id})
      // console.log(responseDelete)
      setAllLocations(responseDelete.data)
    } catch (error) {
      console.log(error)
      if(error) error.response ? setError(error.response.data) : setError('Error deleting from inventory')
    }
  }

  const updateLocation = async (e) => {
    e.preventDefault()
    try {
      const responseUpdate = await axios.post(`${API}/inventory/update-location`, {id: locationID, name: location})
      // console.log(responseUpdate)
      setLocation('')
      setModal('')
      setError('')
      setEdit('')
      setAllLocations(responseUpdate.data)
    } catch (error) {
      console.log(error)
      if(error) error.response ? setError(error.response.data) : setError('Error deleting from inventory')
    }
  }

  const readOnly = (modal, type, item) => {
    setModal(modal)
    setEdit(type)
    for(const key in item){
      addSupplier(key, item[key])
    }
  }
  
  return (
    <>
    <div className="clientDashboard-view-slab_form-container">
      <div className="clientDashboard-view-slab_form-heading">
        <span>Slab Fields</span>
        <div className="form-error-container">
          {error && <span className="form-error"><SVGs svg={'error'}></SVGs>{error}</span>}
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
              <div className="clientDashboard-view-form-left-box-container-item">
                  <div className="clientDashboard-view-form-left-box-container-item-info-headers double-column">
                    <span onClick={(e) => filter == 'name' && filterType == 'material' ? (setAsc(asc == 1 ? -1 : 1 ), setDesc(desc == -1 ? 1 : -1)) : (setFilter('name'), setFilterType('material'))}>Name <SVGs svg={'sort'}></SVGs></span>

                    <span onClick={(e) => filter == 'description' && filterType == 'material' ? (setAsc(asc == 1 ? -1 : 1 ), setDesc(desc == -1 ? 1 : -1)) : (setFilter('description'), setFilterType('material'))}>Description <SVGs svg={'sort'}></SVGs></span>
                  </div>
              </div>
              {allMaterials && allMaterials.sort( (a, b) => filterType == 'material' ? a[filter] > b[filter] ? asc : desc : null).map( (item, idx) => (
                <div key={idx} className="clientDashboard-view-form-left-box-container-item">
                  <div className="clientDashboard-view-form-left-box-container-item-info double-column">
                    <span>{item.name}</span>
                    <span>{item.description.substring(0, 200)}</span>
                    <a onClick={() => readOnly('add_material', 'readOnly', item)}>more info</a>
                  </div>
                  <div className="clientDashboard-view-form-left-box-container-item-controls">
                  <span onClick={() => editMaterial(item)}><SVGs svg={'edit'}></SVGs></span>
                  <span onClick={() => deleteMaterial(item._id)}><SVGs svg={'delete'}></SVGs></span>
                  </div>
                </div>
              ))}              
            </div>
          </div>
          <div className="clientDashboard-view-form-left-box">
            <div className="clientDashboard-view-form-left-box-heading">
              <span>Add Supplier</span>
              <span onClick={() => setModal('add_supplier')}><SVGs svg={'plus'}></SVGs></span>
            </div>
            <div className="clientDashboard-view-form-left-box-container">
              <div className="clientDashboard-view-form-left-box-container-item">
                <div className="clientDashboard-view-form-left-box-container-item-info-headers">
                  <span onClick={(e) => filter == 'name' && filterType == 'supplier' ? (setAsc(asc == 1 ? -1 : 1 ), setDesc(desc == -1 ? 1 : -1)) : (setFilter('name'), setFilterType('supplier'))}>Name <SVGs svg={'sort'}></SVGs></span>
                  <span onClick={(e) => filter == 'phone' && filterType == 'supplier' ? (setAsc(asc == 1 ? -1 : 1 ), setDesc(desc == -1 ? 1 : -1)) : (setFilter('phone'), setFilterType('supplier'))}>Phone <SVGs svg={'sort'}></SVGs></span>
                  <span onClick={(e) => filter == 'address' && filterType == 'supplier' ? (setAsc(asc == 1 ? -1 : 1 ), setDesc(desc == -1 ? 1 : -1)) : (setFilter('address'), setFilterType('supplier'))}>Address <SVGs svg={'sort'}></SVGs></span>
                </div>
              </div>
              {allSuppliers && allSuppliers.sort( (a, b) => filterType == 'supplier' ? a[filter] > b[filter] ? asc : desc : null).map( (item, idx) => (
              <div key={idx} className="clientDashboard-view-form-left-box-container-item">
                <div className="clientDashboard-view-form-left-box-container-item-info">
                  <span>{item.name}</span>
                  <span>{item.phone}</span>
                  <span>{item.address}</span>
                  <a onClick={() => readOnly('add_supplier', 'readOnly', item)}>more info</a>
                </div>
                <div className="clientDashboard-view-form-left-box-container-item-controls">
                  <span onClick={() => editSupplier(item)}><SVGs svg={'edit'}></SVGs></span>
                  <span onClick={() => deleteSupplier(item._id)}><SVGs svg={'delete'}></SVGs></span>
                </div>
              </div>
              ))}              
            </div>
          </div>
        </div>
        <div className="clientDashboard-view-form-right">
          <div className="clientDashboard-view-form-left-box">
            <div className="clientDashboard-view-form-left-box-heading">
              <span>Add Color</span>
              <span onClick={() => setModal('add_color')}><SVGs svg={'plus'}></SVGs></span>
            </div>
            <div className="clientDashboard-view-form-left-box-container">
              <div className="clientDashboard-view-form-left-box-container-item">
                  <div className="clientDashboard-view-form-left-box-container-item-info-headers">
                    <span>Color Name</span>
                  </div>
              </div>
              {allColors && allColors.sort( (a, b) => a.name > b.name ? 1 : -1).map( (item, idx) => (
                <div key={idx} className="clientDashboard-view-form-left-box-container-item">
                  <div className="clientDashboard-view-form-left-box-container-item-info">
                    <span className="single-column">{item.name}</span>
                  </div>
                  <div className="clientDashboard-view-form-left-box-container-item-controls">
                  <span onClick={() => editColor(item)}><SVGs svg={'edit'}></SVGs></span>
                  <span onClick={() => deleteColor(item._id)}><SVGs svg={'delete'}></SVGs></span>
                  </div>
                </div>
              ))}              
            </div>
          </div>
          <div className="clientDashboard-view-form-left-box">
            <div className="clientDashboard-view-form-left-box-heading">
              <span>Add Location</span>
              <span onClick={() => setModal('add_location')}><SVGs svg={'plus'}></SVGs></span>
            </div>
            <div className="clientDashboard-view-form-left-box-container">
              <div className="clientDashboard-view-form-left-box-container-item">
                  <div className="clientDashboard-view-form-left-box-container-item-info-headers">
                    <span>Location</span>
                  </div>
              </div>
              {allLocations && allLocations.sort( (a, b) => a.name > b.name ? 1 : -1).map( (item, idx) => (
                <div key={idx} className="clientDashboard-view-form-left-box-container-item">
                  <div className="clientDashboard-view-form-left-box-container-item-info">
                    <span className="single-column">{item.name}</span>
                  </div>
                  <div className="clientDashboard-view-form-left-box-container-item-controls">
                  <span onClick={() => editLocation(item)}><SVGs svg={'edit'}></SVGs></span>
                  <span onClick={() => deleteLocation(item._id)}><SVGs svg={'delete'}></SVGs></span>
                  </div>
                </div>
              ))}              
            </div>
          </div>
        </div>
      </form>
    </div>
    { modal == 'add_material' &&
      <div className="addFieldItems-modal" data-value="parent" onClick={(e) => e.target.getAttribute('data-value') == 'parent' ? setIsDragging(false) : null}>
      <div className="addFieldItems-modal-box" onPointerDown={handlePointerDown} onPointerUp={handlePointerUp} onPointerMove={handlePointerMove} style={{transform: `translateX(${translate.x}px) translateY(${translate.y}px)`}}>
        <div className="addFieldItems-modal-box-header">
          <span className="addFieldItems-modal-form-title">{edit ? 'Edit Material' : 'New Material'}</span>
          <div onClick={() => (setModal(''), resetMaterial(), setError(''))}><SVGs svg={'close'}></SVGs></div>
        </div>
        <div className="addFieldItems-modal-form-container">
        <form className="addFieldItems-modal-form" onSubmit={(e) => submitAddMaterial(e)}>
          <div className="form-group-single-textarea">
            <div className="form-group-single-textarea-field">
              <label htmlFor="name_material">Name</label>
              <textarea id="name_material" rows="1" name="name_material" placeholder="(Material Name)" value={material.name} onChange={(e) => addMaterial('name', e.target.value)} onFocus={(e) => e.target.placeholder = ''} onBlur={(e) => e.target.placeholder = '(Material Name)'} wrap="off" onKeyDown={(e) => e.keyCode == 13 ? e.preventDefault() : null} readOnly={edit == 'readOnly' ? true : false} autoFocus={true} required></textarea>
            </div>
          </div>
          <div className="form-group-single-textarea">
            <label htmlFor="material_description">Description</label>
            <div className="form-group-single-textarea-field double-column">
              <textarea rows="5" wrap="wrap" name="description" placeholder="(Material Description)" value={material.description} onChange={(e) => addMaterial('description', e.target.value)} readOnly={edit == 'readOnly' ? true : false}></textarea>
            </div>
          </div>
        </form>
        </div>
        {!edit && <button type="submit" className="form-button w100">{!loading && <span>Add Material</span>} {loading && <div className="loading"><span></span><span></span><span></span></div>}</button>}
        {edit == 'material' && <button onClick={(e) => updateMaterial(e)} className="form-button w100">{!loading && <span>Update Material</span>} {loading && <div className="loading"><span></span><span></span><span></span></div>}</button>}
        {error && <span className="form-error"><SVGs svg={'error'}></SVGs>{error}</span>}
      </div>
    </div>
    }
    { modal == 'add_color' &&
      <div className="addFieldItems-modal" data-value="parent" onClick={(e) => e.target.getAttribute('data-value') == 'parent' ? setIsDragging(false) : null}>
      <div className="addFieldItems-modal-box" onPointerDown={handlePointerDown} onPointerUp={handlePointerUp} onPointerMove={handlePointerMove} style={{transform: `translateX(${translate.x}px) translateY(${translate.y}px)`}}>
        <div className="addFieldItems-modal-box-header">
          <span className="addFieldItems-modal-form-title">{edit ? 'Edit Color' : 'New Color'}</span>
          <div onClick={() => (setModal(''), setError(''), setEdit(''))}><SVGs svg={'close'}></SVGs></div>
        </div>
        <div className="addFieldItems-modal-form-container">
        <form className="addFieldItems-modal-form" onSubmit={(e) => submitAddColor(e)}>
          <div className="form-group-single-textarea">
            <div className="form-group-single-textarea-field">
              <label htmlFor="name_color">Name</label>
              <textarea id="name_color" rows="1" name="name_color" placeholder="(Color Name)" value={color} onChange={(e) => setColor(e.target.value)} onFocus={(e) => e.target.placeholder = ''} onBlur={(e) => e.target.placeholder = '(Color Name)'} wrap="off" onKeyDown={(e) => e.keyCode == 13 ? e.preventDefault() : null} autoFocus={true} required></textarea>
            </div>
          </div>
        </form>
        </div>
        {!edit && <button type="submit" className="form-button w100">{!loading && <span>Add Color</span>} {loading && <div className="loading"><span></span><span></span><span></span></div>}</button>}
        {edit == 'color' && <button onClick={(e) => updateColor(e)} className="form-button w100">{!loading && <span>Update Color</span>} {loading && <div className="loading"><span></span><span></span><span></span></div>}</button>}
        {error && <span className="form-error"><SVGs svg={'error'}></SVGs>{error}</span>}
      </div>
    </div>
    }
    { modal == 'add_supplier' &&
      <div className="addFieldItems-modal" data-value="parent" onClick={(e) => e.target.getAttribute('data-value') == 'parent' ? setIsDragging(false) : null}>
      <div className="addFieldItems-modal-box" onPointerDown={handlePointerDown} onPointerUp={handlePointerUp} onPointerMove={handlePointerMove} style={{transform: `translateX(${translate.x}px) translateY(${translate.y}px)`}}>
        <div className="addFieldItems-modal-box-header">
          <span className="addFieldItems-modal-form-title">{edit ? edit == 'readOnly' ? 'Supplier' : 'Edit Supplier' : 'New Supplier'}</span>
          <div onClick={() => (setModal(''), setError(''), setEdit(''))}><SVGs svg={'close'}></SVGs></div>
        </div>
        <div className="addFieldItems-modal-form-container">
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
              <textarea id="supplier_address" rows="3" name="supplier_address" placeholder="(Supplier Address)" value={supplier.address} onChange={(e) => addSupplier('address', e.target.value)} onFocus={(e) => e.target.placeholder = ''} onBlur={(e) => e.target.placeholder = '(Supplier Address)'} wrap="off" onKeyDown={(e) => e.keyCode == 13 ? e.preventDefault() : null} readOnly={edit == 'readOnly' ? true : false} required></textarea>
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
              <textarea id="supplier_note" rows="5" name="supplier_note" placeholder="(Note)" value={supplier.note} onChange={(e) => addSupplier('note', e.target.value)} onFocus={(e) => e.target.placeholder = ''} onBlur={(e) => e.target.placeholder = '(Note)'} readOnly={edit == 'readOnly' ? true : false}></textarea>
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
              <textarea id="supplier_bank_note" rows="5" name="supplier_bank_note" placeholder="(Bank Note)" value={supplier.bank_note} onChange={(e) => addSupplier('bank_note', e.target.value)} onFocus={(e) => e.target.placeholder = ''} onBlur={(e) => e.target.placeholder = '(Bank Note)'} readOnly={edit == 'readOnly' ? true : false}></textarea>
            </div>
          </div>
        </form>
        </div>
        {!edit && <button type="submit" className="form-button w100">{!loading && <span>Add Supplier</span>} {loading && <div className="loading"><span></span><span></span><span></span></div>}</button>}
        {edit == 'supplier' && <button onClick={(e) => updateSupplier(e)} className="form-button w100">{!loading && <span>Update Supplier</span>} {loading && <div className="loading"><span></span><span></span><span></span></div>}</button>}
        {error && <span className="form-error"><SVGs svg={'error'}></SVGs>{error}</span>}
      </div>
    </div>
    }
    { modal == 'add_location' &&
      <div className="addFieldItems-modal" data-value="parent" onClick={(e) => e.target.getAttribute('data-value') == 'parent' ? setIsDragging(false) : null}>
      <div className="addFieldItems-modal-box" onPointerDown={handlePointerDown} onPointerUp={handlePointerUp} onPointerMove={handlePointerMove} style={{transform: `translateX(${translate.x}px) translateY(${translate.y}px)`}}>
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
    </>
  )
}

const mapStateToProps = (state) => {
  return {
    material: state.material,
    supplier: state.supplier
  }
}

const mapDispatchToProps = dispatch => {
  return {
    addMaterial: (name, data) => dispatch({type: 'ADD', name: name, value: data}),
    resetMaterial: () => dispatch({type: 'RESET'}),
    addSupplier: (name, data) => dispatch({type: 'ADD', name: name, value: data}),
    resetSupplier: () => dispatch({type: 'RESET'})
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(SlabItems)
