import {useState, useEffect, useRef} from 'react'
import SVG from '../../files/svgs'
import { manageFormFields } from '../../helpers/forms'
import { validateNumber, generateRandomNumber } from '../../helpers/validations'

const PurchaseOrderModal = ({
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
  
  const createType = 'CREATE_PO'
  const resetType = 'RESET_PO'
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
    !stateData.POnumber ? stateMethod(createType, 'POnumber', generateRandomNumber()) : null
    
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
            'Edit Purchase Order' 
            : 
            'New Purchase Order'
            }
        </span>
        <div onClick={() => (setModal(''), resetState(resetType), setMessage(''))}>
          <SVG svg={'close'}></SVG>
        </div>
        </div>



        <form className="addFieldItems-modal-form">
          <div className="form-group">
            <input
              onClick={() => setInputDropdown('purchase_order_supplier')} 
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
            onClick={() => setInputDropdown('purchase_order_supplier')}><SVG svg={'dropdown-arrow'}></SVG>
            </div>
            { input_dropdown == 'purchase_order_supplier' &&
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
            onClick={() => setInputDropdown('purchase_order_shipping')} 
            value={stateData.shipping} 
            onChange={(e) => (setInputDropdown(''), stateMethod(createType, 'shipping', e.target.value))}
            readOnly
            />
            <label 
            className={`input-label ` + (
              stateData.shipping.length > 0 || 
              typeof stateData.shipping == 'object' 
              ? ' labelHover' 
              : ''
            )}
            htmlFor="shipping">
              Ship-To Location
            </label>
            <div 
            onClick={() => setInputDropdown('purchase_order_shipping')}><SVG svg={'dropdown-arrow'}></SVG>
            </div>
            { input_dropdown == 'purchase_order_shipping' &&
              <div 
              className="form-group-list" 
              ref={myRefs}>
                <div 
                className="form-group-list-item" 
                onClick={(e) => (stateMethod(createType, 'shipping', 'Innovative Stones'), setInputDropdown(''))}>
                  Innovative Stones
                </div>
              </div>
            }
          </div>

          <div className="form-group">
            <input 
            id="POnumber" 
            value={stateData.POnumber} 
            onChange={(e) => (validateNumber('POnumber'), stateMethod(createType, 'POnumber'))}
            />
            <label 
              className={`input-label ` + (
              stateData.POnumber
              ? ' labelHover' 
              : ''
            )}
            htmlFor="POnumber">
              PO Number
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
        onClick={(e) => submitCreate(e, stateData, 'purchaseOrders', null, setMessage, 'create_purchase_order', setLoading, token, 'purchase-order/create-purchase-order', resetType, resetState, allData, setAllData, setDynamicSVG)}
        >
            {loading == 'create_purchase_order' ? 
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
        {edit == 'purchaseOrders' && 
        <button 
        className="form-group-button" 
        onClick={(e) => (e.preventDefault(), submitUpdate(e, stateData, 'purchaseOrders', null, setMessage, 'update_purchase_order', setLoading, token, 'purchase-order/update-purchase-order', resetType, resetState, allData, setAllData, setDynamicSVG, changeView, 'purchaseOrders', setModal))}
        >
           {loading == 'update_purchase_order' ? 
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

export default PurchaseOrderModal
