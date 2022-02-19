import {useState, useEffect, useRef} from 'react'
import SVG from '../../files/svgs'
import { HexColorPicker } from "react-colorful";
import { activityStatus } from '../../helpers/lists'
import { validateTime, validateNumber, validatePrice } from '../../helpers/validations';
import { manageFormFields } from '../../helpers/forms';

const ActivityStatusModal = ({
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
  
  const createType = 'CREATE_ACTIVITY_STATUS'
  const resetType = 'RESET_ACTIVITY_STATUS'
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
            {edit == 'activities' ? 
            'Edit Activity Status' 
            : 
            'New Activity Status'
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
          id="status" 
          value={stateData.status} 
          onChange={(e) => stateMethod(createType, 'status', e.target.value)}/>
          <label 
          className={`input-label ` + (
            stateData.status.length > 0 || 
            typeof stateData.status == 'object' 
            ? ' labelHover' 
            : ''
          )}
          htmlFor="status">
            Activity Status
          </label>
        </div>
        <div className="form-group">
          <input 
          id="color" 
          value={stateData.color} 
          onChange={(e) => stateMethod(createType, 'color', e.target.value)}/>
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
          <div onClick={ () => input_dropdown == 'color_picker' ? setInputDropdown('') : setInputDropdown('color_picker')}>
            <SVG svg={'color-picker'} color={stateData.color}></SVG>
          </div>
          { input_dropdown == 'color_picker' &&
            <div 
            className="form-group-list" 
            ref={myRefs}
            >
              <HexColorPicker 
                color={stateData.color} 
                onChange={(e) => (setIsDragging(false), stateMethod(createType, 'color', e))}
              />
            </div>
          }
        </div>
        <div className="form-group">
          <input 
          id="abbreviation" 
          value={stateData.abbreviation} 
          onChange={(e) => stateMethod(createType, 'abbreviation', e.target.value)}/>
          <label 
          className={`input-label ` + (
            stateData.abbreviation.length > 0 || 
            typeof stateData.abbreviation == 'object' 
            ? ' labelHover' 
            : ''
          )}
          htmlFor="abbreviation">
            Abbreviation
          </label>
        </div>
        <div className="form-group-checkbox">
          <input 
            type="checkbox" 
            name="confirmTimeChange" 
            id="confirmTimeChange" 
            hidden={true} 
            checked={stateData.confirmTimeChange == 'yes' ? true : false} 
            readOnly
          />
          <label 
            htmlFor="active" 
            onClick={() => (
              stateData.confirmTimeChange == 'no'
              ? 
              stateMethod(createType, 'confirmTimeChange', 'yes') 
              : 
              stateMethod(createType, 'confirmTimeChange', 'no')
            )}
          >
          </label>
          <span>Confirm Time Changes</span>
        </div>
        <div className="form-group-checkbox">
          <input 
            type="checkbox" 
            name="appointments" 
            id="appointments" 
            hidden={true} 
            checked={stateData.appointments == 'yes' ? true : false} 
            readOnly
          />
          <label 
            htmlFor="active" 
            onClick={() => (
              stateData.appointments == 'no'
              ? 
              stateMethod(createType, 'appointments', 'yes') 
              : 
              stateMethod(createType, 'appointments', 'no')
            )}
          >
          </label>
          <span>Use for Appointments</span>
        </div>
        <div className="form-group-checkbox">
          <input 
            type="checkbox" 
            name="active" 
            id="active" 
            hidden={true} 
            checked={stateData.active == 'inactive' ? true : false} 
            readOnly
          />
          <label 
            htmlFor="active" 
            onClick={() => (
              stateData.active == 'inactive'
              ? 
              stateMethod(createType, 'active', 'active') 
              : 
              stateMethod(createType, 'active', 'inactive')
            )}
          >
          </label>
          <span>Inactive</span>
        </div>
      </form>

      <div className="addFieldItems-modal-box-footer">
        {message && 
          <span className="form-group-message">
            <SVG svg={dynamicSVG} color={'#fd7e3c'}></SVG>
            {message}
          </span>
          }
          {!edit && 
          <button 
          className="form-group-button" 
          onClick={(e) => submitCreate(e, stateData, 'activityStatus', setMessage, 'create_activity_status', setLoading, token, 'activities/create-activity-status', resetType, resetState, allData, setAllData, setDynamicSVG)}
          >
              {loading == 'create_activity_status' ? 
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
          {edit == 'activityStatus' && 
          <button 
          className="form-group-button" 
          onClick={(e) => (e.preventDefault(), submitUpdate(e, stateData, 'activityStatus', setMessage, 'update_activity_status', setLoading, token, 'activities/update-activity-status', resetType, resetState, allData, setAllData, setDynamicSVG, changeView, 'activityStatus', setModal))}
          >
              {loading == 'update_activity_status' ? 
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

export default ActivityStatusModal
