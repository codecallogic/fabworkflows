import React from 'react'
import { useState, useEffect } from 'react'
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

  const [events, setEvents] = useState([])
  const [dateNow, setDateNow] = useState(new Date(Date.now()))
  const [calendar, setCalendar] = useState(false)
  const [id, setID] = useState('')

  const onNavigate = (newDate) => {
    setDateNow(newDate)
  }

  const onView = (view) => {
    
  }

  useEffect(() => {
    setCalendar(false)
  }, [dateNow])

  useEffect(() => {    

    let newEvents = setAllEvents(allData.appointments, allData.jobs)
    
    setEvents(newEvents)

  }, [allData.appointments, allData.jobs])

  const eventStyleGetter = (event) => {

    let style = {
      backgroundColor: event.backgroundColor
    }
    
    return {
      className: event.className,
      style: style
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
      setAltEdit('activities')
      setModal('activities')
    }
    
  }, [stateData])

  useEffect(() => {
    
    if(loading == 'update_activity_job_form'){
      
      submitUpdate(null, stateData, 'jobs', 'files', setMessage, 'update_activity_job_form', setLoading, token, 'jobs/update-job', resetType, resetState, allData, setAllData, setDynamicSVG, changeView, 'calendar', setModal, setAltEdit)

    }
    
  }, [stateData.activities])

  
  return (
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
              setModal('appointments')
            )}
          ><SVG svg={'plus'}></SVG></div>
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
          startAccessor="start"
          endAccessor="end"
          view={'week'}
          views={['week']}
          onNavigate={onNavigate}
          date={dateNow}
          onView={onView}
          eventPropGetter={eventStyleGetter}
          onSelectEvent={onSelectEvent}
          onEventDrop={onEventDrop}
          resizableAccessor={() => false}
        />
      </div>
    </div>
  )
}

export default Schedule
