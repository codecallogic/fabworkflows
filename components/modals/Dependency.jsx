import {useState, useEffect, useRef} from 'react'
import SVG from '../../files/svgs'
import { validateNumber } from '../../helpers/validations'

const DependencyModal = ({
  token,
  message,
  setMessage,
  setModal,
  loading,
  setLoading,
  edit,
  dynamicSVG,
  setDynamicSVG,
  selectID,

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
  
  const createType = 'CREATE_DEPENDENCY'
  const resetType = 'RESET_DEPENDENCY'
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
    
    stateMethod(createType, 'activityID', selectID)
    stateMethod(createType, 'name', 'delete')
    
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
            {edit == 'dependency' ? 
            'Edit Dependency' 
            : 
            'New Dependency'
            }
        </span>
        {edit == 'dependency' && 
          <div onClick={(e) => (
            submitUpdate(e, stateData, 'activities', null, setMessage, 'update_dependency', setLoading, token, 'activities/delete-activity-dependency', resetType, resetState, allData, setAllData, setDynamicSVG, changeView, 'activities', setModal)
          )}>
            <SVG svg={'thrash-can'}></SVG>
          </div>
        }
        <div onClick={() => (setModal(''), resetState(resetType), setMessage(''))}>
          <SVG svg={'close'}></SVG>
        </div>
      </div>
      <form 
      className="addFieldItems-modal-form" 
      >
        <div style={{display: 'flex', width: '100%'}}>
          <div className="form-group" style={{width: '49%'}}>
              <input
              onClick={() => setInputDropdown('dependency_schedule')} 
              value={stateData.schedule} 
              onChange={(e) => (setInputDropdown(''), stateMethod(createType, 'schedule', e.target.value))}/>
              <label 
              className={`input-label ` + (
                stateData.schedule.length > 0 || 
                typeof stateData.schedule == 'object' 
                ? ' labelHover' 
                : ''
              )}
              htmlFor="schedule">
                Schedule
              </label>
              <div 
              onClick={() => setInputDropdown('dependency_schedule')}><SVG svg={'watch'}></SVG>
              </div>
              { input_dropdown == 'dependency_schedule' &&
                <div 
                className="form-group-list" 
                ref={myRefs}>

                  <div 
                  className="form-group-list-item" 
                  onClick={(e) => (stateMethod(createType, 'schedule', 'after'), setInputDropdown(''))}>
                    After
                  </div>

                  <div 
                  className="form-group-list-item" 
                  onClick={(e) => (stateMethod(createType, 'schedule', 'before'), setInputDropdown(''))}>
                    Before
                  </div>
                  
                </div>
              }
          </div>
          <div className="form-group" style={{width: '49%'}}>
              <input
              onClick={() => setInputDropdown('dependency_activity')} 
              value={stateData.activity} 
              onChange={(e) => (setInputDropdown(''), stateMethod(createType, 'activity', e.target.value))}/>
              <label 
              className={`input-label ` + (
                stateData.activity.length > 0 || 
                typeof stateData.activity == 'object' 
                ? ' labelHover' 
                : ''
              )}
              htmlFor="activity">
                Activity
              </label>
              <div 
              onClick={() => setInputDropdown('dependency_activity')}><SVG svg={'dropdown-arrow'}></SVG>
              </div>
              { input_dropdown == 'dependency_activity' &&
                <div 
                className="form-group-list" 
                ref={myRefs}>

                {allData && allData.activities.map( (item, idx) => (
                  <div 
                  key={idx} 
                  className="form-group-list-item" 
                  onClick={(e) => (stateMethod(createType, 'activity', item.name), setInputDropdown(''))}>
                    {item.name}
                  </div>
                ))}
                  
                </div>
              }
          </div>
        </div>
        <div style={{display: 'flex', width: '100%'}}>
          <div className="form-group" style={{width: '49%'}}>
            <input 
            id="days" 
            value={stateData.days} 
            onChange={(e) => (validateNumber('days'), stateMethod(createType, 'days', e.target.value))}/>
            <label 
            className={`input-label ` + (
              stateData.days.length > 0 || 
              typeof stateData.days == 'object' 
              ? ' labelHover' 
              : ''
            )}
            htmlFor="days">
              Days #
            </label>
          </div>
          <div className="form-group" style={{width: '49%'}}>
              <input
              onClick={() => setInputDropdown('dependency_days')} 
              value={stateData.typeOfDay} 
              onChange={(e) => (stateMethod(createType, 'typeOfDay', e.target.value))}
              readOnly
              />
              <label 
              className={`input-label ` + (
                stateData.typeOfDay.length > 0 || 
                typeof stateData.typeOfDay == 'object' 
                ? ' labelHover' 
                : ''
              )}
              htmlFor="typeOfDay">
                Type
              </label>
              <div 
              onClick={() => setInputDropdown('dependency_days')}><SVG svg={'dropdown-arrow'}></SVG>
              </div>
              { input_dropdown == 'dependency_days' &&
                <div 
                className="form-group-list" 
                ref={myRefs}>

                  <div 
                  className="form-group-list-item" 
                  onClick={(e) => (stateMethod(createType, 'typeOfDay', 'days'), setInputDropdown(''))}>
                    Days
                  </div>

                  <div 
                  className="form-group-list-item" 
                  onClick={(e) => (stateMethod(createType, 'typeOfDay', 'workdays'), setInputDropdown(''))}>
                    Workdays
                  </div>
                  
                </div>
              }
          </div>
        </div>
        <div className="form-group-checkbox mtType1">
          <input 
            type="checkbox" 
            name="ignoreForAutoSchedule" 
            id="ignoreForAutoSchedule" 
            hidden={true} 
            checked={stateData.ignoreForAutoSchedule ? true : false} 
            readOnly
          />
          <label 
            htmlFor="taxable" 
            onClick={() => (
              stateData.ignoreForAutoSchedule
              ? 
              stateMethod(createType, 'ignoreForAutoSchedule', false) 
              : 
              stateMethod(createType, 'ignoreForAutoSchedule', true)
            )}
          >
          </label>
          <span>Ignore for Auto-Schedule</span>
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
        onClick={(e) => (
          e.preventDefault(),
          submitUpdate(e, stateData, 'activities', null, setMessage, 'create_dependency', setLoading, token, 'activities/update-activity-dependency', resetType, resetState, allData, setAllData, setDynamicSVG, changeView, 'activities', setModal)
        )}
        >
            {loading == 'create_dependency' ? 
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
        {edit == 'dependency' && 
        <button 
        className="form-group-button" 
        onClick={(e) => (
          e.preventDefault(), 
          submitUpdate(e, stateData, 'activities', null, setMessage, 'update_dependency', setLoading, token, 'activities/update-activity-dependency', resetType, resetState, allData, setAllData, setDynamicSVG, changeView, 'activities', setModal)
        )}
        >
            {loading == 'update_dependency' ? 
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

export default DependencyModal
