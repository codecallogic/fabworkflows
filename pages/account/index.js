import TopNav from '../../components/client/dashboardTopNav'
import SideNav from '../../components/client/dashboardSideNav'
import {connect} from 'react-redux'
import SVGs from '../../files/svgs'
import React, { useState, useEffect } from 'react'
import QRCode from 'qrcode'
import withUser from '../withUser'

const formatter = new Intl.NumberFormat('en-US', {
  minimumFractionDigits: 2,      
  maximumFractionDigits: 2,
});

const Dashboard = ({nav, changeView, slab, createSlab}) => {

  const [input_dropdown, setInputDropdown] = useState('')

  const validateIsNumber = (type) => {
    const input = document.getElementById(type)
    
    const regex = /[^0-9|\n\r]/g

    if(type == 'quantity' || type == 'block') input.value = input.value.split(regex).join('')
    if(type == 'size_1' || type == 'size_2') input.value = input.value.split(regex).join('') + ' cm'
    if(type == 'thickness') input.value = input.value.split(regex).join('') + ' cm'

    if(input.value == ' cm') input.value = ''
  }

  const generateQR = async (e) => {
    e.preventDefault()
    e.stopPropagation()
    try {
      const image = await QRCode.toDataURL('Hello')
      createSlab('qr_code', image)
    } catch (err) {
      console.error(err)
    }
  }
  
  return (
    <>
      <TopNav></TopNav>
      <div className="clientDashboard">
        <SideNav></SideNav>
        <div className="clientDashboard-view">
          {nav.main &&
          <div className="clientDashboard-view-main">
            <div className="clientDashboard-view-main-box"></div>
            <div className="clientDashboard-view-main-box"></div>
            <div className="clientDashboard-view-main-box"></div>
            <div className="clientDashboard-view-main-box"></div>
          </div>
          }
          {nav.new &&
            <div className="clientDashboard-view-new">
              <div className="clientDashboard-view-new-item" onClick={() => changeView('slab', 'new')}>
                <SVGs svg={'slab'}></SVGs>
                <span>New Slab</span>
              </div>
              <div className="clientDashboard-view-new-item">
                <SVGs svg={'stopwatch'}></SVGs>
                <span>New Tracker</span>
              </div>
              <div className="clientDashboard-view-new-item">
                <SVGs svg={'box'}></SVGs>
                <span>New Product</span>
              </div>
            </div>
          }
          {
            nav.slab && 
            <div className="clientDashboard-view-slab_form-container">
              <div className="clientDashboard-view-slab_form-heading">New Slab</div>
              <form className="clientDashboard-view-slab_form">
                <div className="form-group-double-dropdown">
                  <label htmlFor="material">Material</label>
                  <div className="form-group-double-dropdown-input">
                    <textarea rows="2" name="material" placeholder="(Select Material)"></textarea>
                    <div onClick={() => (input_dropdown !== 'slab_material' ? setInputDropdown('slab_material') : setInputDropdown(''))}><SVGs svg={'dropdown-arrow'}></SVGs></div>
                    { input_dropdown == 'slab_material' &&
                    <div className="form-group-double-dropdown-input-list">
                      <div className="form-group-double-dropdown-input-list-item border_bottom"><SVGs svg={'plus'}></SVGs> Add new</div>
                      <div className="form-group-double-dropdown-input-list-item">Bianco Carrara</div>
                      <div className="form-group-double-dropdown-input-list-item">Calacatta Milano</div>
                      <div className="form-group-double-dropdown-input-list-item">Calacatta Mirragio</div>
                      <div className="form-group-double-dropdown-input-list-item">Calacatta Sierra</div>
                      <div className="form-group-double-dropdown-input-list-item">Calacatta Trevi</div>
                      <div className="form-group-double-dropdown-input-list-item">Carrara Lumos</div>
                      <div className="form-group-double-dropdown-input-list-item">White Soul</div>
                    </div>
                    }
                  </div>
                </div>
                <div className="form-group-double-dropdown">
                  <label htmlFor="material">Color Name</label>
                  <div className="form-group-double-dropdown-input">
                    <textarea rows="2" name="material" placeholder="(Select Color)"></textarea>
                    <div onClick={() => (input_dropdown !== 'slab_color' ? setInputDropdown('slab_color') : setInputDropdown(''))}><SVGs svg={'dropdown-arrow'}></SVGs></div>
                    { input_dropdown == 'slab_color' &&
                    <div className="form-group-double-dropdown-input-list">
                      <div className="form-group-double-dropdown-input-list-item border_bottom"><SVGs svg={'plus'}></SVGs> Add new</div>
                      <div className="form-group-double-dropdown-input-list-item">Summerhill</div>
                      <div className="form-group-double-dropdown-input-list-item">Agatha Black</div>
                      <div className="form-group-double-dropdown-input-list-item">Alpine Valley</div>
                      <div className="form-group-double-dropdown-input-list-item">Artic Valley</div>
                      <div className="form-group-double-dropdown-input-list-item">Aspin White</div>
                      <div className="form-group-double-dropdown-input-list-item">Peacock Green</div>
                      <div className="form-group-double-dropdown-input-list-item">Raja Pink</div>
                    </div>
                    }
                  </div>
                </div>
                <div className="form-group-triple">
                  <label htmlFor="material">Quantity</label>
                  <div className="form-group-triple-input">
                    <textarea id="quantity" rows="2" name="material" placeholder="(Quantity)" onChange={() => validateIsNumber('quantity')}></textarea>
                  </div>
                </div>
                <div className="form-group-triple">
                  <label htmlFor="material">Size</label>
                  <div className="form-group-triple-input units">
                    <span></span>
                    <textarea id="size_1" rows="2" name="material" placeholder="# cm" onChange={() => validateIsNumber('size_1')}></textarea>
                    <textarea id="size_2" rows="2" name="material" placeholder="# cm" onChange={() => validateIsNumber('size_2')}></textarea>
                  </div>
                </div>
                <div className="form-group-triple">
                  <label htmlFor="material">Thickness</label>
                  <div className="form-group-triple-input">
                    <textarea id="thickness" rows="2" name="material" placeholder="(Thickness)" onChange={() => validateIsNumber('thickness')}></textarea>
                  </div>
                </div>
                <div className="form-group-triple">
                  <label htmlFor="material">Price per Slab</label>
                  <div className="form-group-double-dropdown-input">
                    <SVGs svg={'dollar'} classprop="dollar"></SVGs>
                    <textarea id="dollar" rows="2" placeholder="0.00" className="dollar-input" value={slab.price_slab == 'NaN' ? '' : slab.price_slab} onChange={(e) => createSlab('price_slab', parseFloat(e.target.value).toFixed(2))}></textarea>
                  </div>
                </div>
                <div className="form-group-triple">
                  <label htmlFor="material">Price per Sqft</label>
                  <div className="form-group-double-dropdown-input">
                    <SVGs svg={'dollar'} classprop="dollar"></SVGs>
                    <textarea id="dollar" rows="2" placeholder="0.00" className="dollar-input" value={slab.price_sqft == 'NaN' ? '' : slab.price_sqft} onChange={(e) => createSlab('price_sqft', parseFloat(e.target.value).toFixed(2))}></textarea>
                  </div>
                </div>
                <div className="form-group-triple">
                  <label htmlFor="material">Block Number</label>
                  <div className="form-group-triple-input">
                    <textarea id="block" rows="2" placeholder="(Block #)" onChange={() => validateIsNumber('block')}></textarea>
                  </div>
                </div>
                <div className="form-group-triple">
                  <label htmlFor="material">Lot Number</label>
                  <div className="form-group-triple-input">
                    <textarea id="lot" rows="2" placeholder="(Lot #)" onChange={() => validateIsNumber('lot')}></textarea>
                  </div>
                </div>
                <div className="form-group-double-dropdown">
                  <label htmlFor="material">Location</label>
                  <div className="form-group-double-dropdown-input">
                    <textarea rows="2" name="material" placeholder="(Select Location)"></textarea>
                    <div onClick={() => (input_dropdown !== 'location' ? setInputDropdown('location') : setInputDropdown(''))}><SVGs svg={'dropdown-arrow'}></SVGs></div>
                    { input_dropdown == 'location' &&
                    <div className="form-group-double-dropdown-input-list">
                      <div className="form-group-double-dropdown-input-list-item border_bottom"><SVGs svg={'plus'}></SVGs> Add new</div>
                      <div className="form-group-double-dropdown-input-list-item">Warehouse</div>
                    </div>
                    }
                  </div>
                </div>
                <div className="form-group-triple">
                  <label htmlFor="material">Generate QR Code</label>
                  <button onClick={(e) => generateQR(e)}>Generate</button>
                  {!slab.qr_code && <img src='https://free-qr.com/images/placeholder.svg' alt="QR Code" />}
                  {slab.qr_code && <a download="qr-code.png" href={slab.qr_code} alt="QR Code" title="QR-code"><img src={slab.qr_code} alt="QR Code" /></a>}
                </div>
              </form>
            </div>
          }
        </div>
      </div>
    </>
  )
}

const mapStateToProps = state => {
  return {
    nav: state.nav,
    slab: state.slab
  }
}

const mapDispatchToProps = dispatch => {
  return {
    changeView: (type, toggle) => dispatch({type: 'CHANGE_VIEW', name: type, toggle: toggle}),
    createSlab: (type, data) => dispatch({type: 'CREATE_SLAB', name: type, value: data})
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(withUser(Dashboard))
