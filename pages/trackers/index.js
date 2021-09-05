import TopNav from '../../components/client/dashboardTopNav'
import SideNav from '../../components/client/dashboardSideNav'
import React, { useState, useEffect, useRef } from 'react'
import withUser from '../withUser'
import SVGs from '../../files/svgs'
import {connect} from 'react-redux'
import {API} from '../../config'
import axios from 'axios'

const Trackers = ({hideSideNav, showSideNav, listSlabs, listProducts}) => {
  // console.log(listProducts)
  const myRefsSlabs = useRef([])
  const myRefsProducts = useRef([])
  
  const sendRedirect = true
  const refProducts = useRef(null)
  const [filterSlab, setFilterSlab] = useState('')
  const [ascSlab, setAscSlab] = useState(-1)
  const [descSlab, setDescSlab] = useState(1)
  const [filterProduct, setFilterProduct] = useState('')
  const [ascProduct, setAscProduct] = useState(-1)
  const [descProduct, setDescProduct] = useState(1)
  const [width, setWidth] = useState()
  const [error, setError] = useState('')
  const [controlsSlabs, setControlsSlabs] = useState(false)
  const [idControlsSlabs, setIDControlsSlabs] = useState('')
  const [controlsProducts, setControlsProducts] = useState(false)
  const [idControlsProducts, setIDControlsProducts] = useState('')
  const [loadingSlab, setLoadingSlab] = useState(false)
  const [loadingProduct, setLoadingProduct] = useState(false)
  const [searchSlab, setSearchSlab] = useState('')
  const [searchLoadingSlab, setSearchLoadingSlab] = useState(false)
  const [allSlabs, setAllSlabs] = useState(listSlabs ? listSlabs : [])
  const [searchProduct, setSearchProduct] = useState('')
  const [searchLoadingProduct, setSearchLoadingProduct] = useState(false)
  const [allProducts, setAllProducts] = useState(listProducts ? listProducts : [])

  const handleClickOutsideSlabs = (event) => {
    if(myRefsSlabs.current){
      myRefsSlabs.current.forEach((item) => {
        if(item){
          if(item.contains(event.target)) return
          if(event.target == document.getElementById('delete-slab')) return
          if(event.target == document.getElementById('edit-slab')) return
          // console.log(item.childNodes)
          item.childNodes[0].checked = false
          setControlsSlabs(false)
          setIDControlsSlabs('')
        }
      })
    }
  }

  const handleClickOutsideProducts = (event) => {
    if(myRefsProducts.current){
      myRefsProducts.current.forEach((item) => {
        if(item){
          if(item.contains(event.target)) return
          if(event.target == document.getElementById('delete-product')) return
          if(event.target == document.getElementById('edit-product')) return
          // console.log(item.childNodes)
          item.childNodes[0].checked = false
          setControlsProducts(false)
          setIDControlsProducts('')
        }
      })
    }
  }

  useEffect(() => {
    let timeOutSearch
    
    if(searchSlab.length > 0){
      setSearchLoadingSlab(true)
      timeOutSearch = setTimeout(() => {
        submitSearchSlab()
      }, 2000)
    }

    if(searchSlab.length == 0){
      setAllSlabs(listSlabs)
      setError('')
    }

    return () => clearTimeout(timeOutSearch)
  }, [searchSlab])

  useEffect(() => {
    let timeOutSearchProduct
    
    if(searchProduct.length > 0){
      setSearchLoadingProduct(true)
      timeOutSearchProduct = setTimeout(() => {
        submitSearchProduct()
      }, 2000)
    }

    if(searchProduct.length == 0){
      setAllProducts(listProducts)
      setError('')
    }

    return () => clearTimeout(timeOutSearchProduct)
  }, [searchProduct])

  useEffect(() => {
    document.addEventListener("click", handleClickOutsideSlabs, true);
    document.addEventListener("click", handleClickOutsideProducts, true);

    return () => {
      document.removeEventListener("click", handleClickOutsideSlabs, true);
      document.removeEventListener("click", handleClickOutsideProducts, true);
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

  const handleControls = (e) => {
    const els = document.querySelectorAll('.clientDashboard-view-slab_list-slabs-checkbox-input')

    els.forEach( (el) => {
      el.checked = false
    })

    e.target.checked = true
  }

  const handleDeleteSlab = async (e) => {
    let deleteImages = listSlabs.filter((item) => {
      if(item._id == idControlsSlabs) return item
    })
    setLoadingSlab(true)
    setError('')
    try {
      const responseDelete = await axios.post(`${API}/inventory/delete-slab`, {id: idControlsSlabs, images: deleteImages[0].images})
      // console.log(responseDelete)
      window.location.href = '/trackers'
      setLoadingSlab(false)
    } catch (error) {
      console.log(error)
      setLoadingSlab(false)
      if(error) error.response ? setError(error.response.data) : setError('Error deleting from inventory')
    }
  }

  const handleDeleteProduct = async (e) => {
    let deleteImages = listProducts.filter((item) => {
      if(item._id == idControlsProducts) return item
    })
    setLoadingProduct(true)
    setError('')
    try {
      const responseDelete = await axios.post(`${API}/inventory/delete-product`, {id: idControlsProducts, images: deleteImages[0].images})
      window.location.href = '/products'
      setLoadingProduct(false)
    } catch (error) {
      setLoadingProduct(false)
      if(error) error.response ? setError(error.response.data) : setError('Error deleting from inventory')
    }
  }

  const submitSearchSlab = async (e) => {
    try {
      const responseSearch = await axios.post(`${API}/inventory/slab-search`, {query: searchSlab})
      setSearchLoadingSlab(false)
      if(responseSearch.data.length > 0) return setAllSlabs(responseSearch.data)
      setAllSlabs([])
      setError('Our search could not find anything')
    } catch (error) {
      console.log(error)
      if(error) error.response ? setError(error.response.data) : setError('There was an error with the search')
    }
  }

  const submitSearchProduct = async (e) => {
    try {
      const responseSearch = await axios.post(`${API}/inventory/product-search`, {query: searchProduct})
      setSearchLoadingProduct(false)
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
          <div className="clientDashboard-view-slab_list-heading">
            <div className="clientDashboard-view-slab_list-heading-title">Slabs List</div>
            <div className={`form-group-search ` + (controlsSlabs ? 'form-group-search-hideOnMobile' : '')}>
              <form autoComplete="off">
                <input type="text" name="search" placeholder="Search" value={searchSlab} onChange={(e) => (setSearchSlab(e.target.value))} onFocus={(e) => (e.target.placeholder = '', setError(''))} onBlur={(e) => (e.target.placeholder = 'Search', setError(''))} onKeyDown={(e) => e.keyCode == 13 ? e.preventDefault() : null}  required></input>
              </form>
            </div>
            {controlsSlabs &&
              <div className="clientDashboard-view-slab_list-heading-controls">
                <div id="edit-slab" className="clientDashboard-view-slab_list-heading-controls-item edit" onClick={() => idControlsSlabs ? window.location.href = `inventory/slab/${idControlsSlabs}` : null}>Edit</div>
                <div id="delete-slab" className="clientDashboard-view-slab_list-heading-controls-item delete" onClick={() => handleDeleteSlab()}>Delete</div>
              </div>
            }
            {loadingSlab && <div className="loading"><span></span><span></span><span></span></div>}
            <div className="form-error-container">
              {error && <span className="form-error form-error-list"><SVGs svg={'error'}></SVGs><span>{error}</span></span>}
            </div>
          </div>
          <div className="clientDashboard-view-slab_list-headers">
            {searchLoadingSlab ? <div className="search-loading"><div className="search-loading-box"><svg><circle cx="20" cy="20" r="20"></circle></svg><span>Loading slabs</span></div></div>: null}
            <div className="clientDashboard-view-slab_list-headers-checkbox"></div>
            <div className="clientDashboard-view-slab_list-headers-item-container">
              <div className="clientDashboard-view-slab_list-headers-item">Image</div>
              <div className="clientDashboard-view-slab_list-headers-item" onClick={(e) => filterSlab == 'block' ? (setAscSlab(ascSlab == 1 ? -1 : 1 ), setDescSlab(descSlab == -1 ? 1 : -1)) : setFilterSlab('block')}>Block <SVGs svg={'sort'}></SVGs></div>
              <div className="clientDashboard-view-slab_list-headers-item" onClick={(e) => filterSlab == 'material' ? (setAscSlab(ascSlab == 1 ? -1 : 1 ), setDescSlab(descSlab == -1 ? 1 : -1)) : setFilterSlab('material')}>Material <SVGs svg={'sort'}></SVGs></div>
              <div className="clientDashboard-view-slab_list-headers-item" onClick={(e) => filterSlab == 'color' ? (setAscSlab(ascSlab == 1 ? -1 : 1 ), setDescSlab(descSlab == -1 ? 1 : -1)) : setFilterSlab('color')}>Color <SVGs svg={'sort'}></SVGs></div>
              <div className="clientDashboard-view-slab_list-headers-item" onClick={(e) => filterSlab == 'quantity' ? (setAscSlab(ascSlab == 1 ? -1 : 1 ), setDescSlab(descSlab == -1 ? 1 : -1)) : setFilterSlab('quantity')}>Quantity <SVGs svg={'sort'}></SVGs></div>
              <div className="clientDashboard-view-slab_list-headers-item" onClick={(e) => filterSlab == 'size' ? (setAscSlab(ascSlab == 1 ? -1 : 1 ), setDescSlab(descSlab == -1 ? 1 : -1)) : setFilterSlab('size')}>Size <SVGs svg={'sort'}></SVGs></div>
              <div className="clientDashboard-view-slab_list-headers-item" onClick={(e) => filterSlab == 'thickness' ? (setAscSlab(ascSlab == 1 ? -1 : 1 ), setDescSlab(descSlab == -1 ? 1 : -1)) : setFilterSlab('thickness')}>Thickness <SVGs svg={'sort'}></SVGs></div>
              <div className="clientDashboard-view-slab_list-headers-item" onClick={(e) => filterSlab == 'price' ? (setAscSlab(ascSlab == 1 ? -1 : 1 ), setDescSlab(descSlab == -1 ? 1 : -1)) : setFilterSlab('price')}>Price <SVGs svg={'sort'}></SVGs></div>
              <div className="clientDashboard-view-slab_list-headers-item" onClick={(e) => filterSlab == 'grade' ? (setAscSlab(ascSlab == 1 ? -1 : 1 ), setDescSlab(descSlab == -1 ? 1 : -1)) : setFilterSlab('grade')}>Grade <SVGs svg={'sort'}></SVGs></div>
              <div className="clientDashboard-view-slab_list-headers-item" onClick={(e) => filterSlab == 'finish' ? (setAscSlab(ascSlab == 1 ? -1 : 1 ), setDescSlab(descSlab == -1 ? 1 : -1)) : setFilterSlab('finish')}>Finish <SVGs svg={'sort'}></SVGs></div>
              <div className="clientDashboard-view-slab_list-headers-item" onClick={(e) => filterSlab == 'location' ? (setAscSlab(ascSlab == 1 ? -1 : 1 ), setDescSlab(descSlab == -1 ? 1 : -1)) : setFilterSlab('location')}>Location <SVGs svg={'sort'}></SVGs></div>
              <div className="clientDashboard-view-slab_list-headers-item"></div>
              <div className="clientDashboard-view-slab_list-headers-item"></div>
            </div>
          </div>
          <div className="clientDashboard-view-slab_list-slabs-container tracker-list">
            {allSlabs && allSlabs.sort((a, b) => a[filterSlab] > b[filterSlab] ? ascSlab : descSlab).map((item, idx) => (
            <div key={idx} className="clientDashboard-view-slab_list-slabs">
                <div className="clientDashboard-view-slab_list-slabs-checkbox" ref={(el) => (myRefsSlabs.current[idx] = el)}>
                  <input className="clientDashboard-view-slab_list-slabs-checkbox-input" type="checkbox" id={`slab ` + `${idx}`} onClick={(e) => e.target.checked == true ? (handleControls(e), setControlsSlabs(true), setIDControlsSlabs(item._id), window.scrollTo({top: 0})) : (setControlsSlabs(false), setIDControlsSlabs(''))} />
                  <label htmlFor={`slab ` + `${idx}`}><span>&nbsp;</span></label>
                </div>
                <div className="clientDashboard-view-slab_list-slabs-item-container"  onClick={() => window.location.href = `/inventory/slab/${item._id}`}>
                  <div className="clientDashboard-view-slab_list-slabs-item">{item.images.length > 0 ? <img src={item.images[0].location} alt="" /> : null}</div>
                  <div className="clientDashboard-view-slab_list-slabs-item">{item.block}</div>
                  <div className="clientDashboard-view-slab_list-slabs-item">{item.material}</div>
                  <div className="clientDashboard-view-slab_list-slabs-item">{item.color}</div>
                  <div className="clientDashboard-view-slab_list-slabs-item">{item.quantity}</div>
                  <div className="clientDashboard-view-slab_list-slabs-item">{item.size_1} x {item.size_2}</div>
                  <div className="clientDashboard-view-slab_list-slabs-item">{item.thickness}</div>
                  <div className="clientDashboard-view-slab_list-slabs-item">{item.price_slab}</div>
                  <div className="clientDashboard-view-slab_list-slabs-item">{item.grade}</div>
                  <div className="clientDashboard-view-slab_list-slabs-item">{item.finish}</div>
                  <div className="clientDashboard-view-slab_list-slabs-item">{item.location}</div>
                  <div className="clientDashboard-view-slab_list-slabs-item"></div>
                  <div className="clientDashboard-view-slab_list-slabs-item"></div>
                </div>
            </div>
            ))}
          </div>
        </div>
        <div ref={refProducts} className="clientDashboard-view-slab_list-container">
          {searchLoadingProduct ? <div className="search-loading"><div className="search-loading-box"><svg><circle cx="20" cy="20" r="20"></circle></svg><span>Loading products</span></div></div>: null}
          <div className="clientDashboard-view-slab_list-heading">
            <div className="clientDashboard-view-slab_list-heading-title">Product List</div>
            <div className={`form-group-search ` + (controlsProducts ? 'form-group-search-hideOnMobile' : '')}>
              <form autoComplete="off">
                <input type="text" name="search" placeholder="Search" value={searchProduct} onChange={(e) => (setSearchProduct(e.target.value))} onFocus={(e) => (e.target.placeholder = '', setError(''))} onBlur={(e) => (e.target.placeholder = 'Search', setError(''))} onKeyDown={(e) => e.keyCode == 13 ? e.preventDefault() : null}  required></input>
              </form>
            </div>
            {controlsProducts &&
              <div className="clientDashboard-view-slab_list-heading-controls">
                <div id="edit-product" className="clientDashboard-view-slab_list-heading-controls-item edit" onClick={() => idControlsProducts ? window.location.href = `inventory/product/${idControlsProducts}` : null}>Edit</div>
                <div id="delete-product" className="clientDashboard-view-slab_list-heading-controls-item delete" onClick={() => handleDeleteProduct()}>Delete</div>
              </div>
            }
            {loadingProduct && <div className="loading"><span></span><span></span><span></span></div>}
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
          <div className="clientDashboard-view-slab_list-slabs-container tracker-list">
            {allProducts && allProducts.sort((a, b) => a[filterProduct] > b[filterProduct] ? ascProduct : descProduct).map((item, idx) => (
            <div key={idx} className="clientDashboard-view-slab_list-slabs">
                <div className="clientDashboard-view-slab_list-slabs-checkbox" ref={(el) => (myRefsProducts.current[idx] = el)}>
                  <input className="clientDashboard-view-slab_list-slabs-checkbox-input" type="checkbox" id={`product ` + `${idx}`} onClick={(e) => e.target.checked == true ? (handleControls(e), setControlsProducts(true), setIDControlsProducts(item._id)) : (setControlsProducts(false), setIDControlsProducts(''))} />
                  <label htmlFor={`product ` + `${idx}`}><span>&nbsp;</span></label>
                </div>
                <div className="clientDashboard-view-slab_list-slabs-item-container"  onClick={() => window.location.href = `/inventory/product/${item._id}`}>
                  <div className="clientDashboard-view-slab_list-slabs-item">{item.images.length > 0 ? <img src={item.images[0].location} alt="" /> : null}</div>
                  <div className="clientDashboard-view-slab_list-slabs-item">{item.brand}</div>
                  <div className="clientDashboard-view-slab_list-slabs-item">{item.model}</div>
                  <div className="clientDashboard-view-slab_list-slabs-item">{item.category}</div>
                  <div className="clientDashboard-view-slab_list-slabs-item">{item.quantity}</div>
                  <div className="clientDashboard-view-slab_list-slabs-item">{item.location}</div>
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

Trackers.getInitialProps = async () => {
  let dataSlabs
  let dataProducts
  let error
  try {
    const responseSlabs = await axios.get(`${API}/inventory/all-slabs`)
    dataSlabs = responseSlabs.data
  } catch (error) {
    if(error) error.response ? (error = error.response.data) : null
    console.log(error)
  }

  try {
    const responseProducts = await axios.get(`${API}/inventory/all-products`)
    dataProducts = responseProducts.data
  } catch (error) {
    if(error) error.response ? (error = error.response.data) : null
    console.log(error)
  }

  return {
    listSlabs: dataSlabs ? dataSlabs : null,
    listProducts: dataProducts ? dataProducts : null
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

export default connect(mapStateToProps, mapDispatchToProps)(withUser(Trackers))
