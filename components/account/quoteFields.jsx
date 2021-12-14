import SVGs from '../../files/svgs'
import React, { useState, useEffect } from 'react'
import {connect} from 'react-redux'
import {API} from '../../config'
import axios from 'axios'

const QuoteFields = ({preloadCategories}) => {
  const [error, setError] = useState('')
  const [modal, setModal] = useState('')
  const [edit, setEdit] = useState('')
  const [loading, setLoading] = useState('')
  const [allCategories, setAllCategories] = useState(preloadCategories ? preloadCategories : [])
  const [category, setCategory] = useState('')
  const [categoryID, setCategoryID] = useState('')
  const [filter, setFilter] = useState('')
  const [filterType, setFilterType] = useState('')
  const [asc, setAsc] = useState(-1)
  const [desc, setDesc] = useState(1)

  const [prevX, setPrevX] = useState(0)
  const [prevY, setPrevY] = useState(0)
  const onPointerDown = () => {}
  const onPointerUp = () => {}
  const onPointerMove = () => {}
  const [isDragging, setIsDragging] = useState(false)

  const [translate, setTranslate] = useState({
    x: 0,
    y: 0
  });

  const handlePointerDown = (e) => {
    setPrevX(0)
    setPrevY(0)
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
    var movementX = (prevX ? e.screenX - prevX : 0)
    var movementY = (prevY ? e.screenY - prevY : 0)
    
    setPrevX(e.screenX)
    setPrevY(e.screenY)

    handleModalMove(movementX, movementY)
  };

  const handleModalMove = (X, Y) => {
    setTranslate({
      x: translate.x + X,
      y: translate.y + Y
    });
  }
  
  // console.log(allMaterials)
  const validateIsNumber = (type) => {
    const input = document.getElementById(type)
    const regex = /[^0-9|\n\r]/g
    input.value = input.value.split(regex).join('')
  }

  const submitAddCategory = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const responseBrand = await axios.post(`${API}/transaction/create-category`, {name: category})
      setModal('')
      setLoading(false)
      setError('')
      setAllCategories([...responseBrand.data])
    } catch (error) {
      console.log(error.response)
      setLoading(false)
      if(error) error.response ? setError(error.response.data) : setError('Error adding category')
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
      const responseUpdate = await axios.post(`${API}/transaction/update-category`, {id: categoryID, name: category})
      // console.log(responseUpdate)
      setModal('')
      setError('')
      setEdit('')
      setAllCategories([...responseUpdate.data])
    } catch (error) {
      console.log(error)
      if(error) error.response ? setError(error.response.data) : setError('Error deleting category')
    }
  }

  const deleteCategory = async (id) => {
    try {
      const responseDelete = await axios.post(`${API}/transaction/delete-category`, {id: id})
      // console.log(responseDelete)
      setModal('')
      setError('')
      setAllCategories([...responseDelete.data])
    } catch (error) {
      console.log(error)
      if(error) error.response ? setError(error.response.data) : setError('Error deleting from inventory')
    }
  }
  
  return (
    <>
    <div className="clientDashboard-view-slab_form-container">
      <div className="clientDashboard-view-slab_form-heading">
        <span>Transaction Fields</span>
        <div className="form-error-container">
          {error && <span className="form-error"><SVGs svg={'error'}></SVGs>{error}</span>}
        </div>
      </div>
      <form className="clientDashboard-view-slab_form">
        <div className="clientDashboard-view-form-left">
          <div className="clientDashboard-view-form-left-box">
            <div className="clientDashboard-view-form-left-box-heading">
              <span>Add Miscellaneous Phase/Category</span>
              <span onClick={() => (setCategory(''), setModal('add_category'))}><SVGs svg={'plus'}></SVGs></span>
            </div>
            <div className="clientDashboard-view-form-left-box-container">
              <div className="clientDashboard-view-form-left-box-container-item">
                  <div className="clientDashboard-view-form-left-box-container-item-info-headers double-column">
                    <span onClick={(e) => filter == 'name' && filterType == 'name' ? (setAsc(asc == 1 ? -1 : 1 ), setDesc(desc == -1 ? 1 : -1)) : (setFilter('name'), setFilterType('name'))}>Brand <SVGs svg={'sort'}></SVGs></span>
                  </div>
              </div>
              {allCategories && allCategories.sort( (a, b) => filterType == 'name' ? a[filter] > b[filter] ? asc : desc : null).map( (item, idx) => (
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
        </div>
      </form>
    </div>
    { modal == 'add_category' &&
      <div className="addFieldItems-modal" data-value="parent" onClick={(e) => e.target.getAttribute('data-value') == 'parent' ? setIsDragging(false) : null}>
      <div className="addFieldItems-modal-box" onPointerDown={handlePointerDown} onPointerUp={handlePointerUp} onPointerMove={handlePointerMove} style={{transform: `translateX(${translate.x}px) translateY(${translate.y}px)`}}>
        <div className="addFieldItems-modal-box-header">
          <span className="addFieldItems-modal-form-title">{edit ? 'Edit Category' : 'New Miscellaneous Phase/Category'}</span>
          <div onClick={() => (setModal(''), setError(''), setEdit(''))}><SVGs svg={'close'}></SVGs></div>
        </div>
        <form className="addFieldItems-modal-form" onSubmit={(e) => submitAddCategory(e)}>
          <div className="form-group-single-textarea">
            <div className="form-group-single-textarea-field">
              <label htmlFor="name">Name</label>
              <textarea id="name" rows="1" name="name" placeholder="(Category Name)" value={category} onChange={(e) => setCategory(e.target.value)} onFocus={(e) => e.target.placeholder = ''} onBlur={(e) => e.target.placeholder = '(Category Name)'} wrap="off" onKeyDown={(e) => e.keyCode == 13 ? e.preventDefault() : null} autoFocus={true} required></textarea>
            </div>
          </div>
          {!edit && <button type="submit" className="form-button w100">{!loading && <span>Add Category</span>} {loading && <div className="loading"><span></span><span></span><span></span></div>}</button>}
          {edit == 'category' && <button onClick={(e) => updateCategory(e)} className="form-button w100">{!loading && <span>Update Category</span>} {loading && <div className="loading"><span></span><span></span><span></span></div>}</button>}
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

export default connect(mapStateToProps, mapDispatchToProps)(QuoteFields)
