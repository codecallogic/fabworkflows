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
  
  return (
    <>
    <TopNav></TopNav>
    <div className="clientDashboard">
      <SideNav width={width} redirect={sendRedirect}></SideNav>
      <div className="clientDashboard-view">
        <div className="clientDashboard-view-slab_list-container">
          <div className="clientDashboard-view-slab_list-heading">
            <span>Slabs List</span>
            {controlsSlabs &&
              <div className="clientDashboard-view-slab_list-heading-controls">
                <div className="clientDashboard-view-slab_list-heading-controls-item edit" onClick={() => idControlsSlabs ? window.location.href = `inventory/slab/${idControlsSlabs}` : null}>Edit</div>
                {/* <div className="clientDashboard-view-slab_list-heading-controls-item delete">Delete</div> */}
              </div>
            }
            <div className="form-error-container">
              {error && <span className="form-error"><SVGs svg={'error'}></SVGs></span>}
            </div>
          </div>
          <div className="clientDashboard-view-slab_list-headers">
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
            {listSlabs && listSlabs.sort((a, b) => a[filterSlab] > b[filterSlab] ? ascSlab : descSlab).map((item, idx) => (
            <div key={idx} className="clientDashboard-view-slab_list-slabs">
                <div className="clientDashboard-view-slab_list-slabs-checkbox">
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
          <div className="clientDashboard-view-slab_list-heading">
            <span>Products List</span>
            {controlsProducts &&
              <div className="clientDashboard-view-slab_list-heading-controls">
                <div className="clientDashboard-view-slab_list-heading-controls-item edit" onClick={() => idControlsProducts ? window.location.href = `inventory/product/${idControlsProducts}` : null}>Edit</div>
                {/* <div className="clientDashboard-view-slab_list-heading-controls-item delete">Delete</div> */}
              </div>
            }
            <div className="form-error-container">
              {error && <span className="form-error"><SVGs svg={'error'}></SVGs></span>}
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
            {listProducts && listProducts.sort((a, b) => a[filterProduct] > b[filterProduct] ? ascProduct : descProduct).map((item, idx) => (
            <div key={idx} className="clientDashboard-view-slab_list-slabs">
                <div className="clientDashboard-view-slab_list-slabs-checkbox">
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
