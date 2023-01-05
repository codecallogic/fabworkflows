import {useState, useEffect} from 'react'
import SVG from '../../files/svgs'

const EmailModal = ({
  token,
  message,
  setMessage,
  setModal,
  loading,
  setLoading,
  edit,
  dynamicSVG,
  setDynamicSVG,
  quote,

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
  
  const createType  = 'CREATE_EMAIL'
  const resetType   = 'RESET_EMAIL'
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
            {edit == 'material' ? 
            '' 
            : 
            'Email'
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
            id="email" 
            value={stateData.email}
            onChange={(e) => stateMethod(createType, 'email', e.target.value)}
          />
          <label 
          className={`input-label ` + (
            stateData.email.length > 0 || 
            typeof stateData.email == 'object' 
            ? ' labelHover' 
            : ''
          )}
          htmlFor="email">
            Email
          </label>
        </div>
        {message && 
        <span className="form-group-message">
          <SVG svg={dynamicSVG} color={'#fd7e3c'}></SVG>
          {message}
        </span>
        }
        <button 
        className="form-group-button" 
        onClick={(e) => submitCreate(e, stateData, 'email', null, setMessage, 'create_email', setLoading, token, stateData.route, resetType, resetState, allData, setAllData, setDynamicSVG, null, null, setModal, '', 'email') }
        >
          {loading == 'create_email' ? 
          <div className="loading">
            <span style={{backgroundColor: loadingColor}}></span>
            <span style={{backgroundColor: loadingColor}}></span>
            <span style={{backgroundColor: loadingColor}}></span>
          </div>
          : 
          'Send Quote'
          }
        </button>
      </form>
    </div>
    </div>
  )
}

export default EmailModal
