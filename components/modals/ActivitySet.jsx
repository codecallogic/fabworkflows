import {useState, useEffect, useRef} from 'react'
import SVG from '../../files/svgs'
import { HexColorPicker } from "react-colorful";
import { activityStatus } from '../../helpers/lists'
import { validateTime, validateNumber, validatePrice } from '../../helpers/validations';
import { manageFormFields } from '../../helpers/forms';

const ActivitySetModal = ({
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
  
  const createType = 'CREATE_ACTIVITY_SET'
  const resetType = 'RESET_ACTIVITY_SET'
  const createArrayItem = 'CREATE_ACTIVITY_SET_ITEM'
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
            {edit == 'activitySets' ? 
            'Edit Activity' 
            : 
            'New Activity'
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
          onClick={() => setInputDropdown('activity_set')} 
          value={manageFormFields(stateData.set[0], 'name')} 
          onChange={(e) => (setInputDropdown(''), stateMethod(createType, 'set', e.target.value))}/>
          <label 
          className={`input-label ` + (
            stateData.set.length > 0 || 
            typeof stateData.set == 'object' 
            ? ' labelHover' 
            : ''
          )}
          htmlFor="set">
            Set
          </label>
          <div 
          onClick={() => setInputDropdown('activity_set')}><SVG svg={'dropdown-arrow'}></SVG>
          </div>
          { input_dropdown == 'activity_set' &&
            <div 
            className="form-group-list" 
            ref={myRefs}>
              {allData && allData.activities.sort( (a, b) => a.name > b.name ? 1 : -1).map( (item, idx) => (
              <div 
              key={idx} 
              className="form-group-list-item" 
              onClick={(e) => (stateMethod(createArrayItem, 'set', item), setInputDropdown(''))}>
                {item.name}
                { stateData.set.findIndex((found) => found._id == item._id) !== -1
                    ? 
                    <SVG svg={'checkmark'}></SVG>
                    :
                    ''
                }
              </div>
              ))}
            </div>
          }
        </div>
        <div className="mbType2">
        {stateData.set && stateData.set.length > 0 &&
          <div className="form-group-tags">
            {stateData.set && stateData.set.map((item, idx) => 
              <div key={idx}>
                {allData.activities[allData.activities.findIndex((index) => { return index._id == (typeof item == 'object' ? item._id : item)})].name}
                <span onClick={(e) => stateMethod(createArrayItem, 'set', item)}>X</span>
              </div>
            )}
          </div>
        }
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
          onClick={(e) => submitCreate(e, stateData, 'activitySets', setMessage, 'create_activity_set', setLoading, token, 'activities/create-activity-set', resetType, resetState, allData, setAllData, setDynamicSVG)}
          >
              {loading == 'create_activity_set' ? 
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
          {edit == 'activitySets' && 
          <button 
          className="form-group-button" 
          onClick={(e) => (e.preventDefault(), submitUpdate(e, stateData, 'activitySets', setMessage, 'update_activity_set', setLoading, token, 'activities/update-activity-set', resetType, resetState, allData, setAllData, setDynamicSVG, changeView, 'activitySets', setModal))}
          >
              {loading == 'update_activity_set' ? 
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

export default ActivitySetModal
