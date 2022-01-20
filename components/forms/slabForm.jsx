import {useState, useEffect, useRef} from 'react'
import SVG from '../../files/svgs'
import {manageFormFields} from '../../helpers/forms'

const Form = ({
  token,
  title,
  dynamicSVG,
  setDynamicSVG,
  modal,
  setModal,
  message, 
  setMessage,
  loading,
  setLoading,

  //// VALIDATIONS
  validateNumber,
  validatePrice,
  validateDate,
  generateQR,
  multipleImages,

  //// DATA
  allData,
  setAllData,
  originalData,
  
  //// REDUX
  stateData,
  stateMethod,
  resetState,
  addImages,

  ///// CRUD
  submitCreate,
}) => {

  const createType = 'CREATE_SLAB'
  const resetType = 'RESET_SLAB'
  const imagesType = 'ADD_SLAB_IMAGES'
  const myRefs = useRef(null)
  const [loadingColor, setLoadingColor] = useState('black')
  const [input_dropdown, setInputDropdown] = useState('')
  const [save, setSave] = useState(false)

  useEffect(() => {
    console.log(stateData)
    const isEmpty = Object.values(stateData).every( x => x === '' || x.length < 1)
    
    if(!isEmpty) return (setMessage(''), setSave(true))
    if(isEmpty) return setSave(false)

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
            onClick={(e) => submitCreate(e, stateData, 'slabs', setMessage, setLoading, token, 'slabs/create-slab', resetType, resetState, allData, setAllData, setDynamicSVG)}
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
            onClick={() => (resetState(resetType), setMessage(''))}
            >
              Reset
            </div>
          </div>
        }
        { message && 
          <div className="table-header-error">
            <SVG svg={dynamicSVG}></SVG> 
            <span>{message.substr(0, 200)}</span>
          </div>
        }
      </div>
      <form className="table-forms" onSubmit={null}>





        <div className="form-box" style={{width: '49%'}}>
          <div className="form-box-heading"></div>
          <div className="form-box-container">
            <div className="form-group">
              <input
              onClick={() => setInputDropdown('slab_material')} 
              value={manageFormFields(stateData.material, 'name')} 
              onChange={(e) => (setInputDropdown(''), stateMethod(createType, 'material', e.target.value))}/>
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
              onClick={() => setInputDropdown('slab_material')}><SVG svg={'dropdown-arrow'}></SVG>
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
                  onClick={(e) => (stateMethod(createType, 'material', item), setInputDropdown(''))}>
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
                onChange={(e) => (setInputDropdown(''), stateMethod(createType, 'color', e.target.value))}/>
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
                onClick={() =>setInputDropdown('slab_color') }>
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
                    onClick={(e) => (stateMethod(createType, 'color', item), setInputDropdown(''))}>
                      {item.name}
                    </div>
                    ))}
                  </div>
                }
            </div>
            <div className="form-group">
              <input 
                id="quantity" 
                value={stateData.quantity} 
                onChange={(e) => (validateNumber('quantity'), stateMethod(createType, 'quantity', e.target.value))}
              />
             <label 
              className={`input-label ` + (
                stateData.quantity.length > 0 || 
                typeof stateData.quantity == 'object' 
                ? ' labelHover' 
                : ''
              )}
              htmlFor="quantity">
                Quantity
              </label>
            </div>
            <div className="form-group">
                <input 
                id="size_1" 
                value={stateData.size_1} 
                onChange={(e) => (validateNumber('size_1'), stateMethod(createType, 'size_1', e.target.value))}/>
               
                <label 
                className={`input-label ` + (
                  stateData.size_1.length > 0 || 
                  typeof stateData.size_1 == 'object' 
                  ? ' labelHover' 
                  : ''
                )}
                htmlFor="size_1">
                  Size 1
                </label>
            </div>
            <div className="form-group">
                <input 
                id="size_2" 
                value={stateData.size_2} 
                onChange={(e) => (validateNumber('size_2'), stateMethod(createType, 'size_2', e.target.value))}/>
               
                <label 
                className={`input-label ` + (
                  stateData.size_2.length > 0 || 
                  typeof stateData.size_2 == 'object' 
                  ? ' labelHover' 
                  : ''
                )}
                htmlFor="size_2">
                  Size 2
                </label>
            </div>
            <div className="form-group">
              <input 
              id="thickness" 
              value={stateData.thickness} 
              onChange={(e) => (validateNumber('thickness'), stateMethod(createType, 'thickness', e.target.value))}/>
              
              <label 
              className={`input-label ` + (
                stateData.thickness.length > 0 || 
                typeof stateData.thickness == 'object' 
                ? ' labelHover' 
                : ''
              )}
              htmlFor="thickness">
                Thickness
              </label>
            </div>
            </div>
        </div>




        <div className="form-box" style={{width: '49%'}}>
          <div className="form-box-heading"></div>
          <div className="form-box-container">
          <div className="form-group">
            <input 
            onClick={() => setInputDropdown('slab_supplier')} 
            value={manageFormFields(stateData.supplier, 'name')} 
            onChange={(e) => (setInputDropdown(''), stateMethod(createType, 'supplier', e.target.value))}/>
            <label 
              className={`input-label ` + (
              stateData.supplier.length > 0 || 
              typeof stateData.supplier == 'object' 
              ? ' labelHover' 
              : ''
            )}
            htmlFor="supplier">
              Supplier
            </label>
            <div onClick={() => setInputDropdown('slab_supplier')}>
            <SVG svg={'dropdown-arrow'}></SVG>
            </div>
            { input_dropdown == 'slab_supplier' &&
              <div 
              className="form-group-list" 
              ref={myRefs}>
              <div 
              className="form-group-list-item" 
              onClick={() => (setInputDropdown(''), setModal('add_supplier'))}>
                <SVG svg={'plus'}></SVG> 
                Add new
              </div>
                {originalData && originalData.suppliers.sort( (a, b) => a.name > b.name ? 1 : -1).map( (item, idx) => (
                <div 
                key={idx} 
                className="form-group-list-item" 
                onClick={(e) => (stateMethod(createType, 'supplier', item), setInputDropdown(''))}>
                  {item.name}
                </div>
                ))}
              </div>
            }
          </div>
          <div className="form-group">
            <input
            onClick={() => setInputDropdown('slab_grade')} 
            value={stateData.grade} 
            onChange={(e) => (setInputDropdown(''), stateMethod(createType, 'grade', e.target.value))}/>
            <label 
            className={`input-label ` + (
              stateData.grade.length > 0 || 
              typeof stateData.grade == 'object' 
              ? ' labelHover' 
              : ''
            )}
            htmlFor="grade">
              Grade
            </label>
            <div 
            onClick={() => setInputDropdown('slab_grade')}><SVG svg={'dropdown-arrow'}></SVG>
            </div>
            { input_dropdown == 'slab_grade' &&
              <div 
              className="form-group-list" 
              ref={myRefs}>
                <div 
                className="form-group-list-item" 
                onClick={(e) => (setInputDropdown(''), stateMethod(createType, 'grade', e.target.innerText))}>
                  A
                </div>
                <div 
                className="form-group-list-item" 
                onClick={(e) => (setInputDropdown(''), stateMethod(createType, 'grade', e.target.innerText))}>
                  B
                </div>
                <div 
                className="form-group-list-item" 
                onClick={(e) => (setInputDropdown(''), stateMethod(createType, 'grade', e.target.innerText))}>
                  C
                </div>
              </div>
            }
          </div>
          <div className="form-group">
            <input
            onClick={() => setInputDropdown('slab_finish')} 
            value={stateData.finish} 
            onChange={(e) => (setInputDropdown(''), stateMethod(createType, 'finish', e.target.value))}/>
            <label 
            className={`input-label ` + (
              stateData.finish.length > 0 || 
              typeof stateData.finish == 'object' 
              ? ' labelHover' 
              : ''
            )}
            htmlFor="finish">
              Finish
            </label>
            <div 
            onClick={() => setInputDropdown('slab_finish')}><SVG svg={'dropdown-arrow'}></SVG>
            </div>
            { input_dropdown == 'slab_finish' &&
              <div 
              className="form-group-list" 
              ref={myRefs}>
                <div 
                className="form-group-list-item" 
                onClick={(e) => (setInputDropdown(''), stateMethod(createType, 'finish', e.target.innerText))}>
                  Brushed
                </div>
                <div 
                className="form-group-list-item" 
                onClick={(e) => (setInputDropdown(''), stateMethod(createType, 'finish', e.target.innerText))}>
                  Polished
                </div>
                <div 
                className="form-group-list-item" 
                onClick={(e) => (setInputDropdown(''), stateMethod(createType, 'finish', e.target.innerText))}>
                  Honed
                </div>
                <div 
                className="form-group-list-item" 
                onClick={(e) => (setInputDropdown(''), stateMethod(createType, 'finish', e.target.innerText))}>
                  Polished
                </div>
                <div 
                className="form-group-list-item" 
                onClick={(e) => (setInputDropdown(''), stateMethod(createType, 'finish', e.target.innerText))}>
                  Leather
                </div>
              </div>
            }
          </div>
          <div className="form-group">
            <input 
            id="price_slab" 
            value={stateData.price_slab} 
            onChange={(e) => (stateMethod(createType, 'price_slab', validatePrice(e)))}/>
            <label 
            className={`input-label ` + (
              stateData.price_slab.length > 0 || 
              typeof stateData.price_slab == 'object' 
              ? ' labelHover' 
              : ''
            )}
            htmlFor="price_slab">
              Slab Price
            </label>
          </div>
          <div className="form-group">
            <input 
            id="price_sqft" 
            value={stateData.price_sqft} 
            onChange={(e) => (stateMethod(createType, 'price_sqft', validatePrice(e)))}/>
            <label 
            className={`input-label ` + (
              stateData.price_sqft.length > 0 || 
              typeof stateData.price_sqft == 'object' 
              ? ' labelHover' 
              : ''
            )}
            htmlFor="price_sqft">
              Price per sqft
            </label>
          </div>
          <div className="form-group">
            <input 
            id="block" 
            value={stateData.block} 
            onChange={(e) => (validateNumber('block'), stateMethod(createType, 'block', e.target.value))}/>
            <label 
            className={`input-label ` + (
              stateData.block.length > 0 || 
              typeof stateData.block == 'object' 
              ? ' labelHover' 
              : ''
            )}
            htmlFor="block">
              Block
            </label>
          </div>
          </div>
        </div>






        <div className="form-box" style={{width: '33%'}}>
          <div className="form-box-heading"></div>
          <div className="form-box-container">
          <div className="form-group">
            <input 
            onClick={() => setInputDropdown('slab_location')} 
            value={manageFormFields(stateData.location, 'name')} 
            onChange={(e) => (setInputDropdown(''), stateMethod(createType, 'location', e.target.value))}/>
            <label 
              className={`input-label ` + (
              stateData.location.length > 0 || 
              typeof stateData.location == 'object' 
              ? ' labelHover' 
              : ''
            )}
            htmlFor="location">
              Location
            </label>
            <div onClick={() => setInputDropdown('slab_location')}>
            <SVG svg={'dropdown-arrow'}></SVG>
            </div>
            { input_dropdown == 'slab_location' &&
              <div 
              className="form-group-list" 
              ref={myRefs}>
              <div 
              className="form-group-list-item" 
              onClick={() => (setInputDropdown(''), setModal('add_location'))}>
                <SVG svg={'plus'}></SVG> 
                Add new
              </div>
                {originalData && originalData.locations.sort( (a, b) => a.name > b.name ? 1 : -1).map( (item, idx) => (
                <div 
                key={idx} 
                className="form-group-list-item" 
                onClick={(e) => (stateMethod(createType, 'location', item), setInputDropdown(''))}>
                  {item.name}
                </div>
                ))}
              </div>
            }
          </div>
          <div className="form-group">
            <input 
            id="lot_number" 
            value={stateData.lot_number} 
            onChange={(e) => stateMethod(createType, 'lot_number', e.target.value)}/>
            <label 
            className={`input-label ` + (
              stateData.lot_number.length > 0 || 
              typeof stateData.lot_number == 'object' 
              ? ' labelHover' 
              : ''
            )}
            htmlFor="lot_number">
              Lot Number
            </label>
          </div>
          <div className="form-group">
            <input 
            id="delivery_date" 
            value={stateData.delivery_date} 
            onChange={(e) => validateDate(e, 'delivery_date', createType, stateMethod)}/>
            <label 
            className={`input-label ` + (
              stateData.delivery_date.length > 0 || 
              typeof stateData.delivery_date == 'object' 
              ? ' labelHover' 
              : ''
            )}
            htmlFor="delivery_date">
              Delivery Date
            </label>
          </div>
          <button className="form-group-button" onClick={(e) => generateQR(e, 'slabQRCode', stateData, createType, stateMethod, setMessage, setDynamicSVG)}>Generate</button>
          {!stateData.qr_code && 
            <img 
            className="form-group-image" 
            src='https://free-qr.com/images/placeholder.svg' 
            alt="QR Code"
            />
          }
          {stateData.qr_code && 
            <a
            className="form-group-image"
            download="qr-code.png" 
            href={stateData.qr_code} 
            alt="QR Code" 
            title="QR-code"
            >
              <img 
              src={stateData.qr_code} 
              alt="QR Code" 
              className="form-group-image"
              />
            </a>
          }
          </div>
        </div>




        <div className="form-box" style={{width: '66%'}}>
          <div className="form-box-heading">
            <label htmlFor="imageFiles" className="form-box-heading-item">
              <SVG svg={'upload'}></SVG> Upload Images
              <input 
              id="imageFiles" 
              type="file" 
              accept="image/*" 
              multiple
              onChange={(e) => multipleImages(e, stateData, setMessage, imagesType, addImages)}
              />
            </label>
          </div>
          <div className="form-box-container">
            <div className="form-group-gallery">
              {stateData.images.length > 0 && stateData.images.map((item, idx) => (
                <a 
                key={idx} 
                href={item.location} 
                className="form-group-gallery-link"
                target="_blank" 
                rel="noreferrer"
                style={{width: '48%'}}
                >
                  <img 
                  className="form-group-gallery-image"
                  src={item.location}
                  />
                </a>
              ))}
            </div>
          </div>
        </div>
         {/* <div className="form-group-triple-button-list">
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