import {useState, useEffect, useRef} from 'react'
import SVG from '../../files/svgs'
import { validatePrice } from '../../helpers/validations'
import { cutouts } from '../../helpers/lists'

const CutoutsModal = ({
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

  //// REDUX
  stateData,
  stateMethod,
  resetState,
  changeView,

  //// CRUD
  submitCreate,
  submitUpdate
}) => {
  
  const createType = 'CREATE_CUTOUT'
  const resetType = 'RESET_CUTOUT'
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
            {edit == 'edge' ? 
            'Edit Cutout' 
            : 
            'New Cutout'
            }
        </span>
        <div onClick={() => (setModal(''), resetState(resetType), setMessage(''))}>
          <SVG svg={'close'}></SVG>
        </div>
      </div>
      <form 
      className="addFieldItems-modal-form" 
      >
        <div className="form-group">
          <input
          onClick={() => setInputDropdown('cutout_type')} 
          value={stateData.type} 
          onChange={(e) => (setInputDropdown(''), stateMethod(createType, 'type', e.target.value))}
          readOnly
          />
          <label 
          className={`input-label ` + (
            stateData.type.length > 0 || 
            typeof stateData.type == 'object' 
            ? ' labelHover' 
            : ''
          )}
          htmlFor="type">
            Type
          </label>
          <div 
          onClick={() => setInputDropdown('cutout_type')}><SVG svg={'dropdown-arrow'}></SVG>
          </div>
          { input_dropdown == 'cutout_type' &&
            <div 
            className="form-group-list" 
            ref={myRefs}>
              {cutouts && cutouts.sort( (a, b) => a.type > b.type ? 1 : -1).map( (item, idx) => (
              <div 
              key={idx} 
              className="form-group-list-item" 
              onClick={(e) => (stateMethod(createType, 'type', item.type), setInputDropdown(''))}>
                {item.type}
              </div>
              ))}
            </div>
          }
        </div>
        
        <div className="form-group">
          <input 
          id="price" 
          value={stateData.price} 
          onChange={(e) => (stateMethod(createType, 'price', validatePrice(e)))}/>
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
        {!edit && 
        <button 
        className="form-group-button" 
        onClick={(e) => submitCreate(e, stateData, 'cutouts', null, setMessage, 'create_cutout', setLoading, token, 'cutouts/create-cutout', resetType, resetState, allData, setAllData, setDynamicSVG)}
        >
           {loading == 'create_cutout' ? 
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
        {edit == 'cutout' && 
        <button 
        className="form-group-button" 
        onClick={(e) => (e.preventDefault(), submitUpdate(e, stateData, 'cutouts', null, setMessage, 'update_cutout', setLoading, token, 'cutouts/update-cutout', resetType, resetState, allData, setAllData, setDynamicSVG, changeView, 'cutouts', setModal))}
        >
           {loading == 'update_cutout' ? 
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
      </form>
    </div>
    </div>
  )
}

export default CutoutsModal
