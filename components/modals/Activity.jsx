import {useState, useEffect, useRef} from 'react'
import SVG from '../../files/svgs'
import { HexColorPicker } from "react-colorful";
import { validateTime, validateNumber, validatePrice, getTimeHour, validateDate, formatDate } from '../../helpers/validations';
import { manageFormFields } from '../../helpers/forms';
import { scheduleList, duration } from '../../utils/schedule'
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

const ActivityModal = ({
  token,
  message,
  setMessage,
  setModal,
  loading,
  setLoading,
  edit,
  setEdit,
  dynamicSVG,
  setDynamicSVG,
  altEdit,
  setAltEdit,
  setSelectID,

  //// DATA
  allData,
  setAllData,

  //// REDUX
  stateData,
  stateMethod,
  resetState,
  changeView,
  editData,

  //// CRUD
  submitCreate,
  submitUpdate
}) => {
  
  const createType = 'CREATE_ACTIVITY'
  const resetType = 'RESET_ACTIVITY'
  const createArrayItem = 'CREATE_ACTIVITY_ARRAY_ITEM'
  const updateJobArrayItem = 'UPDATE_JOB_ARRAY_ITEM'
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
            {edit == 'activities' || altEdit ? 
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
        {altEdit == 'activities' && stateData.job &&
        <div className="form-group-noInput mb-5">
          <SVG svg={'account'}></SVG>
          <div>
            <div>Account Name</div>
            <span 
            >
              {stateData.job.account.name}
            </span>
          </div>
        </div>
        }
        {altEdit == 'activities' && stateData.job &&
        <div className="form-group-noInput mb-5">
          <SVG svg={'job'}></SVG>
          <div>
            <div>Job Name</div>
            <span 
            onClick={(e) => {
              editData('jobs', 'CREATE_JOB', stateMethod, allData, setSelectID, null, stateData.job._id),
              setEdit('jobs'),
              changeView('job'),
              setModal('')
            }}
            >{stateData.job.name}</span>
          </div>
        </div>
        }
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
        <div className="form-group">
          <input
          onClick={() => setInputDropdown('activity_status')} 
          value={stateData.status.replaceAll('-', ' ')} 
          onChange={(e) => (setInputDropdown(''), stateMethod(createType, 'status', e.target.value))}/>
          <label 
          className={`input-label ` + (
            stateData.status.length > 0 || 
            typeof stateData.status == 'object' 
            ? ' labelHover' 
            : ''
          )}
          htmlFor="status">
            Status
          </label>
          <div 
          onClick={() => setInputDropdown('activity_status')}><SVG svg={'dropdown-arrow'}></SVG>
          </div>
          { input_dropdown == 'activity_status' &&
            <div 
            className="form-group-list" 
            ref={myRefs}>
              {allData.activityStatus.length > 0 && allData.activityStatus.map((item, idx) => 
                <div 
                  key={idx} 
                  className="form-group-list-item" 
                  onClick={(e) => (stateMethod(createType, 'status', item.status), setInputDropdown(''))}>
                    {item.status.replaceAll('-', ' ')}
                </div>
              )}
            </div>
          }
        </div>
        {altEdit == 'activities' && 
        <div className="form-group">
          <input
            id="startDate"
            value={stateData.startDate}
            onChange={(e) =>
              validateDate(e, 'startDate', createType, stateMethod)
            }
          />
          <label
            className={
              `input-label ` +
              (stateData.startDate.length > 0 ||
              typeof stateData.startDate == 'object'
                ? ' labelHover'
                : '')
            }
            htmlFor="startDate"
          >
            Start Date
          </label>
          <div
            onClick={() =>
              input_dropdown == 'calendar'
                ? setInputDropdown('')
                : setInputDropdown('calendar')
            }
          >
            <SVG svg={'calendar'}></SVG>
          </div>
          {input_dropdown == 'calendar' && (
            <div className="form-group-list" ref={myRefs}>
              <Calendar
                onClickDay={(date) => (
                  stateMethod( createType, 'startDate', formatDate(date) ),
                  setInputDropdown('')
                )}
                minDate={new Date(Date.now())}
              />
            </div>
          )}
        </div>
        }
        {altEdit == 'activities' && 
          <div className="form-group">
            <input
            id="scheduleTime"
            onClick={() => setInputDropdown('schedule')} 
            value={stateData.scheduleTime} 
            onChange={(e) => (setInputDropdown(''), stateMethod(createType, 'scheduleTime', e.target.value))}/>
            <label 
            className={`input-label ` + (
              stateData.scheduleTime.length > 0 || 
              typeof stateData.scheduleTime == 'object' 
              ? ' labelHover' 
              : ''
            )}
            htmlFor="scheduleTime">
              Schedule
            </label>
            <div 
            onClick={() => setInputDropdown('schedule')}><SVG svg={'clock'}></SVG>
            </div>
            { input_dropdown == 'schedule' &&
              <div 
              className="form-group-list" 
              ref={myRefs}>
                <div 
                  className="form-group-list-item" 
                  onClick={(e) => (stateMethod(createType, 'scheduleTime', getTimeHour(new Date(Date.now()))), setInputDropdown(''))}>
                    Current time
                </div>
                {scheduleList.length > 0 && scheduleList.map((item, idx) => 
                  <div 
                    key={idx} 
                    className="form-group-list-item" 
                    onClick={(e) => (stateMethod(createType, 'scheduleTime', item), setInputDropdown(''))}>
                      {item}
                  </div>
                )}
              </div>
            }
          </div>
        }
        <div className="form-group">
          <input
          id="duration"
          onClick={() => setInputDropdown('duration')} 
          value={stateData.duration} 
          onChange={(e) => (setInputDropdown(''), stateMethod(createType, 'duration', e.target.value))}/>
          <label 
          className={`input-label ` + (
            stateData.duration.length > 0 || 
            typeof stateData.duration == 'object' 
            ? ' labelHover' 
            : ''
          )}
          htmlFor="duration">
            Duration
          </label>
          <div 
          onClick={() => setInputDropdown('duration')}><SVG svg={'stopwatch'}></SVG>
          </div>
          { input_dropdown == 'duration' &&
            <div 
            className="form-group-list" 
            ref={myRefs}>
              {duration.length > 0 && duration.map((item, idx) => 
                <div 
                  key={idx} 
                  className="form-group-list-item" 
                  onClick={(e) => (stateMethod(createType, 'duration', item), setInputDropdown(''))}>
                    {item}
                </div>
              )}
            </div>
          }
        </div>
        <div className="form-group">
          <input
          onClick={() => setInputDropdown('activity_assignee')} 
          value={manageFormFields(stateData.assignee[0], 'name')} 
          onChange={(e) => (setInputDropdown(''), stateMethod(createType, 'assignee', e.target.value))}
          readOnly
          />
          <label 
          className={`input-label ` + (
            stateData.assignee.length > 0 
            ? ' labelHover' 
            : ''
          )}
          htmlFor="assignee">
            Assignee
          </label>
          <div 
          onClick={() => setInputDropdown('activity_assignee')}><SVG svg={'dropdown-arrow'}></SVG>
          </div>
          { input_dropdown == 'activity_assignee' &&
            <div 
            className="form-group-list" 
            ref={myRefs}>
              {allData && allData.assignees.sort( (a, b) => a.name > b.name ? 1 : -1).map( (item, idx) => (
              <div 
              key={idx} 
              className="form-group-list-item" 
              onClick={(e) => (stateMethod(createArrayItem, 'assignee', item), setInputDropdown(''))}>
                {item.name}
                { stateData.assignee.findIndex((found) => found._id == item._id) !== -1
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
        <div className="form-group">
          <input 
          id="cost" 
          value={stateData.cost} 
          onChange={(e) => (validateNumber('cost'), stateMethod(createType, 'cost', validatePrice(e)))}
          onKeyDown={(e) => (validateNumber('cost'), stateMethod(createType, 'cost', validatePrice(e)))}
          />
          <label 
          className={`input-label ` + (
            stateData.cost.length > 0 || 
            typeof stateData.cost == 'object' 
            ? ' labelHover' 
            : ''
          )}
          htmlFor="cost">
            Cost
          </label>
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
          {!edit && !altEdit &&
          <button 
          className="form-group-button" 
          onClick={(e) => submitCreate(e, stateData, 'activities', null, setMessage, 'create_activity', setLoading, token, 'activities/create-activity', resetType, resetState, allData, setAllData, setDynamicSVG)}
          >
              {loading == 'create_activity' ? 
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
          {edit == 'activities' && !altEdit &&
          <button 
          className="form-group-button" 
          onClick={(e) => (e.preventDefault(), submitUpdate(e, stateData, 'activities', null, setMessage, 'update_activity', setLoading, token, 'activities/update-activity', resetType, resetState, allData, setAllData, setDynamicSVG, changeView, 'activities', setModal))}
          >
              {loading == 'update_activity' ? 
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
          {altEdit == 'activities' &&
          <button 
          className="form-group-button" 
          onClick={(e) => (
            e.preventDefault(),
            setLoading('update_activity_job_form'),
            stateMethod(updateJobArrayItem, 'activities', stateData),
            setModal(''),
            setAltEdit(''),
            resetState(resetType)
          )}>
              {loading == 'update_activity_job_form' ? 
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

export default ActivityModal
