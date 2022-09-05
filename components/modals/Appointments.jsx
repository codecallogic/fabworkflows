import { useState, useEffect, useRef } from 'react'
import SVG from '../../files/svgs'
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { validateDate, formatDate, getTimeHour } from '../../helpers/validations'
import { scheduleList, duration } from '../../utils/schedule'
import { manageFormFields } from '../../helpers/forms'

const Appointments = ({
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

  const createType = 'CREATE_APPOINTMENT'
  const resetType = 'RESET_APPOINTMENT'
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

  useEffect(() => {
    if(stateData.recurring){
      document.getElementById("recurring").scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'start' })
    }
  }, [stateData.recurring])
  
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
              {edit == 'appointment' ? 
              'Edit Appointment' 
              : 
              'New Appointment'
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
            onClick={() => setInputDropdown('assigne')} 
            value={manageFormFields(stateData.assigne, 'name')} 
            onChange={(e) => (setInputDropdown(''), stateMethod(createType, 'assigne', e.target.value))}/>
            <label 
            className={`input-label ` + (
              stateData.assigne.length > 0 || 
              typeof stateData.assigne == 'object' 
              ? ' labelHover' 
              : ''
            )}
            htmlFor="assigne">
              Assigne
            </label>
            <div 
            onClick={() => setInputDropdown('assigne')}><SVG svg={'dropdown-arrow'}></SVG>
            </div>
            { input_dropdown == 'assigne' &&
              <div 
              className="form-group-list" 
              ref={myRefs}>
                {allData.assignees.length > 0 && allData.assignees.map((item, idx) => 
                  <div 
                    key={idx} 
                    className="form-group-list-item" 
                    onClick={(e) => (stateMethod(createType, 'assigne', item), setInputDropdown(''))}>
                      {item.name}
                  </div>
                )}
              </div>
            }
          </div>
          <div className="form-group">
            <input
            onClick={() => setInputDropdown('category')} 
            value={manageFormFields(stateData.category, 'name')} 
            onChange={(e) => (setInputDropdown(''), stateMethod(createType, 'category', e.target.value))}/>
            <label 
            className={`input-label ` + (
              stateData.category.length > 0 || 
              typeof stateData.category == 'object' 
              ? ' labelHover' 
              : ''
            )}
            htmlFor="category">
              Category
            </label>
            <div 
            onClick={() => setInputDropdown('category')}><SVG svg={'dropdown-arrow'}></SVG>
            </div>
            { input_dropdown == 'category' &&
              <div 
              className="form-group-list" 
              ref={myRefs}>
                {allData.phases.length > 0 && allData.phases.map((item, idx) => 
                  <div 
                    key={idx} 
                    className="form-group-list-item" 
                    onClick={(e) => (stateMethod(createType, 'category', item), setInputDropdown(''))}>
                      {item.name}
                  </div>
                )}
              </div>
            }
          </div>
          <div className="form-group-textarea">
            <label
              className={
                stateData.notes.length > 0 ? ' labelHover' : ''
              }
            >
              Notes
            </label>
            <textarea
              id="notes"
              rows="5"
              wrap="hard"
              maxLength="400"
              name="notes"
              value={stateData.notes}
              onChange={(e) =>
                stateMethod(createType, 'notes', e.target.value)
              }
            />
          </div>
          <div className="form-group">
            <input
              id="recurring"
              value={stateData.recurring 
                ? 
                  stateData.recurring.type == 'daily' 
                  ?
                    (
                      `Occurs every ${stateData.recurring.occurrenceDay ? `${stateData.recurring.occurrenceDay} days` : stateData.recurring.occurrenceType} (Ends ${stateData.recurring.rangeEndOccurrence ? `${stateData.recurring.rangeEndOccurrence} after occurrences` : `by ${stateData.recurring.rangeEndDate}`} )`
                    )
                  :
                  stateData.recurring.type == 'weekly' 
                  ?
                  (
                    `Occurs ${stateData.recurring.occurrenceType} every ${stateData.recurring.occurrenceWeek} week(s) (Ends ${stateData.recurring.rangeEndOccurrence ? `${stateData.recurring.rangeEndOccurrence} after occurrences` : `by ${stateData.recurring.rangeEndDate}`} )`
                  )
                  :
                  stateData.recurring.type == 'monthly' 
                  ?
                  (
                    `Occurs ${stateData.recurring.occurrenceDay ? `day ${stateData.recurring.occurrenceDay} of every ${stateData.recurring.occurrenceMonth} month(s)` : `the ${stateData.recurring.occurrenceType.split('-')} of every ${stateData.recurring.occurrenceMonth} month(s)`} (Ends ${stateData.recurring.rangeEndOccurrence ? `${stateData.recurring.rangeEndOccurrence} after occurrences` : `by ${stateData.recurring.rangeEndDate}`} )`
                  ).replace(',', ' ')
                  :
                  null
                : 
                ''
              }
              readOnly
            />
            <label
              className={
                `input-label ` +
                (stateData.recurring.length > 0 ||
                typeof stateData.recurring == 'object'
                  ? ' labelHover'
                  : '')
              }
              htmlFor="recurring"
            >
              Recurring
            </label>
            <div
              onClick={() =>
                setModal('recurring')
              }
            >
              <SVG svg={'recurring'}></SVG>
            </div>
          </div>
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
            onClick={(e) => submitCreate(e, stateData, 'appointments', null, setMessage, 'create_appointment', setLoading, token, 'appointments/create-appointment', resetType, resetState, allData, setAllData, setDynamicSVG, changeView, 'calendar', setModal, '')}
            >
              {loading == 'create_appointment' ? 
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
          </div>
          {edit == 'appointment' && 
            <button 
            className="form-group-button" 
            onClick={(e) => (e.preventDefault(), submitUpdate(e, stateData, 'appointments', null, setMessage, 'update_appointment', setLoading, token, 'appointments/update-appointment', resetType, resetState, allData, setAllData, setDynamicSVG, changeView, 'calendar', setModal, ''))}
            >
              {loading == 'update_appointment' ? 
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

export default Appointments
