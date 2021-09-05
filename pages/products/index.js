import TopNav from '../../components/client/dashboardTopNav'
import SideNav from '../../components/client/dashboardSideNav'
import React, { useState, useEffect, useRef} from 'react'
import withUser from '../withUser'
import SVGs from '../../files/svgs'
import {connect} from 'react-redux'
import {API} from '../../config'
import axios from 'axios'

const Products = ({hideSideNav, showSideNav, list}) => {
  // console.log(list)
  const myRefs = useRef([])
  
  const sendRedirect = true
  const [width, setWidth] = useState()
  const [error, setError] = useState('')
  const [controls, setControls] = useState(false)
  const [idControls, setIDControls] = useState('')
  const [filterProduct, setFilterProduct] = useState('')
  const [ascProduct, setAscProduct] = useState(-1)
  const [descProduct, setDescProduct] = useState(1)
  const [loading, setLoading] = useState(false)
  const [search, setSearch] = useState('')
  const [searchLoading, setSearchLoading] = useState(false)
  const [allProducts, setAllProducts] = useState(list ? list: [])


  const handleClickOutside = (event) => {
    if(myRefs.current){
      myRefs.current.forEach((item) => {
        if(item){
          if(item.contains(event.target)) return
          if(event.target == document.getElementById('delete-product')) return
          if(event.target == document.getElementById('edit-product')) return
          item.childNodes[0].checked = false
          setControls(false)
          setIDControls('')
        }
      })
    }
  }

  useEffect(() => {
    let timeOutSearch
    
    if(search.length > 0){
      setSearchLoading(true)
      timeOutSearch = setTimeout(() => {
        submitSearch()
      }, 2000)
    }

    if(search.length == 0){
      setAllProducts(list)
      setError('')
    }

    return () => clearTimeout(timeOutSearch)
  }, [search])

  useEffect(() => {
    document.addEventListener("click", handleClickOutside, true);

    return () => {
      document.removeEventListener("click", handleClickOutside, true);
    };
  }, [])

  useEffect(() => {
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

  const handleControls = (e, id) => {
    const els = document.querySelectorAll('.clientDashboard-view-slab_list-slabs-checkbox-input')

    els.forEach( (el) => {
      el.checked = false
    })

    e.target.checked = true

    setControls(true)
    return setIDControls(id)
  }

  const handleDelete = async (e) => {
    let deleteImages = list.filter((item) => {
      if(item._id == idControls) return item
    })
    setLoading(true)
    setError('')
    try {
      const responseDelete = await axios.post(`${API}/inventory/delete-product`, {id: idControls, images: deleteImages[0].images})
      window.location.href = '/products'
    } catch (error) {
      if(error) error.response ? setError(error.response.data) : setError('Error deleting from inventory')
    }
  }

  const submitSearch = async (e) => {
    try {
      const responseSearch = await axios.post(`${API}/inventory/product-search`, {query: search})
      setSearchLoading(false)
      if(responseSearch.data.length > 0) return setAllProducts(responseSearch.data)
      setAllProducts([])
      setError('Our search could not find anything')
    } catch (error) {
      console.log(error)
      if(error) error.response ? setError(error.response.data) : setError('There was an error with the search')
    }
  }
  
  return (
    <>
    <TopNav></TopNav>
    <div className="clientDashboard">
      <SideNav width={width} redirect={sendRedirect}></SideNav>
      <div className="clientDashboard-view">
        <div className="clientDashboard-view-slab_list-container">
          {searchLoading ? <div className="search-loading"><div className="search-loading-box"><svg><circle cx="20" cy="20" r="20"></circle></svg><span>Loading products</span></div></div>: null}
          <div className="clientDashboard-view-slab_list-heading">
            <div className="clientDashboard-view-slab_list-heading-title">Product List</div>
            <div className={`form-group-search ` + (controls ? 'form-group-search-hideOnMobile' : '')}>
              <form autoComplete="off">
                <input type="text" name="search" placeholder="Search" value={search} onChange={(e) => (setSearch(e.target.value))} onFocus={(e) => (e.target.placeholder = '', setError(''))} onBlur={(e) => (e.target.placeholder = 'Search', setError(''))} onKeyDown={(e) => e.keyCode == 13 ? e.preventDefault() : null}  required></input>
              </form>
            </div>
            {controls &&
              <div className="clientDashboard-view-slab_list-heading-controls">
                <div id="edit-product" className="clientDashboard-view-slab_list-heading-controls-item edit" onClick={() => idControls ? window.location.href = `inventory/product/${idControls}` : null}>Edit</div>
                <div id="delete-product" className="clientDashboard-view-slab_list-heading-controls-item delete" onClick={() => handleDelete()}>Delete</div>
              </div>
            }
            {loading && <div className="loading"><span></span><span></span><span></span></div>}
            <div className="form-error-container">
              {error && <span className="form-error form-error-list"><SVGs svg={'error'}></SVGs><span>{error}</span></span>}
            </div>
          </div>
          <div className="clientDashboard-view-slab_list-headers">
            <div className="clientDashboard-view-slab_list-headers-checkbox"></div>
            <div className="clientDashboard-view-slab_list-headers-item-container">
              <div className="clientDashboard-view-slab_list-headers-item">Image</div>
              <div className="clientDashboard-view-slab_list-headers-item" onClick={(e) => filterProduct == 'brand' ? (setAscProduct(ascProduct == 1 ? -1 : 1 ), setDescProduct(descProduct == -1 ? 1 : -1)) : setFilterProduct('brand')}>Brand <SVGs svg={'sort'}></SVGs></div>
              <div className="clientDashboard-view-slab_list-headers-item" onClick={(e) => filterProduct == 'model' ? (setAscProduct(ascProduct == 1 ? -1 : 1 ), setDescProduct(descProduct == -1 ? 1 : -1)) : setFilterProduct('model')}>Model <SVGs svg={'sort'}></SVGs></div>
              <div className="clientDashboard-view-slab_list-headers-item" onClick={(e) => filterProduct == 'category' ? (setAscProduct(ascProduct == 1 ? -1 : 1 ), setDescProduct(descProduct == -1 ? 1 : -1)) : setFilterProduct('category')}>Category <SVGs svg={'sort'}></SVGs></div>
              <div className="clientDashboard-view-slab_list-headers-item" onClick={(e) => filterProduct == 'quantity' ? (setAscProduct(ascProduct == 1 ? -1 : 1 ), setDescProduct(descProduct == -1 ? 1 : -1)) : setFilterProduct('quantity')}>Quantity <SVGs svg={'sort'}></SVGs></div>
              <div className="clientDashboard-view-slab_list-headers-item" onClick={(e) => filterProduct == 'location' ? (setAscProduct(ascProduct == 1 ? -1 : 1 ), setDescProduct(descProduct == -1 ? 1 : -1)) : setFilterProduct('location')}>Location <SVGs svg={'sort'}></SVGs></div>
              <div className="clientDashboard-view-slab_list-headers-item" onClick={(e) => filterProduct == 'description' ? (setAscProduct(ascProduct == 1 ? -1 : 1 ), setDescProduct(descProduct == -1 ? 1 : -1)) : setFilterProduct('description')}>Description <SVGs svg={'sort'}></SVGs></div>
              <div className="clientDashboard-view-slab_list-headers-item" onClick={(e) => filterProduct == 'price' ? (setAscProduct(ascProduct == 1 ? -1 : 1 ), setDescProduct(descProduct == -1 ? 1 : -1)) : setFilterProduct('price')}>Price <SVGs svg={'sort'}></SVGs></div>
              <div className="clientDashboard-view-slab_list-headers-item"></div>
              <div className="clientDashboard-view-slab_list-headers-item"></div>
            </div>
          </div>
          <div className="clientDashboard-view-slab_list-slabs-container">
            {allProducts.length > 0 && allProducts.sort((a, b) => a[filterProduct] > b[filterProduct] ? ascProduct : descProduct).map((item, idx) => (
            <div key={idx} className="clientDashboard-view-slab_list-slabs">
                <div className="clientDashboard-view-slab_list-slabs-checkbox" ref={(el) => (myRefs.current[idx] = el)}>
                  <input className="clientDashboard-view-slab_list-slabs-checkbox-input" type="checkbox" id={`slab ` + `${idx}`} onClick={(e) => e.target.checked == true ? (handleControls(e, item._id), window.scrollTo({top: 0})) : (setControls(false), setIDControls(''))} />
                  <label htmlFor={`slab ` + `${idx}`}><span>&nbsp;</span></label>
                </div>
                <div className="clientDashboard-view-slab_list-slabs-item-container"  onClick={() => window.location.href = `/inventory/product/${item._id}`}>
                  <div className="clientDashboard-view-slab_list-slabs-item">{item.images.length > 0 ? <img src={item.images[0].location} alt="" /> : null}</div>
                  <div className="clientDashboard-view-slab_list-slabs-item">{item.brand}</div>
                  <div className="clientDashboard-view-slab_list-slabs-item">{item.model}</div>
                  <div className="clientDashboard-view-slab_list-slabs-item">{item.category}</div>
                  <div className="clientDashboard-view-slab_list-slabs-item">{item.quantity}</div>
                  <div className="clientDashboard-view-slab_list-slabs-item">{item.location} x {item.size_2}</div>
                  <div className="clientDashboard-view-slab_list-slabs-item">{item.description}</div>
                  <div className="clientDashboard-view-slab_list-slabs-item">{item.price}</div>
                  <div className="clientDashboard-view-slab_list-slabs-item"></div>
                  <div className="clientDashboard-view-slab_list-slabs-item"></div>
                </div>
            </div>
            ))}
          </div>
        </div>
      </div>
    </div>
    </>
  )
}

Products.getInitialProps = async () => {
  let data
  let error
  try {
    const responseProducts = await axios.get(`${API}/inventory/all-products`)
    data = responseProducts.data
  } catch (error) {
    console.log(error)
  }

  return {
    list: data ? data : null
  }
}

const mapStateToProps = state => {
  return {
    slab: state.slab
  }
}

const mapDispatchToProps = dispatch => {
  return {
    hideSideNav: () => dispatch({type: 'HIDE_SIDENAV'}),
    showSideNav: () => dispatch({type: 'SHOW_SIDENAV'}),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(withUser(Products))
