import SVGs from '../../files/svgs'
import React, { useState, useEffect } from 'react'
import {connect} from 'react-redux'
import {API} from '../../config'
import axios from 'axios'

const ProductItems = ({preloadBrands, preloadModels, preloadCategories, preloadLocations}) => {
  const [error, setError] = useState('')
  const [modal, setModal] = useState('')
  const [edit, setEdit] = useState('')
  const [loading, setLoading] = useState('')
  const [allBrands, setAllBrands] = useState(preloadBrands ? preloadBrands : [])
  const [brand, setBrand] = useState('')
  const [brandID, setBrandID] = useState('')
  const [allModels, setAllModels] = useState(preloadModels ? preloadModels : [])
  const [model, setModel] = useState('')
  const [modelID, setModelID] = useState('')
  const [allCategories, setAllCategories] = useState(preloadCategories ? preloadCategories : [])
  const [category, setCategory] = useState('')
  const [categoryID, setCategoryID] = useState('')
  const [allLocations, setAllLocations] = useState(preloadLocations ? preloadLocations : [])
  const [location, setLocation] = useState('')
  const [locationID, setLocationID] = useState('')
  const [filter, setFilter] = useState('')
  const [filterType, setFilterType] = useState('')
  const [asc, setAsc] = useState(-1)
  const [desc, setDesc] = useState(1)
  
  // console.log(allMaterials)
  const validateIsNumber = (type) => {
    const input = document.getElementById(type)
    const regex = /[^0-9|\n\r]/g
    input.value = input.value.split(regex).join('')
  }

  const submitAddBrand = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const responseBrand = await axios.post(`${API}/inventory/add-brand`, {name: brand})
      setBrand('')
      setModal('')
      setLoading(false)
      setError('')
      setAllBrands(responseBrand.data)
    } catch (error) {
      console.log(error.response)
      setLoading(false)
      if(error) error.response ? setError(error.response.data) : setError('Error adding brand to inventory')
    }
  }

  const editBrand = (item) => {
    // console.log(item)
    setModal('add_brand')
    setEdit('brand')
    setBrand(item.name)
    setBrandID(item._id)
  }

  const updateBrand = async (e) => {
    e.preventDefault()
    try {
      const responseUpdate = await axios.post(`${API}/inventory/update-brand`, {id: brandID, name: brand})
      // console.log(responseUpdate)
      setModal('')
      setError('')
      setEdit('')
      setAllBrands(responseUpdate.data)
    } catch (error) {
      console.log(error)
      if(error) error.response ? setError(error.response.data) : setError('Error deleting from inventory')
    }
  }

  const deleteBrand = async (id) => {
    try {
      const responseDelete = await axios.post(`${API}/inventory/delete-brand`, {id: id})
      // console.log(responseDelete)
      setAllBrands(responseDelete.data)
    } catch (error) {
      console.log(error)
      if(error) error.response ? setError(error.response.data) : setError('Error deleting from inventory')
    }
  }

  const submitAddModel = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const responseModel = await axios.post(`${API}/inventory/add-model`, {name: model})
      setModel('')
      setModal('')
      setLoading(false)
      setError('')
      setAllModels(responseModel.data)
    } catch (error) {
      console.log(error.response)
      setLoading(false)
      if(error) error.response ? setError(error.response.data) : setError('Error adding model to inventory')
    }
  }

  const editModel = (item) => {
    // console.log(item)
    setModal('add_model')
    setEdit('model')
    setModel(item.name)
    setModelID(item._id)
  }

  const updateModel = async (e) => {
    e.preventDefault()
    try {
      const responseUpdate = await axios.post(`${API}/inventory/update-model`, {id: modelID, name: model})
      // console.log(responseUpdate)
      setModel('')
      setModal('')
      setError('')
      setEdit('')
      setAllModels(responseUpdate.data)
    } catch (error) {
      console.log(error)
      if(error) error.response ? setError(error.response.data) : setError('Error deleting from inventory')
    }
  }

  const deleteModel = async (id) => {
    try {
      const responseDelete = await axios.post(`${API}/inventory/delete-model`, {id: id})
      // console.log(responseDelete)
      setAllModels(responseDelete.data)
    } catch (error) {
      console.log(error)
      if(error) error.response ? setError(error.response.data) : setError('Error deleting from inventory')
    }
  }

  const submitAddCategory = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const responseCategory = await axios.post(`${API}/inventory/add-category`, {name: category})
      setCategory('')
      setModal('')
      setLoading(false)
      setError('')
      setAllCategories(responseCategory.data)
    } catch (error) {
      console.log(error.response)
      setLoading(false)
      if(error) error.response ? setError(error.response.data) : setError('Error adding category to inventory')
    }
  }

  const editCategory = (item) => {
    // console.log(item)
    setModal('add_category')
    setEdit('category')
    setCategory(item.name)
    setCategoryID(item._id)
  }

  const updateCategory = async (e) => {
    e.preventDefault()
    try {
      const responseUpdate = await axios.post(`${API}/inventory/update-category`, {id: categoryID, name: category})
      // console.log(responseUpdate)
      setCategory('')
      setModal('')
      setError('')
      setEdit('')
      setAllCategories(responseUpdate.data)
    } catch (error) {
      console.log(error)
      if(error) error.response ? setError(error.response.data) : setError('Error deleting from inventory')
    }
  }

  const deleteCategory = async (id) => {
    try {
      const responseDelete = await axios.post(`${API}/inventory/delete-category`, {id: id})
      // console.log(responseDelete)
      setAllCategories(responseDelete.data)
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
        <span>Product Fields</span>
        <div className="form-error-container">
          {error && <span className="form-error"><SVGs svg={'error'}></SVGs>{error}</span>}
        </div>
      </div>
      <form className="clientDashboard-view-slab_form">
        <div className="clientDashboard-view-form-left">
          <div className="clientDashboard-view-form-left-box">
            <div className="clientDashboard-view-form-left-box-heading">
              <span>Add Brand</span>
              <span onClick={() => setModal('add_brand')}><SVGs svg={'plus'}></SVGs></span>
            </div>
            <div className="clientDashboard-view-form-left-box-container">
              <div className="clientDashboard-view-form-left-box-container-item">
                  <div className="clientDashboard-view-form-left-box-container-item-info-headers double-column">
                    <span onClick={(e) => filter == 'name' && filterType == 'brand' ? (setAsc(asc == 1 ? -1 : 1 ), setDesc(desc == -1 ? 1 : -1)) : (setFilter('name'), setFilterType('brand'))}>Brand <SVGs svg={'sort'}></SVGs></span>
                  </div>
              </div>
              {allBrands && allBrands.sort( (a, b) => filterType == 'brand' ? a[filter] > b[filter] ? asc : desc : null).map( (item, idx) => (
                <div key={idx} className="clientDashboard-view-form-left-box-container-item">
                  <div className="clientDashboard-view-form-left-box-container-item-info double-column">
                    <span>{item.name}</span>
                    {/* <a onClick={() => readOnly('add_material', 'readOnly', item)}>more info</a> */}
                  </div>
                  <div className="clientDashboard-view-form-left-box-container-item-controls">
                  <span onClick={() => editBrand(item)}><SVGs svg={'edit'}></SVGs></span>
                  <span onClick={() => deleteBrand(item._id)}><SVGs svg={'delete'}></SVGs></span>
                  </div>
                </div>
              ))}              
            </div>
          </div>
          <div className="clientDashboard-view-form-left-box">
            <div className="clientDashboard-view-form-left-box-heading">
              <span>Add Model</span>
              <span onClick={() => setModal('add_model')}><SVGs svg={'plus'}></SVGs></span>
            </div>
            <div className="clientDashboard-view-form-left-box-container">
              <div className="clientDashboard-view-form-left-box-container-item">
                  <div className="clientDashboard-view-form-left-box-container-item-info-headers double-column">
                    <span onClick={(e) => filter == 'name' && filterType == 'model' ? (setAsc(asc == 1 ? -1 : 1 ), setDesc(desc == -1 ? 1 : -1)) : (setFilter('name'), setFilterType('model'))}>Model <SVGs svg={'sort'}></SVGs></span>
                  </div>
              </div>
              {allModels && allModels.sort( (a, b) => filterType == 'model' ? a[filter] > b[filter] ? asc : desc : null).map( (item, idx) => (
                <div key={idx} className="clientDashboard-view-form-left-box-container-item">
                  <div className="clientDashboard-view-form-left-box-container-item-info double-column">
                    <span>{item.name}</span>
                    {/* <a onClick={() => readOnly('add_material', 'readOnly', item)}>more info</a> */}
                  </div>
                  <div className="clientDashboard-view-form-left-box-container-item-controls">
                  <span onClick={() => editModel(item)}><SVGs svg={'edit'}></SVGs></span>
                  <span onClick={() => deleteModel(item._id)}><SVGs svg={'delete'}></SVGs></span>
                  </div>
                </div>
              ))}              
            </div>
          </div>
        </div>
        <div className="clientDashboard-view-form-right">
          <div className="clientDashboard-view-form-left-box">
            <div className="clientDashboard-view-form-left-box-heading">
              <span>Add Category</span>
              <span onClick={() => setModal('add_category')}><SVGs svg={'plus'}></SVGs></span>
            </div>
            <div className="clientDashboard-view-form-left-box-container">
              <div className="clientDashboard-view-form-left-box-container-item">
                  <div className="clientDashboard-view-form-left-box-container-item-info-headers double-column">
                    <span onClick={(e) => filter == 'name' && filterType == 'category' ? (setAsc(asc == 1 ? -1 : 1 ), setDesc(desc == -1 ? 1 : -1)) : (setFilter('name'), setFilterType('category'))}>Category <SVGs svg={'sort'}></SVGs></span>
                  </div>
              </div>
              {allCategories && allCategories.sort( (a, b) => filterType == 'category' ? a[filter] > b[filter] ? asc : desc : null).map( (item, idx) => (
                <div key={idx} className="clientDashboard-view-form-left-box-container-item">
                  <div className="clientDashboard-view-form-left-box-container-item-info double-column">
                    <span>{item.name}</span>
                    {/* <a onClick={() => readOnly('add_material', 'readOnly', item)}>more info</a> */}
                  </div>
                  <div className="clientDashboard-view-form-left-box-container-item-controls">
                  <span onClick={() => editCategory(item)}><SVGs svg={'edit'}></SVGs></span>
                  <span onClick={() => deleteCategory(item._id)}><SVGs svg={'delete'}></SVGs></span>
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
                    <span onClick={(e) => filter == 'name' && filterType == 'location' ? (setAsc(asc == 1 ? -1 : 1 ), setDesc(desc == -1 ? 1 : -1)) : (setFilter('name'), setFilterType('location'))}>Location <SVGs svg={'sort'}></SVGs></span>
                  </div>
              </div>
              {allLocations && allLocations.sort( (a, b) => filterType == 'location' ? a[filter] > b[filter] ? asc : desc : null).map( (item, idx) => (
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
    { modal == 'add_brand' &&
      <div className="addFieldItems-modal">
      <div className="addFieldItems-modal-box">
        <div className="addFieldItems-modal-box-header">
          <span className="addFieldItems-modal-form-title">{edit ? 'Edit Brand' : 'New Brand'}</span>
          <div onClick={() => (setBrand(''), setModal(''), setError(''), setEdit(''))}><SVGs svg={'close'}></SVGs></div>
        </div>
        <form className="addFieldItems-modal-form" onSubmit={(e) => submitAddBrand(e)}>
          <div className="form-group-single-textarea">
            <div className="form-group-single-textarea-field">
              <label htmlFor="name_brand">Name</label>
              <textarea id="name_brand" rows="1" name="name_brand" placeholder="(Brand Name)" value={brand} onChange={(e) => setBrand(e.target.value)} onFocus={(e) => e.target.placeholder = ''} onBlur={(e) => e.target.placeholder = '(Brand Name)'} wrap="off" onKeyDown={(e) => e.keyCode == 13 ? e.preventDefault() : null} autoFocus={true} required></textarea>
            </div>
          </div>
          {!edit && <button type="submit" className="form-button w100">{!loading && <span>Add Brand</span>} {loading && <div className="loading"><span></span><span></span><span></span></div>}</button>}
          {edit == 'brand' && <button onClick={(e) => updateBrand(e)} className="form-button w100">{!loading && <span>Update Brand</span>} {loading && <div className="loading"><span></span><span></span><span></span></div>}</button>}
          {error && <span className="form-error"><SVGs svg={'error'}></SVGs>{error}</span>}
        </form>
      </div>
    </div>
    }
    { modal == 'add_model' &&
      <div className="addFieldItems-modal">
      <div className="addFieldItems-modal-box">
        <div className="addFieldItems-modal-box-header">
          <span className="addFieldItems-modal-form-title">{edit ? 'Edit Model' : 'New Model'}</span>
          <div onClick={() => (setModel(''), setModal(''), setError(''), setEdit(''))}><SVGs svg={'close'}></SVGs></div>
        </div>
        <form className="addFieldItems-modal-form" onSubmit={(e) => submitAddModel(e)}>
          <div className="form-group-single-textarea">
            <div className="form-group-single-textarea-field">
              <label htmlFor="name_model">Name</label>
              <textarea id="name_model" rows="1" name="name_model" placeholder="(Model Name)" value={model} onChange={(e) => setModel(e.target.value)} onFocus={(e) => e.target.placeholder = ''} onBlur={(e) => e.target.placeholder = '(Model Name)'} wrap="off" onKeyDown={(e) => e.keyCode == 13 ? e.preventDefault() : null} autoFocus={true} required></textarea>
            </div>
          </div>
          {!edit && <button type="submit" className="form-button w100">{!loading && <span>Add Model</span>} {loading && <div className="loading"><span></span><span></span><span></span></div>}</button>}
          {edit == 'model' && <button onClick={(e) => updateModel(e)} className="form-button w100">{!loading && <span>Update Model</span>} {loading && <div className="loading"><span></span><span></span><span></span></div>}</button>}
          {error && <span className="form-error"><SVGs svg={'error'}></SVGs>{error}</span>}
        </form>
      </div>
    </div>
    }
    { modal == 'add_category' &&
      <div className="addFieldItems-modal">
      <div className="addFieldItems-modal-box">
        <div className="addFieldItems-modal-box-header">
          <span className="addFieldItems-modal-form-title">{edit ? 'Edit Category' : 'New Category'}</span>
          <div onClick={() => (setModel(''), setModal(''), setError(''), setEdit(''))}><SVGs svg={'close'}></SVGs></div>
        </div>
        <form className="addFieldItems-modal-form" onSubmit={(e) => submitAddCategory(e)}>
          <div className="form-group-single-textarea">
            <div className="form-group-single-textarea-field">
              <label htmlFor="name_category">Name</label>
              <textarea id="name_category" rows="1" name="name_category" placeholder="(Category Name)" value={category} onChange={(e) => setCategory(e.target.value)} onFocus={(e) => e.target.placeholder = ''} onBlur={(e) => e.target.placeholder = '(Category Name)'} wrap="off" onKeyDown={(e) => e.keyCode == 13 ? e.preventDefault() : null} autoFocus={true} required></textarea>
            </div>
          </div>
          {!edit && <button type="submit" className="form-button w100">{!loading && <span>Add Category</span>} {loading && <div className="loading"><span></span><span></span><span></span></div>}</button>}
          {edit == 'category' && <button onClick={(e) => updateCategory(e)} className="form-button w100">{!loading && <span>Update Category</span>} {loading && <div className="loading"><span></span><span></span><span></span></div>}</button>}
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
    </>
  )
}

const mapStateToProps = (state) => {
  return
}

const mapDispatchToProps = dispatch => {
  return
}

export default connect(mapStateToProps, mapDispatchToProps)(ProductItems)
