import {useState, useEffect, useRef} from 'react'
import SVG from '../../files/svgs'
import { manageFormFields } from '../../helpers/forms'
import { validateNumber, validatePrice, singleImage } from '../../helpers/validations'

const PriceListModal = ({
  token,
  message,
  setMessage,
  setModal,
  loading,
  setLoading,
  edit,
  dynamicSVG,
  setDynamicSVG,

  //// DATA
  allData,
  setAllData,
  editData,

  //// REDUX
  stateData,
  stateMethod,
  resetState,
  changeView,
  addImages,

  //// CRUD
  submitCreate,
  submitUpdate,
  submitDeleteFile
}) => {
  
  const createType = 'CREATE_PRICE_LIST'
  const resetType = 'RESET_PRICE_LIST'
  const imageType = 'PRICE_LIST_IMAGE'
  const myRefs = useRef(null)
  const [loadingColor, setLoadingColor] = useState('white')
  const [input_dropdown, setInputDropdown] = useState('')

  //// HANDLE MODAL DRAG
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


  // HANDLE DROPDOWNS
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
    <div 
      className="addFieldItems-modal" 
      data-value="parent" 
      onClick={(e) => e.target.getAttribute('data-value') == 'parent' ? setIsDragging(false) : null}
    >
      <div 
      className="addFieldItems-modal-box" 
      onPointerDown={handlePointerDown} 
      onPointerUp={handlePointerUp} 
      onPointerMove={handlePointerMove} 
      style={{transform: `translateX(${translate.x}px) translateY(${translate.y}px)`}}>
        <div className="addFieldItems-modal-box-header">
        <span 
          className="addFieldItems-modal-form-title">
            {edit == 'price_list' ? 
            'Edit Price List' 
            : 
            'New Price List'
            }
        </span>
        <div onClick={() => (setModal(''), resetState(resetType), setMessage(''))}>
          <SVG svg={'close'}></SVG>
        </div>
        </div>



        <form className="addFieldItems-modal-form">
          <div className="form-group-file">
            <label htmlFor="images">

            {stateData.images.length > 0 && stateData.images.map((item) => 
                <><img src={item.location}></img> {item.location} </>
            )}

            {stateData.images.length == 0 && 
              <><SVG svg={'upload'}></SVG> Upload image</>
            }

            </label>

            {stateData.images.length > 0 && stateData.images.map((item, idx) => 
            <span key={idx} className="form-group-file-close" onClick={(e) => (
                  e.stopPropagation(),
                  loading !== 'delete_image' ? 
                  submitDeleteFile(e, item, 'images', createType, stateMethod, stateData, 'prices', setMessage, 'delete_image', setLoading, token, 'price/delete-image', allData, setAllData, setDynamicSVG, editData, setModal)
                  :
                  null
              )}>
              { loading == 'delete_image' ? 
                <div className="loading-spinner"></div>
                :
                <SVG svg={'close'}></SVG>
              }
            </span>
            )}
            
            <input 
              type="file"
              id="images" 
              onChange={(e) => (
                singleImage(e, stateData, setMessage, imageType, null, addImages)
              )}
            />
          </div>

          <div className="form-group">
            <input
            onClick={() => setInputDropdown('price_supplier')} 
            value={manageFormFields(stateData.supplier, 'name')} 
            onChange={(e) => (setInputDropdown(''), stateMethod(createType, 'supplier', e.target.value))}
            readOnly
            />
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
            <div 
            onClick={() => setInputDropdown('price_supplier')}><SVG svg={'dropdown-arrow'}></SVG>
            </div>
            { input_dropdown == 'price_supplier' &&
              <div 
              className="form-group-list" 
              ref={myRefs}>
                {allData && allData.suppliers.sort( (a, b) => a.name > b.name ? 1 : -1).map( (item, idx) => (
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
            onClick={() => setInputDropdown('price_model')} 
            value={manageFormFields(stateData.model, 'name')} 
            onChange={(e) => (setInputDropdown(''), stateMethod(createType, 'model', e.target.value))}
            readOnly
            />
            <label 
            className={`input-label ` + (
              stateData.model.length > 0 || 
              typeof stateData.model == 'object' 
              ? ' labelHover' 
              : ''
            )}
            htmlFor="model">
              Model
            </label>
            <div 
            onClick={() => setInputDropdown('price_model')}><SVG svg={'dropdown-arrow'}></SVG>
            </div>
            { input_dropdown == 'price_model' &&
              <div 
              className="form-group-list" 
              ref={myRefs}>
                {allData && allData.models.sort( (a, b) => a.name > b.name ? 1 : -1).map( (item, idx) => (
                <div 
                key={idx} 
                className="form-group-list-item" 
                onClick={(e) => (stateMethod(createType, 'model', item), setInputDropdown(''))}>
                  {item.name}
                </div>
                ))}
              </div>
            }
          </div>


          <div className="form-group">
            <input
            onClick={() => setInputDropdown('price_color')} 
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
            onClick={() => setInputDropdown('price_color')}><SVG svg={'dropdown-arrow'}></SVG>
            </div>
            { input_dropdown == 'price_color' &&
              <div 
              className="form-group-list" 
              ref={myRefs}>
                {allData && allData.colors.sort( (a, b) => a.name > b.name ? 1 : -1).map( (item, idx) => (
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
            id="price" 
            value={stateData.price} 
            onChange={(e) => (validateNumber('price'), stateMethod(createType, 'price', validatePrice(e)))}
            onKeyDown={(e) => (validateNumber('price'), stateMethod(createType, 'price', validatePrice(e)))}
            />
            <label 
            className={`input-label ` + (
              stateData.price.length > 0 || 
              typeof stateData.price == 'object' 
              ? ' labelHover' 
              : ''
            )}
            htmlFor="price">
              Price
            </label>
          </div>

        {message && 
        <span className="form-group-message">
          <SVG svg={dynamicSVG} color={'#fd7e3c'}></SVG>
          {message}
        </span>
        }
      </form>


      <div className="addFieldItems-modal-box-footer">
        {!edit && 
        <button 
        className="form-group-button" 
        onClick={(e) => submitCreate(e, stateData, 'prices', 'images', setMessage, 'create_price', setLoading, token, 'price/create-price', resetType, resetState, allData, setAllData, setDynamicSVG)}
        >
            {loading == 'create_price' ? 
            <div className="loading">
              <span style={{backgroundColor: loadingColor}}></span>
              <span style={{backgroundColor: loadingColor}}></span>
              <span style={{backgroundColor: loadingColor}}></span>
            </div>
            : 
            'Save'
            }
        </button>
        }
        {edit == 'price_list' && 
        <button 
        className="form-group-button" 
        onClick={(e) => (e.preventDefault(), submitUpdate(e, stateData, 'prices', 'images', setMessage, 'update_price', setLoading, token, 'price/update-price', resetType, resetState, allData, setAllData, setDynamicSVG, changeView, 'prices', setModal))}
        >
           {loading == 'update_price' ? 
            <div className="loading">
              <span style={{backgroundColor: loadingColor}}></span>
              <span style={{backgroundColor: loadingColor}}></span>
              <span style={{backgroundColor: loadingColor}}></span>
            </div>
            : 
            'Update'
            }
        </button>
        }
      </div>
      
    </div>
    </div>
    
  )
}

export default PriceListModal
