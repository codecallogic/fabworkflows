import React from 'react'
import { useState, useEffect } from 'react'
import { Calendar, momentLocalizer } from 'react-big-calendar'
import 'react-big-calendar/lib/css/react-big-calendar.css';
import moment from 'moment'
import CalendarModal from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import SVG from '../../files/svgs';
import { formatDate2 } from '../../helpers/validations';

moment.locale('ko', {
  week: {
      dow: 1,
      doy: 1,
  },
});

const localizer = momentLocalizer(moment)

const Schedule = ({
  setModal
}) => {

  const [events, setEvents] = useState([])
  const [dateNow, setDateNow] = useState(new Date(Date.now()))
  const [calendar, setCalendar] = useState(false)

  const eventStyleGetter = (event) => {

    let style = {
      backgroundColor: event.color
    }

    return {
      style: style
    }
  }

  const onNavigate = (newDate) => {
    setDateNow(newDate)
  }

  useEffect(() => {
    setCalendar(false)
  }, [dateNow])
  
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
            onClick={() => setModal('appointments')}
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
          eventPropGetter={eventStyleGetter}
          onNavigate={onNavigate}
          date={dateNow}
        />
      </div>
    </div>
  )
}

export default Schedule
