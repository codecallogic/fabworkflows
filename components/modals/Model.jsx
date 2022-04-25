import {useState, useEffect} from 'react'
import SVG from '../../files/svgs'
import { validatePrice } from '../../helpers/validations'

const MaterialModal = ({
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
  
  const createType = 'CREATE_MODEL'
  const resetType = 'RESET_MODEL'
  const [loadingColor, setLoadingColor] = useState('white')

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
            {edit == 'model' ? 
            'Edit Model' 
            : 
            'New Model'
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
          id="name" 
          value={stateData.name} 
          onChange={(e) => stateMethod(createType, 'name', e.target.value)}/>
          <label 
          className={`input-label ` + (
            stateData.name.length > 0 || 
            typeof stateData.name == 'object' 
            ? ' labelHover' 
            : ''
          )}
          htmlFor="name">
            Name
          </label>
        </div>
        <div className="form-group-checkbox">
          <input 
            type="checkbox" 
            name="type" 
            id="type" 
            hidden={true} 
            checked={stateData.type == 'sink' ? true : false} 
            readOnly
          />
          <label 
            htmlFor="type" 
            onClick={() => (
              stateData.type
              ? 
              stateMethod(createType, 'type', '') 
              : 
              stateMethod(createType, 'type', 'sink')
            )}
          >
          </label>
          <span>Sinks</span>
        </div>
        <div className="form-group-checkbox">
          <input 
            type="checkbox" 
            name="type" 
            id="type" 
            hidden={true} 
            checked={stateData.type == 'cutouts' ? true : false} 
            readOnly
          />
          <label 
            htmlFor="type" 
            onClick={() => (
              stateData.type
              ? 
              stateMethod(createType, 'type', '') 
              : 
              stateMethod(createType, 'type', 'cutouts')
            )}
          >
          </label>
          <span>Cutouts</span>
        </div>
        <div className="form-group-checkbox">
          <input 
            type="checkbox" 
            name="type" 
            id="type" 
            hidden={true} 
            checked={stateData.type == 'edges' ? true : false} 
            readOnly
          />
          <label 
            htmlFor="type" 
            onClick={() => (
              stateData.type
              ? 
              stateMethod(createType, 'type', '') 
              : 
              stateMethod(createType, 'type', 'edges')
            )}
          >
          </label>
          <span>Edges</span>
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
        onClick={(e) => submitCreate(e, stateData, 'models', null, setMessage, 'create_model', setLoading, token, 'models/create-model', resetType, resetState, allData, setAllData, setDynamicSVG)}
        >
           {loading == 'create_model' ? 
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
        {edit == 'model' && 
        <button 
        className="form-group-button" 
        onClick={(e) => (e.preventDefault(), submitUpdate(e, stateData, 'models', null, setMessage, 'update_model', setLoading, token, 'models/update-model', resetType, resetState, allData, setAllData, setDynamicSVG, changeView, 'models', setModal))}
        >
           {loading == 'update_model' ? 
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

export default MaterialModal
