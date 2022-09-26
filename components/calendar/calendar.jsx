import React from 'react'
import { useState, useEffect, useRef} from 'react'
import 'react-big-calendar/lib/css/react-big-calendar.css';
import moment from 'moment'
import CalendarModal from 'react-calendar';
import { Calendar, momentLocalizer } from 'react-big-calendar'
import withDragAndDrop from 'react-big-calendar/lib/addons/dragAndDrop'
import 'react-big-calendar/lib/addons/dragAndDrop/styles.css'
import 'react-calendar/dist/Calendar.css';
import SVG from '../../files/svgs';
import { formatDate2, getTimeHour, formatDate } from '../../helpers/validations';
import { setAllEvents } from '../../helpers/calendar'

const DnDCalendar = withDragAndDrop(Calendar)

moment.locale('ko', {
  week: {
      dow: 1,
      doy: 1,
  },
});

const localizer = momentLocalizer(moment)

const Schedule = ({
  setModal,
  setEdit,
  setAltEdit,
  loading,
  setLoading,
  token,
  setMessage,
  changeView,
  setDynamicSVG,
  theme,
  message,
  modal,
  altEdit,

  // REDUX
  editData,
  stateMethod,
  stateData,
  resetState,

  // DATA
  allData,
  setAllData,

  // CRUD
  submitUpdate
}) => {

  const recurringCreateType = 'CREATE_RECURRING'
  const resetType = 'RESET_JOB'

  const today = new Date();
  const myRefs = useRef(null)
  const [events, setEvents] = useState([])
  const [dateNow, setDateNow] = useState(new Date(Date.now()))
  const [calendar, setCalendar] = useState(false)
  const [id, setID] = useState('')
  const [view, setView] = useState('week')

  const onNavigate = (newDate) => {
    setDateNow(newDate)
  }

  const onView = (newView) => {    
    setView(newView)
  }

  useEffect(() => {
    setCalendar(false)
  }, [dateNow])

  useEffect(() => {    

    let newEvents = setAllEvents(allData.appointments, allData.jobs, view)
    
    setEvents(newEvents)

  }, [allData.appointments, allData.jobs])

  const eventStyleGetter = (event) => {

    let styleAppointment = {
      backgroundColor: theme == 'light' ? '#B8E5CF' : '#B8E5CF',
      border: '0px',
      borderRadius: '0px',
      borderLeft: `10px solid #44A679`,
      fontSize: '12px',
      fontFamily: 'Arial'
      // boxShadow: `.3rem .3rem .3rem .3rem rgba(0,0,0, .2)`
    }

    let styleActivity = {
      backgroundColor: theme == 'light' ? '#E4E8F8' : '#383838',
      border: '0px',
      borderLeft: `10px solid ${event.backgroundColor}`,
      borderRadius: '0px',
      fontSize: '12px',
      fontFamily: 'Arial'
      // boxShadow: `.3rem .3rem .3rem .3rem rgba(0,0,0, .2)`
    }
    
    return {
      className: event.className,
      style: event.type == 'activity' ? styleActivity : styleAppointment
    }

  }

  const onSelectEvent = (event) => {
    
    if(event.type == 'appointment'){
      editData('appointments', 'CREATE_APPOINTMENT', stateMethod, allData, null, null, event.originalData._id)
      
      if(event.originalData.recurring){
        let keys = []

        Object.keys(event.originalData.recurring).forEach( (key) => {
          keys.push(key)
        })

        Object.values(event.originalData.recurring).forEach( (value, idx) => {
          stateMethod(recurringCreateType, keys[idx], value)
        })
        
      }
      
      setEdit('appointment'),
      setModal('appointments')
    }

    if(event.type == 'activity'){
      editData('jobs', 'CREATE_JOB', stateMethod, allData, null, null, event.jobID)
      setID(event.originalData._id)
      
    }
    
  }

  const onEventDrop = ({event, start, end, isAllDay}) => {
    
    if(event.type == 'activity'){
      let job
      
      allData.jobs.forEach((item, idx) => {
        if(item._id == event.jobID) job = item
      })

      if(job){
        job.activities.forEach((item, idx) => {
          if(item._id == event.id){
            item.scheduleTime = getTimeHour(start)
            item.startDate = formatDate(start)
          }
        })
      }

      let newEvents = setAllEvents(null, allData.jobs)
      setEvents(newEvents)

      submitUpdate(null, job, 'jobs', 'files', setMessage, 'update_activity_drag_drop', setLoading, token, 'jobs/update-job', resetType, resetState, allData, setAllData, setDynamicSVG, changeView, 'calendar')

    }

  }

  useEffect(() => {
    setID('')
  }, [])

  useEffect(() => {
    
    if(stateData.activities && id){
      let idxUpdate  

      stateData.activities.map((item, idx) => {
        if(item._id == id) idxUpdate = idx
      })

      editData('activities', 'CREATE_ACTIVITY', stateMethod, stateData.activities, null, idxUpdate, null, stateData.activities)

      const newJob = new Object()
      newJob.name = stateData.name
      newJob._id = stateData._id
      newJob.account = stateData.account
      
      stateMethod('CREATE_ACTIVITY', 'job', newJob)
      setAltEdit('activities')
      setModal('activities')
    }
    
  }, [stateData])

  useEffect( async () => {
    
    if(loading == 'update_activity_job_form' && altEdit){

      try {
      
        const response = await submitUpdate(null, stateData, 'jobs', 'files', setMessage, 'update_activity_job_form', setLoading, token, 'jobs/update-job', 'RESET_ACTIVITY', resetState, allData, setAllData, setDynamicSVG, changeView, 'calendar', setModal, setAltEdit)

        setLoading('')
        setAltEdit('')

      } catch (error) {
        console.log(error)
        if(error) setMessage(error.response ? error.response.data : error)
      }
    }
    
  }, [stateData.activities])

  const CustomEvent = (event) => {
   
    if(event.event.type == 'activity'){
      return (
        <div className="customEventActivity">
          {/* <SVG svg={'title'}></SVG> */}
          <span>{event.event.jobName.substring(0, 10)}</span>
          <span><SVG svg={'job'}></SVG>{event.title}</span>
          <span><SVG svg={'account'}></SVG>{event.event.assigned.length} assigned</span>
          <span><SVG svg={'clock'}></SVG>{getTimeHour(event.event.startDateInfo)} - {getTimeHour(event.event.endDateInfo)}</span>
        </div>
      );
    }

    if(event.event.type == 'appointment'){      
      return (
        <div className="customEventAppointment">
          {/* <SVG svg={'job'}></SVG> */}
          <span>{event.title.substring(0, 10)}</span>
          <span><SVG svg={'account'}></SVG>{event.event.assigned.length} assigned</span>
          <span><SVG svg={'clock'}></SVG>{getTimeHour(event.event.startDateInfo)} - {getTimeHour(event.event.endDateInfo)}</span>
        </div>
      );
    }

  }

  useEffect(() => {

    if(view == 'week'){
      let els = document.querySelectorAll('.rbc-row')

      els.forEach((el, idx) => {
        el.classList.add('weekBox')
      })

    }

    // if(view == 'day'){
    //   let elLabels = document.querySelectorAll('.rbc-label')
    //   let elContent = document.querySelector('.rbc-time-content')

    //   elLabels.forEach((el, idx) => {
    //     el.classList.add('displayBlock')
    //   })

    //   elContent.classList.add('displayBlock')
      
    //   console.log(elLabels)
    //   console.log(elContent)

    //   let newEvents = setAllEvents(allData.appointments, allData.jobs, view)
    
    //   setEvents(newEvents)

    // }
    
  }, [view])

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
    <>
    <div className="calendar">
      <div className="calendar-tools"> 
        <div
          className="calendar-tools-date"
          onClick={() => calendar ? setCalendar(false) : setCalendar(true)} 
        >
          <SVG svg={'calendar'}></SVG>
          <span>{formatDate2(dateNow)}</span>
          {loading == 'update_activity_drag_drop' && <span><div className="loading-spinner"></div></span>}
        </div>
        <div className="calendar-tools-controls">
          <div className="calendar-tools-controls-item"
            onClick={() => (
              setEdit(''),
              setModal('calendarOptions')
            )}
          >
            <SVG svg={'options'}></SVG>
          </div>
          <div className="calendar-tools-controls-item"
            onClick={() => (
              setEdit(''),
              setModal('appointments')
            )}
          >
            <SVG svg={'plus'}></SVG>
          </div>
        </div>
      </div>
      {calendar && 
        <div className="calendar-popup">
          <div className="calendar-popup-item">
            <CalendarModal
              onClickDay={ (date) => (
                setDateNow(date)
              )}
              minDate={new Date(Date.now())}
            />
          </div>
        </div>
      }
      <div className="calendar-view">
        <DnDCalendar
          localizer={localizer} 
          events={events}
          components={{
            event: CustomEvent
          }}
          startAccessor="start"
          endAccessor="end"
          view={view}
          views={{
            day: true,
            week: true,
            month: true
          }}
          onNavigate={onNavigate}
          date={dateNow}
          onView={onView}
          eventPropGetter={eventStyleGetter}
          onSelectEvent={onSelectEvent}
          onEventDrop={onEventDrop}
          resizableAccessor={() => false}
          timeslots={2}
          step={15}
          min={
            new Date(
              today.getFullYear(), 
              today.getMonth(), 
              today.getDate(), 
              7
            )
          }
          max={
            new Date(
              today.getFullYear(), 
              today.getMonth(), 
              today.getDate(), 
              20
            )
          }
        />
      </div>
    </div>
    {modal == 'calendarOptions' &&
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
           Calendar Options
        </span>
        <div onClick={() => (setModal(''), resetState(resetType), setMessage(''))}>
          <SVG svg={'close'}></SVG>
        </div>
      </div>
      <form 
      className="addFieldItems-modal-form" 
      > 
        
      </form>

      <div className="addFieldItems-modal-box-footer">
          {message && 
          <span className="form-group-message">
            <SVG svg={dynamicSVG} color={'#fd7e3c'}></SVG>
            {message}
          </span>
          }
          <button 
          className="form-group-button" 
          onClick={(e) => null}
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
      </div>
    </div>
    </div>
    }
    </>
  )
}

export default Schedule
