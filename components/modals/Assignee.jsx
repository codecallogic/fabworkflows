import {useState, useEffect, useRef} from 'react'
import SVG from '../../files/svgs'
import { HexColorPicker } from "react-colorful";

const AssigneeModal = ({
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
  
  const createType = 'CREATE_ASSIGNEE'
  const resetType = 'RESET_ASSIGNEE'
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
            {edit == 'assignees' ? 
            'Edit Assignee' 
            : 
            'New Assignee'
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
        <div className="form-group-textarea">
          <label 
          className={stateData.description.length > 0 ? ' labelHover' : ''}>
            Description
          </label>
          <textarea 
            id="descripton" 
            rows="5" 
            wrap="hard" 
            maxLength="400"
            name="description" 
            value={stateData.description} 
            onChange={(e) => stateMethod(createType, 'description', e.target.value)} 
          />
        </div>
        <div className="form-group-checkbox">
          <input 
            type="checkbox" 
            name="status" 
            id="status" 
            hidden={true} 
            checked={stateData.status == 'inactive' ? true : false} 
            readOnly
          />
          <label 
            htmlFor="status" 
            onClick={() => (
              stateData.status == 'inactive'
              ? 
              stateMethod(createType, 'status', 'active') 
              : 
              stateMethod(createType, 'status', 'inactive')
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
        onClick={(e) => submitCreate(e, stateData, 'assignees', setMessage, 'create_assignee', setLoading, token, 'assignee/create-assignee', resetType, resetState, allData, setAllData, setDynamicSVG)}
        >
          {loading == 'create_assignee' ? 
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
        {edit == 'assignees' && 
        <button 
        className="form-group-button" 
        onClick={(e) => (e.preventDefault(), submitUpdate(e, stateData, 'assignees', setMessage, 'update_assignee', setLoading, token, 'assignee/update-assignee', resetType, resetState, allData, setAllData, setDynamicSVG, changeView, 'assignees', setModal))}
        >
          {loading == 'update_assignee' ? 
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

export default AssigneeModal
