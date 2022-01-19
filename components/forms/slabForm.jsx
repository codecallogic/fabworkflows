import {useState, useEffect, useRef} from 'react'
import SVG from '../../files/svgs'
import {manageFormFields} from '../../helpers/forms'

const Form = ({
  token,
  title,
  modal,
  setModal,
  message, 
  setMessage,
  loading,
  setLoading,

  //// DATA
  allData,
  setAllData,
  originalData,
  
  //// REDUX
  stateData,
  stateMethod,
  resetState,

  ///// CRUD
  submitCreate,
}) => {

  const myRefs = useRef(null)
  const loadingColor = 'black'
  const [input_dropdown, setInputDropdown] = useState('')
  const [save, setSave] = useState(false)

  useEffect(() => {

    const isEmpty = Object.values(stateData).every(x => x === '' || x.length === 0)
    if(!isEmpty) setSave(true)
    if(isEmpty) setSave(false)

  }, [stateData])

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
  
  return (
    <div className="table">
      <div className="table-header">
        <div className="table-header-title">{title}</div>
        {save &&
          <div className="table-header-controls">
            <div 
            id="save" 
            className="table-header-controls-item" 
            onClick={(e) => submitCreate(e, stateData, 'slabs', setMessage, setLoading, token, 'slabs/create-slab', resetState, allData, setAllData)}
            >
              {loading == 'create_slab' ? 
              <div className="loading">
                <span style={{backgroundColor: loadingColor}}></span>
                <span style={{backgroundColor: loadingColor}}></span>
                <span style={{backgroundColor: loadingColor}}></span>
              </div>
              : 
              'Save'
              }
            </div>
            <div 
            id="reset" 
            className="table-header-controls-item" 
            onClick={null}
            >
              Reset
            </div>
          </div>
        }
        { message && 
          <div className="table-header-error">
            <SVG svg={'notification'}></SVG> 
            <span>{message.substr(0, 200)}</span>
          </div>
        }
      </div>
      <form 
        className="table-forms" onSubmit={null}
      >
        <div className="form-box">
          <div className="form-box-heading"></div>
            <div className="form-group">
              <input
              onClick={() => setInputDropdown('slab_material')} 
              value={manageFormFields(stateData.material, 'name')} 
              onChange={(e) => (setInputDropdown(''), stateMethod('material', e.target.value))}/>
              <label 
              className={`input-label ` + (
                stateData.material.length > 0 || 
                typeof stateData.material == 'object' 
                ? ' labelHover' 
                : ''
              )}
              htmlFor="material">
                Material
              </label>
              <div 
              onClick={() => (input_dropdown !== 'slab_material' ? setInputDropdown('slab_material') : setInputDropdown(''))}><SVG svg={'dropdown-arrow'}></SVG>
              </div>
              { input_dropdown == 'slab_material' &&
                <div 
                className="form-group-list" 
                ref={myRefs}>
                  <div 
                  className="form-group-list-item" 
                  onClick={() => (setInputDropdown(''), setModal('add_material'))}>
                    <SVG svg={'plus'}></SVG> 
                    Add new
                  </div>
                  {originalData && originalData.materials.sort( (a, b) => a.name > b.name ? 1 : -1).map( (item, idx) => (
                  <div 
                  key={idx} 
                  className="form-group-list-item" 
                  onClick={(e) => (stateMethod('material', item), setInputDropdown(''))}>
                    {item.name}
                  </div>
                  ))}
                </div>
              }
            </div>
            <div className="form-group">
                <input 
                onClick={() => setInputDropdown('slab_color')} 
                value={manageFormFields(stateData.color, 'name')} 
                onChange={(e) => (setInputDropdown(''), stateMethod('color', e.target.value))}/>
                <label 
                 className={`input-label ` + (
                  stateData.color.length > 0 || 
                  typeof stateData.color == 'object' 
                  ? ' labelHover' 
                  : ''
                )}
                htmlFor="color">
                  Color
                </label>
                <div 
                onClick={() => (input_dropdown !== 'slab_color' ? setInputDropdown('slab_color') : setInputDropdown(''))}>
                <SVG svg={'dropdown-arrow'}></SVG>
                </div>
                { input_dropdown == 'slab_color' &&
                  <div 
                  className="form-group-list" 
                  ref={myRefs}>
                  <div 
                  className="form-group-list-item" 
                  onClick={() => (setInputDropdown(''), setModal('add_color'))}>
                    <SVG svg={'plus'}></SVG> 
                    Add new
                  </div>
                    {originalData && originalData.colors.sort( (a, b) => a.name > b.name ? 1 : -1).map( (item, idx) => (
                    <div 
                    key={idx} 
                    className="form-group-list-item" 
                    onClick={(e) => (stateMethod('color', item), setInputDropdown(''))}>
                      {item.name}
                    </div>
                    ))}
                  </div>
                }
            </div>
        </div>
        {/* <div className="form-group-triple">
          <label htmlFor="quantity">Quantity</label>
          <div className="form-group-triple-input">
            <textarea id="quantity" rows="1" wrap="off" onKeyDown={(e) => e.keyCode == 13 ? e.preventDefault() : null} name="quantity" placeholder="(Quantity)" value={slab.quantity} onChange={(e) => (validateIsNumber('quantity'), createSlab('quantity', e.target.value))} required></textarea>
          </div>
        </div>
        <div className="form-group-triple">
          <label htmlFor="size_1">Size</label>
          <div className="form-group-triple-input units">
            <span></span>
            <textarea id="size_1" rows="1" wrap="off" onKeyDown={(e) => e.keyCode == 13 ? e.preventDefault() : null} name="size_1" placeholder="# in" value={slab.size_1} onChange={(e) => (validateIsNumber('size_1'), createSlab('size_1', e.target.value))} required></textarea>
            <textarea id="size_2" rows="1" wrap="off" onKeyDown={(e) => e.keyCode == 13 ? e.preventDefault() : null} name="size_2" placeholder="# in" value={slab.size_2} onChange={(e) => (validateIsNumber('size_2'), createSlab('size_2', e.target.value))} required></textarea>
          </div>
        </div>
        <div className="form-group-triple">
          <label htmlFor="thickness">Thickness</label>
          <div className="form-group-triple-input">
            <textarea id="thickness" rows="1" wrap="off" onKeyDown={(e) => e.keyCode == 13 ? e.preventDefault() : null} name="thickness" placeholder="(Thickness)" value={slab.thickness} onChange={(e) => (validateIsNumber('thickness'), createSlab('thickness', e.target.value))} required></textarea>
          </div>
        </div>
        <div className="form-group-double-dropdown">
          <label htmlFor="grade">Grade</label>
          <div className="form-group-double-dropdown-input">
            <textarea rows="1" wrap="off" onKeyDown={(e) => e.keyCode == 13 ? e.preventDefault() : null} name="grade" placeholder="(Select Grade)" onClick={() => (setInputDropdown(''), setInputDropdown('slab_grade'))} value={slab.grade} onChange={(e) => createSlab('grade', e.target.value)}></textarea>
            <div onClick={() => (input_dropdown !== 'slab_grade' ? setInputDropdown('slab_grade') : setInputDropdown(''))}><SVG svg={'dropdown-arrow'}></SVG></div>
            { input_dropdown == 'slab_grade' &&
            <div className="form-group-double-dropdown-input-list" ref={myRefs}>
              <div className="form-group-double-dropdown-input-list-item" onClick={(e) => (createSlab('grade', e.target.innerText), setInputDropdown(''))}>A</div>
              <div className="form-group-double-dropdown-input-list-item" onClick={(e) => (createSlab('grade', e.target.innerText), setInputDropdown(''))}>B</div>
              <div className="form-group-double-dropdown-input-list-item" onClick={(e) => (createSlab('grade', e.target.innerText), setInputDropdown(''))}>C</div>
            </div>
            }
          </div>
        </div>
        <div className="form-group-double-dropdown">
          <label htmlFor="finish">Finish</label>
          <div className="form-group-double-dropdown-input">
            <textarea rows="1" wrap="off" onKeyDown={(e) => e.keyCode == 13 ? e.preventDefault() : null} name="finish" placeholder="(Select Finish)" onClick={() => setInputDropdown('slab_finish')} value={slab.finish} onChange={(e) => (setInputDropdown(''), createSlab('finish', e.target.value))}></textarea>
            <div onClick={() => (input_dropdown !== 'slab_finish' ? setInputDropdown('slab_finish') : setInputDropdown(''))}><SVG svg={'dropdown-arrow'}></SVG></div>
            { input_dropdown == 'slab_finish' &&
            <div className="form-group-double-dropdown-input-list" ref={myRefs}>
              <div className="form-group-double-dropdown-input-list-item" onClick={(e) => (createSlab('finish', e.target.innerText), setInputDropdown(''))}>Brushed</div>
              <div className="form-group-double-dropdown-input-list-item" onClick={(e) => (createSlab('finish', e.target.innerText), setInputDropdown(''))}>Polished</div>
              <div className="form-group-double-dropdown-input-list-item" onClick={(e) => (createSlab('finish', e.target.innerText), setInputDropdown(''))}>Honed</div>
              <div className="form-group-double-dropdown-input-list-item" onClick={(e) => (createSlab('finish', e.target.innerText), setInputDropdown(''))}>Leather</div>
            </div>
            }
          </div>
        </div>
        <div className="form-group-triple">
          <label htmlFor="price_slab">Price per Slab</label>
          <div className="form-group-double-dropdown-input">
            <SVG svg={'dollar'} classprop="dollar"></SVG>
            <textarea id="price_slab" rows="1" wrap="off" onKeyDown={(e) => e.keyCode == 13 ? e.preventDefault() : null} placeholder="0.00" className="dollar-input" value={slab.price_slab == 'NaN' ? '' : slab.price_slab.replace("$", "")} onChange={(e) => createSlab('price_slab', validateIsPrice(e))} required></textarea>
          </div>
        </div>
        <div className="form-group-triple">
          <label htmlFor="price_sqft">Price per Sqft</label>
          <div className="form-group-double-dropdown-input">
            <SVG svg={'dollar'} classprop="dollar"></SVG>
            <textarea id="price_sqft" rows="1" wrap="off" onKeyDown={(e) => e.keyCode == 13 ? e.preventDefault() : null} placeholder="0.00" className="dollar-input" value={slab.price_sqft == 'NaN' ? '' : slab.price_sqft.replace("$", "")} onChange={(e) => createSlab('price_sqft', validateIsPrice(e))} required></textarea>
          </div>
        </div>
        <div className="form-group-triple">
          <label htmlFor="block">Block Number</label>
          <div className="form-group-triple-input">
            <textarea id="block" rows="1" wrap="off" onKeyDown={(e) => e.keyCode == 13 ? e.preventDefault() : null} placeholder="(Block #)" value={slab.block} onChange={(e) => (validateIsNumber('block'), createSlab('block', e.target.value))} required></textarea>
          </div>
        </div>
        <div className="form-group-double-dropdown">
          <label htmlFor="supplier">Supplier</label>
          <div className="form-group-double-dropdown-input">
            <textarea rows="1" wrap="off" onKeyDown={(e) => e.keyCode == 13 ? e.preventDefault() : null} name="supplier" placeholder="(Select Supplier)" onClick={() => setInputDropdown('supplier')} value={slab.supplier} onChange={(e) => (setInputDropdown(''), createSlab('supplier', e.target.value))} required></textarea>
            <div onClick={() => (input_dropdown !== 'supplier' ? setInputDropdown('supplier') : setInputDropdown(''))}><SVG svg={'dropdown-arrow'}></SVG></div>
            { input_dropdown == 'supplier' &&
            <div className="form-group-double-dropdown-input-list" ref={myRefs}>
              <div className="form-group-double-dropdown-input-list-item border_bottom" onClick={() => (setInputDropdown(''), setModal('add_supplier'))}><SVG svg={'plus'}></SVG> Add new</div>
              {allSuppliers && allSuppliers.sort( (a, b) => a.name > b.name ? 1 : -1).map( (item, idx) => (
              <div key={idx} className="form-group-double-dropdown-input-list-item" onClick={(e) => (createSlab('supplier', e.target.innerText), setInputDropdown(''))}>{item.name}</div>
              ))}
            </div>
            }
          </div>
        </div>
        <div className="form-group-double-dropdown">
          <label htmlFor="location">Location</label>
          <div className="form-group-double-dropdown-input">
            <textarea rows="1" wrap="off" onKeyDown={(e) => e.keyCode == 13 ? e.preventDefault() : null} name="location" placeholder="(Select Location)" value={slab.location} onClick={() => setInputDropdown('location')} onChange={(e) => (setInputDropdown(''), createSlab('location', e.target.value))} required></textarea>
            <div onClick={() => (input_dropdown !== 'location' ? setInputDropdown('location') : setInputDropdown(''))}><SVG svg={'dropdown-arrow'}></SVG></div>
            { input_dropdown == 'location' &&
            <div className="form-group-double-dropdown-input-list" ref={myRefs}>
              <div className="form-group-double-dropdown-input-list-item border_bottom" onClick={() => (setInputDropdown(''), setModal('add_location'))}><SVG svg={'plus'}></SVG> Add new</div>
              {allLocations && allLocations.sort( (a, b) => a.name > b.name ? 1 : -1).map( (item, idx) => (
              <div key={idx} className="form-group-double-dropdown-input-list-item" onClick={(e) => (createSlab('location', e.target.innerText), setInputDropdown(''))}>{item.name}</div>
              ))}
            </div>
            }
          </div>
        </div>
        <div className="form-group-triple">
          <label htmlFor="lot">Lot Number</label>
          <div className="form-group-triple-input">
            <textarea id="lot" rows="1" wrap="off" onKeyDown={(e) => e.keyCode == 13 ? e.preventDefault() : null} placeholder="(Lot #)" value={slab.lot_number} onChange={(e) => (createSlab('lot_number', e.target.value))} required></textarea>
          </div>
        </div>
        <div className="form-group-triple">
          <label htmlFor="delivery_date">Delivery Date</label>
          <div className="form-group-triple-input">
            <textarea id="delivery_date" rows="1" wrap="off" onKeyDown={(e) => e.keyCode == 13 ? e.preventDefault() : null} placeholder="(Delivery Date)" name="delivery_date" value={slab.delivery_date} onChange={(e) => handleDate(e)} required></textarea>
          </div>
        </div>
        <div className="form-group-triple-dropdown"></div>
        <div className="form-group-triple-qr">
          <label htmlFor="qr_code">Generate QR Code</label>
          <button onClick={(e) => generateQRSlab(e)}>Generate</button>
          {!slab.qr_code && <img className="form-group-triple-qr-image-2" src='https://free-qr.com/images/placeholder.svg' alt="QR Code" />}
          {slab.qr_code && <a download="qr-code.png" href={slab.qr_code} alt="QR Code" title="QR-code"><img src={slab.qr_code} alt="QR Code" className="form-group-triple-qr-image" /></a>}
        </div>
        <div className="form-group-triple form-group-triple-upload">
          {selectedFiles.length < 1 && 
          <>
            <label htmlFor="files_upload" className="form-group-triple-upload-add">
              <SVG svg={'upload'}></SVG> 
              Browse Files
            </label>
            <input type="file" name="files_upload" accept="image/*" id="files_upload" multiple onChange={(e) => multipleFileChangeHandler(e, 'slab')}/>
          </>
          }
          {selectedFiles.length > 0 && <>
            <div className="form-group-triple-upload-item-container">
            {selectedFiles.map((item, idx) => (
              <a className="form-group-triple-upload-item" href={item.location} target="_blank" rel="noreferrer" key={idx}>
                <div>{item.location ? <img src={item.location}></img> : <SVG svg={'file-image'}></SVG>} </div>
              </a>
            ))}
            </div>
            {imageCount < 3 && 
              <>
              <label htmlFor="files_upload" className="form-group-triple-upload-more">
                <SVG svg={'upload'}></SVG> 
                Add more
              </label>
              <input type="file" name="files_upload" accept="image/*" id="files_upload" multiple onChange={(e) => multipleFileChangeHandler(e, 'slab')}/>
              </>
            }
            {imageCount == 3 && 
              <>
              <label onClick={() => (setSelectedFiles([]), setImageCount(0), addSlabImages([]))} className="form-group-triple-upload-more">
                <SVG svg={'reset'}></SVG> 
                Reset
              </label>
              </>
            }
            </>
          }
        </div>
        <div className="form-group-triple-button-list">
          <label htmlFor="material">Order Status</label>
          <div className="form-group-triple-button-list">
            <div className={`form-group-triple-button-list-item ` + (slab.ordered_status ? slab.ordered_status.split(',')[0] == 'Ordered' ? ` selected` : null : null)} onClick={(e) => (slab.ordered_status ? createSlab('ordered_status', '') : createSlab('ordered_status', `Ordered, ${dateNow()}`), setInputDropdown(''))}>{slab.ordered_status ? slab.ordered_status.split(',')[0] == 'Ordered' ? slab.ordered_status : 'Ordered' : 'Ordered'}</div>
            <div className={`form-group-triple-button-list-item ` + (slab.received_status ? slab.received_status.split(',')[0] == 'Received' ? ` selected` : null : null)} onClick={(e) => (slab.delivered_status ? createSlab('received_status', '') : createSlab('received_status', `Received, ${dateNow()}`), setInputDropdown(''))}>{slab.received_status ? slab.received_status.split(',')[0] == 'Received' ? slab.received_status : 'Received' : 'Received'}</div>
            <div className={`form-group-triple-button-list-item ` + (slab.delivered_status ? slab.delivered_status.split(',')[0] == 'Delivered' ? ` selected` : null : null)} onClick={(e) => (slab.delivered_status ? createSlab('delivered_status', '') : createSlab('delivered_status', `Delivered, ${dateNow()}`), setInputDropdown(''))}>{slab.delivered_status ? slab.delivered_status.split(',')[0] == 'Delivered' ? slab.delivered_status : 'Delivered' : 'Delivered'}</div>
          </div>
        </div>
        <div className="form-button-container">
          <button type="submit" className="form-button" onClick={() => setError('Please complete entire form')}>{!loading && <span>Add Slab</span>}{loading && <div className="loading"><span></span><span></span><span></span></div>}</button>
          <div className="form-error-container">
          {error && <span className="form-error" id="error-message"><SVG svg={'error'}></SVG> {error}</span>}
          </div>
        </div> */}
      </form>
    </div>
  )
}

export default Form
