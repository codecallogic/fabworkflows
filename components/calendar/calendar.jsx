import React from 'react'
import { useState, useEffect } from 'react'
import { Calendar, momentLocalizer } from 'react-big-calendar'
import 'react-big-calendar/lib/css/react-big-calendar.css';
import moment from 'moment'
import CalendarModal from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import SVG from '../../files/svgs';
import { formatDate2 } from '../../helpers/validations';
import { areArraysEqual } from '@mui/base';

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

  // DATA
  allData
}) => {

  const [events, setEvents] = useState([])
  const [dateNow, setDateNow] = useState(new Date(Date.now()))
  const [calendar, setCalendar] = useState(false)

  const onNavigate = (newDate) => {
    setDateNow(newDate)
  }

  const onView = (view) => {
    
  }

  useEffect(() => {
    setCalendar(false)
  }, [dateNow])

  useEffect(() => {    

    let newEvents = []
    
    allData.appointments.forEach((item) => {

      let appointment = new Object()

      appointment.id = item._id
      appointment.title = item.name

      let startTime = item.scheduleTime.split(' ')
      let hourTime = startTime[0].split(':')[0]
      let timePeriod = startTime[1]
      let minutes = item.duration.split(' ')[0]
      let minutesType = item.duration.split(' ')[1]

      if(minutesType !== 'min'){
        let hours = minutes.split('.')
        if(hours[0]) minutes = hours[0] * 60
        if(hours[1]) minutes = minutes + 30
      }

      let newDate = new Date(item.startDate)
      let endDate = new Date(item.startDate)
      newDate.setHours(hourTime)
      endDate.setHours(hourTime)
      
      endDate.setMinutes(minutes)
      
      appointment.start = newDate
      appointment.end = endDate
      appointment.className = 'appointments'

      newEvents.push(appointment)
      
    })

    allData.jobs.forEach((job) => {

      job.activities.forEach((item) => {

        let activity = new Object()

        activity.id = item._id
        activity.title = item.name

        let startTime = item.scheduleTime.split(' ')
        let hourTime = startTime[0].split(':')[0]

        let timePeriod = startTime[1]
        let minutes = item.duration.split(' ')[0]
        let minutesType = item.duration.split(' ')[1]

        if(minutesType !== 'min'){
          let hours = minutes.split('.')
          if(hours[0]) minutes = hours[0] * 60
          if(hours[1]) minutes = minutes + 30
        }

        let newDate = new Date(item.startDate)
        let endDate = new Date(item.startDate)
        
        if(hourTime){
          newDate.setHours(hourTime)
          endDate.setHours(hourTime)
        }

        if(minutes){
          endDate.setMinutes(minutes)
        }
        
        activity.start = newDate
        activity.end = endDate
        activity.className = 'activities'
        
        newEvents.push(activity)
      })
      
    })

    setEvents(newEvents)

  }, [allData.appointments, allData.jobs])

  const eventStyleGetter = (event) => {

    return {
      className: event.className
    }
  }

  
  return (
    <div className="calendar">
      <div className="calendar-tools"> 
        <div
          className="calendar-tools-date"
          onClick={() => calendar ? setCalendar(false) : setCalendar(true)} 
        >
          <SVG svg={'calendar'}></SVG>
          <span>{formatDate2(dateNow)}</span>
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
        <Calendar
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
        />
      </div>
    </div>
  )
}

export default Schedule
