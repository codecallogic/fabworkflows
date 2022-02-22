import { useState, useEffect, useRef } from 'react'
import SVG from '../../files/svgs'
import { manageFormFields } from '../../helpers/forms'
import { multipleFiles } from '../../helpers/validations'

const Form = ({
  token,
  title,
  dynamicSVG,
  setDynamicSVG,
  setModal,
  message, 
  setMessage,
  loading,
  setLoading,
  edit,
  setEdit,

  //// VALIDATIONS
  validateNumber,
  validatePrice,
  validateDate,
  generateQR,
  dateNow,

  //// DATA
  typeOfData,
  allData,
  setAllData,
  originalData,
  editData,
  
  //// REDUX
  stateData,
  stateMethod,
  resetState,
  addImages,
  changeView,

  ///// CRUD
  submitCreate,
  submitUpdate,
  submitDeleteFile
}) => {

  const createType = 'CREATE_SLAB'
  const resetType = 'RESET_SLAB'
  const imagesType = 'ADD_SLAB_IMAGES'
  const myRefs = useRef(null)
  const [loadingColor, setLoadingColor] = useState('black')
  const [input_dropdown, setInputDropdown] = useState('')
  const [save, setSave] = useState(false)

  useEffect(() => {
    
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
        <div className="table-header-title">
          {edit == typeOfData ? 'Edit Slab' : title}
        </div>
        {save &&
          <div className="table-header-controls">
            <div 
            id="save" 
            className="table-header-controls-item" 
            onClick={(e) => edit == typeOfData ? 
              submitUpdate(e, stateData, 'slabs', 'images', setMessage, 'create_slab', setLoading, token, 'slabs/update-slab', resetType, resetState, allData, setAllData, setDynamicSVG, changeView, 'slabs')
              : 
              submitCreate(e, stateData, 'slabs', 'images', setMessage, 'create_slab', setLoading, token, 'slabs/create-slab', resetType, resetState, allData, setAllData, setDynamicSVG) 
            }
            >
              {loading == 'create_slab' ? 
              <div className="loading">
                <span style={{backgroundColor: loadingColor}}></span>
                <span style={{backgroundColor: loadingColor}}></span>
                <span style={{backgroundColor: loadingColor}}></span>
              </div>
              : 
                edit == typeOfData ? 'Update' : 'Save'
              }
            </div>
            <div 
            id="reset" 
            className="table-header-controls-item" 
            onClick={() => (setLoading(''), resetState(resetType), setMessage(''), setEdit(''))}
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
              onChange={(e) => (setInputDropdown(''), stateMethod(createType, 'material', e.target.value))}
              readOnly
              />
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
                onChange={(e) => (setInputDropdown(''), stateMethod(createType, 'color', e.target.value))}
                readOnly
                />
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

          <button 
          className={`form-group-button ` + 
          (stateData.ordered_status 
            ? stateData.ordered_status.split(',')[0] == 'Ordered' 
            ? ` selected` 
            : '' 
            : ''
          )}
          onClick={(e) => (e.preventDefault(), stateData.ordered_status 
            ? 
            stateMethod(createType, 'ordered_status', '') 
            : 
            stateMethod(createType, 'ordered_status', `Ordered, ${dateNow()}`
          ))}
          >
             {stateData.ordered_status ? 
             stateData.ordered_status.split(',')[0] == 'Ordered' 
             ? stateData.ordered_status 
             : 'Timestamp Order' 
             : 'Timestamp Order'
             }
          </button>

          <button 
          className={`form-group-button ` + 
          (stateData.received_status 
            ? stateData.received_status.split(',')[0] == 'Received' 
            ? ` selected` 
            : '' 
            : ''
          )}
          onClick={(e) => (e.preventDefault(), stateData.received_status 
            ? 
            stateMethod(createType, 'received_status', '') 
            : 
            stateMethod(createType, 'received_status', `Received, ${dateNow()}`
          ))}
          >
             {stateData.received_status ? 
             stateData.received_status.split(',')[0] == 'Received' 
             ? stateData.received_status 
             : 'Timestamp Processing' 
             : 'Timestamp Processing'
             }
          </button>

          <button 
          className={`form-group-button ` + 
          (stateData.delivered_status 
            ? stateData.delivered_status.split(',')[0] == 'Delivered' 
            ? ` selected` 
            : '' 
            : ''
          )}
          onClick={(e) => (e.preventDefault(), stateData.delivered_status 
            ? 
            stateMethod(createType, 'delivered_status', '') 
            : 
            stateMethod(createType, 'delivered_status', `Delivered, ${dateNow()}`
          ))}
          >
             {stateData.delivered_status ? 
             stateData.delivered_status.split(',')[0] == 'Delivered' 
             ? stateData.delivered_status 
             : 'Timestamp Delivery' 
             : 'Timestamp Delivery'
             }
          </button>

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
              onChange={(e) => multipleFiles(e, stateData, 'images', setMessage, imagesType, 'images', addImages)}
              />
            </label>
          </div>
          <div className="form-box-container">
            <div className="form-group-gallery">
              { stateData.images.length == 0 &&
                 <a 
                 className="form-group-gallery-link"
                 target="_blank" 
                 rel="noreferrer"
                 style={{width: '48%'}}
                 >
                   <img 
                   className="form-group-gallery-image"
                   src='https://via.placeholder.com/300'
                   />
                 </a>
              }
              {stateData.images.length > 0 && stateData.images.map((item, idx) => (
                <a 
                key={idx} 
                onClick={() => window.open(item.location, '_blank')}
                className="form-group-gallery-link"
                target="_blank" 
                rel="noreferrer"
                style={{width: '48%'}}
                >
                  <img 
                  className="form-group-gallery-image"
                  src={item.location}
                  />
                  <span onClick={(e) => (e.stopPropagation(), loading !== 'delete_image' ? 
                    submitDeleteFile(e, item, 'images', createType, stateMethod, stateData, 'slabs', setMessage, 'delete_image', setLoading, token, 'slabs/delete-image', allData, setAllData, setDynamicSVG, editData) 
                    : null)
                  }>
                  { loading == 'delete_image' ? 
                    <div className="loading-spinner"></div>
                    :
                    <SVG svg={'close'}></SVG>
                  }
                  </span>
                </a>
              ))}
            </div>
          </div>
        </div>

      </form>
    </div>
  )
}

export default Form
