import { useState, useEffect, useRef } from 'react'
import SVG from '../../files/svgs'
import { repeat, days, dayPosition } from '../../utils/schedule'
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { validateDate, formatDate } from '../../helpers/validations'

const Recurring = ({
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
  
  const createType = 'CREATE_RECURRING'
  const resetTypeRecurring = 'RESET_RECURRING'
  const createTypeAppointment = 'CREATE_APPOINTMENT'
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
              {edit == 'repeat_appointment' ? 
              'Repeat Recurring' 
              : 
              'Repeat Recurring'
              }
          </span>
          <div onClick={() => (setModal('appointments'), setMessage(''))}>
            <SVG svg={'arrow-left-large'}></SVG>
          </div>
        </div>
      <form 
        className="addFieldItems-modal-form" 
      >
        <div className="form-group">
          <input
            id="type"
            onClick={() => setInputDropdown('type')} 
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
            Repeat
          </label>
          <div 
          onClick={() => setInputDropdown('type')}><SVG svg={'clock'}></SVG>
          </div>
          { input_dropdown == 'type' &&
            <div 
            className="form-group-list" 
            ref={myRefs}>
              {repeat.length > 0 && repeat.map((item, idx) => 
                <div 
                  key={idx} 
                  className="form-group-list-item" 
                  onClick={(e) => (
                    stateMethod(createType, 'type', item), 
                    setInputDropdown(''),
                    stateMethod(createType, 'occurrenceDay', ''),
                    stateMethod(createType, 'occurrenceWeek', ''),
                    stateMethod(createType, 'occurrenceMonth', ''),
                    item == 'monthly' 
                    ?
                    stateMethod(createType, 'occurrenceType', 'first-monday')
                    :
                    stateMethod(createType, 'occurrenceType', '')
                  )}>
                    {item}
                </div>
              )}
            </div>
          }
        </div>
        { stateData.type == 'daily' &&
        <div 
          style={{ 
            display: 'block',
            padding: '.5rem 0',
            borderLeft: '.05rem solid black'
          }}
          className="table-rowLine"
        >
          <div className="table-rowLine-item">
            <div 
              style={{ minWidth: '20rem', padding: '1rem 0' }}
              className="table-rowLine-item-qty"
            >
              <span>Every</span>
              <input 
                type="text"
                value={stateData.occurrenceDay}
                onChange={(e) => (
                  stateMethod(createType, 'occurrenceDay', e.target.value),
                  stateMethod(createType, 'occurrenceType', '')
                )}
              />
              <span>day(s)</span>
            </div>
          </div>
          <div className="form-group-checkbox">
            <input 
              type="checkbox" 
              name="occurrenceType" 
              id="occurrenceType" 
              hidden={true} 
              checked={stateData.occurrenceType ? true : false} 
              readOnly
            />
            <label 
              htmlFor="occurrenceType" 
              onClick={() => (
                stateData.occurrenceType
                ? 
                stateMethod(createType, 'occurrenceType', '') 
                : 
                (
                  stateMethod(createType, 'occurrenceType', 'workday'),
                  stateMethod(createType, 'occurrenceDay', '')
                )
              )}
            >
            </label>
            <span>Every workday</span>
          </div>
        </div>
        }
        { stateData.type == 'weekly' &&
        <div 
          style={{ 
            display: 'block',
            padding: '.5rem 0',
            borderLeft: '.05rem solid black'
          }}
          className="table-rowLine"
        >
          <div className="table-rowLine-item">
            <div 
              style={{ minWidth: '20rem', padding: '1rem 0' }}
              className="table-rowLine-item-qty"
            >
              <span>Recur every</span>
              <input 
                type="text"
                value={stateData.occurrenceWeek}
                onChange={(e) => (
                  stateMethod(createType, 'occurrenceWeek', e.target.value),
                  stateMethod(createType, 'occurrenceType', '')
                )}
              />
              <span>week(s) on:</span>
            </div>
          </div>
          {days && days.map((item, idx) => 
            <div 
              key={idx}
              className="form-group-checkbox"
            >
              <input 
                type="checkbox" 
                name="occurrenceType" 
                id="occurrenceType" 
                hidden={true} 
                checked={stateData.occurrenceType == item ? true : false} 
                readOnly
              />
              <label 
                htmlFor="occurrenceType" 
                onClick={() => (
                  stateData.occurrenceType
                  ? 
                    stateMethod(createType, 'occurrenceType', '') 
                  : 
                  (
                    stateMethod(createType, 'occurrenceType', item)
                  )
                )}
              >
              </label>
              <span>{item}</span>
            </div>
          )}
        </div>
        }
        { stateData.type == 'monthly' &&
        <div 
          style={{ 
            display: 'block',
            padding: '.5rem 0',
            borderLeft: '.05rem solid black'
          }}
          className="table-rowLine"
        >
          <div className="table-rowLine-item">
            <div 
              style={{ minWidth: '25rem', padding: '1rem 0' }}
              className="table-rowLine-item-qty"
            >
              <span>Day</span>
              <input 
                type="text"
                value={stateData.occurrenceDay}
                onChange={(e) => (
                  stateMethod(createType, 'occurrenceDay', e.target.value),
                  stateMethod(createType, 'occurrenceType', '')
                )}
              />
              <span>of every</span>
              <input 
                type="text"
                value={stateData.occurrenceMonth}
                onChange={(e) => (
                  stateMethod(createType, 'occurrenceMonth', e.target.value)
                )}
              />
              <span>months(s)</span>
            </div>
          </div>
          <div className="table-rowLine-item">
            <div 
              className="table-rowLine-item-dropdown"
            >
              <input 
                type="text"
                value={stateData.occurrenceType.split('-')[0]}
                readOnly
              />
               <div 
                onClick={() => setInputDropdown('dayPosition')}><SVG svg={'dropdown-arrow'}></SVG>
              </div>
              { input_dropdown == 'dayPosition' &&
                <div 
                className="table-rowLine-item-dropdown-list" 
                ref={myRefs}>
                  {dayPosition.length > 0 && dayPosition.map((item, idx) => 
                    <div 
                      key={idx} 
                      className="table-rowLine-item-dropdown-list-item" 
                      onClick={(e) => (
                        setInputDropdown(''),
                        stateMethod(createType, 'occurrenceType', `${item}-${ stateData.occurrenceType ? stateData.occurrenceType.split('-')[1] : '' }`),
                        stateMethod(createType, 'occurrenceDay', '')
                      )}>
                        {item}
                    </div>
                  )}
                </div>
              }
            </div>
            <div 
              className="table-rowLine-item-dropdown"
            >
              <input 
                type="text"
                value={stateData.occurrenceType.split('-')[1]}
                readOnly
              />
               <div 
                onClick={() => setInputDropdown('days')}><SVG svg={'dropdown-arrow'}></SVG>
              </div>
              { input_dropdown == 'days' &&
                <div 
                className="table-rowLine-item-dropdown-list" 
                ref={myRefs}>
                  {days.length > 0 && days.map((item, idx) => 
                    <div 
                      key={idx} 
                      className="table-rowLine-item-dropdown-list-item" 
                      onClick={(e) => (
                        setInputDropdown(''),
                        stateMethod(createType, 'occurrenceType', `${stateData.occurrenceType.split('-')[0]}-${item}`),
                        stateMethod(createType, 'occurrenceDay', '')
                      )}>
                        {item}
                    </div>
                  )}
                </div>
              }
            </div>
            <div className="table-rowLine-item">
              <div 
                style={{ minWidth: '25rem', padding: '1rem 0' }}
                className="table-rowLine-item-qty"
              >
                <span>of every</span>
                <input 
                  type="text"
                  value={stateData.occurrenceMonth}
                  onChange={(e) => (
                    stateMethod(createType, 'occurrenceMonth', e.target.value)
                  )}
                />
                <span>month(s)</span>
              </div>
            </div>
          </div>
          
        </div>
        }
        <div 
          style={{ 
            display: 'block',
            padding: '2rem 0 0 0',
          }}
          className="table-rowLine"
        >
          <label>Range</label>
          <div className="table-rowLine-item">
            <div 
              style={{ minWidth: '20rem', padding: '1rem 0' }}
              className="table-rowLine-item-qty"
            >
              <span>End after:</span>
              <input 
                type="text"
                value={stateData.rangeEndOccurrence}
                onChange={(e) => (
                  stateMethod(createType, 'rangeEndOccurrence', e.target.value),
                  stateMethod(createType, 'rangeEndDate', '')
                )}
              />
              <span>occurrences</span>
            </div>
          </div>
        </div>
        <div className="form-group spanGroup zindexTop">
          <span>End after:</span>
          <input
            id="rangeEndDate"
            value={stateData.rangeEndDate}
            onChange={(e) =>
              validateDate(e, 'rangeEndDate', createType, stateMethod)
            }
          />
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
            <div 
              className="form-group-list" 
              ref={myRefs}
            >
              <Calendar
                onClickDay={(date) => (
                  stateMethod(createType, 'rangeEndDate', formatDate(date)), 
                  setInputDropdown(''),
                  stateMethod(createType, 'rangeEndOccurrence', '')
                )}
                minDate={new Date(Date.now())}
              />
            </div>
          )}
        </div>
        {message && 
        <span className="form-group-message">
          <SVG svg={dynamicSVG} color={'#fd7e3c'}></SVG>
          {message}
        </span>
        }
        <button 
          className="form-group-button" 
          onClick={(e) => (
            e.preventDefault(),
            stateData.rangeEndOccurrence || stateData.rangeEndDate 
            ?
            (
              stateMethod(createTypeAppointment, 'recurring', stateData),
              setModal('appointments'),
              setMessage('')
            )
            :
            setMessage('Range is required')
          )}>
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
      </form>
      </div>
    </div>
  )
}

export default Recurring
