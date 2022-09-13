import { listItemClasses } from '@mui/material'
import { lightOrDark } from './css'

const generateAppointment = (item, day, workday) => {
  let appointment = new Object()
  
  appointment.id = item._id
  appointment.title = item.name

  let startTime = item.scheduleTime.split(' ')
  let hourTime = startTime[0].split(':')[0]
  let startMinutes = startTime[0].split(':')[1]
  let minutes = item.duration.split(' ')[0]
  let minutesType = item.duration.split(' ')[1]

  if(startTime[1] == 'PM') hourTime = +hourTime + 12

  let newDate = new Date(item.startDate)
  let endDate = new Date(item.startDate)

  if(day){
    let startDate = `${item.startDate.split('/')[0]}/${day}/${item.startDate.split('/')[2]}`
    
    newDate = new Date(startDate)
    endDate = new Date(startDate)
  }

  if(workday){
    newDate = new Date(workday)
    endDate = new Date(workday)
  }

  let startDateInfo = new Date(item.startDate)
  let endDateInfo = new Date(item.startDate)


  if(hourTime){
    startDateInfo.setHours(hourTime)
    startDateInfo.setMinutes(+startMinutes)

    let duration = +hourTime
    let durationMinutes = 0
    
    if(item.duration){
      let type = item.duration.split(' ')[1]

      if(type == 'hour' || type == 'hours'){

        durationMinutes = newDate.getMinutes()
        
        if(item.duration.split(' ')[0].split('.')[0]) duration = +duration + +item.duration.split(' ')[0].split('.')[0]

        if(item.duration.split(' ')[0].split('.')[1]) durationMinutes = +durationMinutes + 30

        // if(checkNumber(duration)) durationMinutes += 30
        
      }

      if(type == 'min'){

        durationMinutes = newDate.getMinutes()
        
        if(item.duration.split(' ')[0]) durationMinutes = +durationMinutes + +item.duration.split(' ')[0]
      }
    }

    endDateInfo.setHours(+duration)
    endDateInfo.setMinutes(+durationMinutes)
  }
  
  appointment.type = 'appointment'
  appointment.start = newDate
  appointment.end = endDate
  appointment.startDateInfo = startDateInfo
  appointment.endDateInfo = endDateInfo
  appointment.originalData = item
  appointment.className = 'appointments'
  appointment.assigned = item.assigne

  return appointment
}

const getNumberOfDays = (start, end) => {
  const date1 = new Date(start);
  const date2 = new Date(end);

  // One day in milliseconds
  const oneDay = 1000 * 60 * 60 * 24;

  // Calculating the time difference between two dates
  const diffInTime = date2.getTime() - date1.getTime();

  // Calculating the no. of days between two dates
  const diffInDays = Math.round(diffInTime / oneDay);

  return diffInDays;

}

const getWeekDayList = (startDate, endDate) => {
  let days = []
  let end = new Date(endDate)

  for (let start = new Date(startDate); start <= end; start.setDate(start.getDate() + 1)) {
    let day = start.getDay();

    if (day != 6 && day != 0) {
      days.push(new Date(start));
    }
  }

  return days
  
}

function checkNumber(x) {
  // check if the passed value is a number
  if(typeof x == 'number' && !isNaN(x)){
  
      // check if it is integer
      if (Number.isInteger(x)) {

          return false
      }
      else {

          return true
      }
  
  } else {

      return false
  }
}

export const setAllEvents = (appointments, jobs) => {

  let newEvents = []

  if(appointments){
    appointments.forEach((item) => {
      
      if(item.recurring){
        // console.log(item)
        if(item.recurring.type == 'daily'){

          if(!item.recurring.occurrenceType && item.recurring.occurrenceDay){
            if(item.recurring.rangeEndOccurrence){
              let newDay = +item.startDate.split('/')[1]
              
              for(let i = 0; i < item.recurring.rangeEndOccurrence; i++){
                newDay = newDay + +item.recurring.occurrenceDay

                let appointment = generateAppointment(item, newDay)

                newEvents.push(appointment)

              }
            }

            if(item.recurring.rangeEndDate){
              let newDay = +item.startDate.split('/')[1]
              let occurrence = getNumberOfDays(item.startDate, item.recurring.rangeEndDate) / +item.recurring.occurrenceDay
              
              for(let i = 0; i < Math.floor(occurrence); i++){
                newDay = newDay + +item.recurring.occurrenceDay

                let appointment = generateAppointment(item, newDay)

                newEvents.push(appointment)

              }

              
            }
            
          }
          
          if(item.recurring.occurrenceType == 'workday'){

            if(item.recurring.rangeEndOccurrence){
              let start = new Date(item.startDate)
              let days = []
              let weekends = [1, 2, 3, 4, 5]

              while(days.length < +item.recurring.rangeEndOccurrence){
                let newDay = start.setDate(start.getDate() + 1)
                start = new Date(newDay)

                if(weekends.includes(new Date(newDay).getDay())){
                  days.push(new Date(newDay))
                }
                
              }

              for(let i = 0; i < days.length; i++){
                let appointment = generateAppointment(item, null, days[i])
                newEvents.push(appointment)
              }
              
            }

            if(item.recurring.rangeEndDate){
              let days = getWeekDayList(item.startDate, item.recurring.rangeEndDate)
              if(days.length > 0){

                for(let i = 1; i < days.length; i++){
                  let appointment = generateAppointment(item, null, days[i])
                  newEvents.push(appointment)
                }
                
              }
              
            }
          }

        }

        if(item.recurring.type == 'weekly'){
          if(item.recurring.occurrenceWeek && item.recurring.occurrenceType){
            let start = new Date(item.startDate)
            let days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
            let firstOccurrence
            
            while(firstOccurrence == undefined){
              let newDay = start.setDate(start.getDate() + 1)
              start = new Date(newDay)

              if(new Date(newDay).getDay() == days.indexOf(item.recurring.occurrenceType)) firstOccurrence = new Date(newDay)
              
            }

            let newStartDate
            if(firstOccurrence) newStartDate = firstOccurrence

            if(item.recurring.rangeEndOccurrence){
              let appointment = generateAppointment(item, null, firstOccurrence)
              newEvents.push(appointment)
              
              for(let i = 0; i < item.recurring.rangeEndOccurrence; i++){
                let newWeek = newStartDate.setDate(newStartDate.getDate() + (7*+item.recurring.occurrenceWeek))
                newStartDate = new Date(newWeek)

                let appointment2 = generateAppointment(item, null, newStartDate)
                newEvents.push(appointment2)
              }
            }

            if(item.recurring.rangeEndDate){
              let firstWeek = new Date(firstOccurrence)

              let appointment = generateAppointment(item, null, firstWeek)
              newEvents.push(appointment)
              
              while(new Date(firstWeek) < new Date(item.recurring.rangeEndDate)){
                let newWeek = firstWeek.setDate(firstWeek.getDate() + (7*+item.recurring.occurrenceWeek))

                if(new Date(newWeek) > new Date(item.recurring.rangeEndDate)) break;
                
                firstWeek = new Date(newWeek)

                let appointment = generateAppointment(item, null, newWeek)
                newEvents.push(appointment)
                
              }
            }
            
          }
        }

        if(item.recurring.type == 'monthly'){
          if(item.recurring.occurrenceMonth && item.recurring.occurrenceType){
            let days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
            let weeks = ['first', 'second', 'third', 'fourth']
            let dayType = days.indexOf(item.recurring.occurrenceType.split('-')[1])
            let weekType = weeks.indexOf(item.recurring.occurrenceType.split('-')[0])
            let start = new Date(item.startDate)

            if(item.recurring.rangeEndOccurrence){
              let currentMonth
              let occurrences = []
              
              for(let i = 0; i < item.recurring.rangeEndOccurrence; i++){
                currentMonth = start.getUTCMonth() + +item.recurring.occurrenceMonth
                let newMonth = start.setMonth(currentMonth)
                newMonth = new Date(newMonth)
                newMonth = new Date(newMonth.setDate(1))
              
                if(newMonth.getDay() == dayType) occurrences.push(newMonth)
                if(newMonth.getDay() !== dayType){
                  let monthDay = new Date(newMonth)

                  while(new Date(monthDay).getDay() !== dayType){
                    monthDay = new Date(monthDay).setDate(new Date(monthDay).getDate() + 1)
                  }

                  occurrences.push(new Date(monthDay))
                  
                }

              }

              if(occurrences){
                for(let i = 0; i < occurrences.length; i++){
                  let newDate = new Date(occurrences[i])
                  newDate = newDate.setDate(newDate.getDate() + (weekType * 7))
                  newDate = new Date(newDate)

                  let appointment = generateAppointment(item, null, newDate)
                  newEvents.push(appointment)
                }
              }

            }

            if(item.recurring.rangeEndDate){
              let currentMonth
              let occurrences = []

              while(new Date(start) <= new Date(item.recurring.rangeEndDate)){
                currentMonth = start.getUTCMonth() + +item.recurring.occurrenceMonth
                let newMonth = start.setMonth(currentMonth)
                newMonth = new Date(newMonth)
                newMonth = new Date(newMonth.setDate(1))

                if(newMonth > new Date(item.recurring.rangeEndDate)) break;
              
                if(newMonth.getDay() == dayType){
                  start = new Date(newMonth)
                  occurrences.push(newMonth)
                }
                if(newMonth.getDay() !== dayType){
                  let monthDay = new Date(newMonth)

                  while(new Date(monthDay).getDay() !== dayType){
                    monthDay = new Date(monthDay).setDate(new Date(monthDay).getDate() + 1)
                  }

                  start = new Date(monthDay)
                  occurrences.push(new Date(monthDay))
                  
                }
              }

              if(occurrences){
                for(let i = 0; i < occurrences.length; i++){
                  let newDate = new Date(occurrences[i])
                  newDate = newDate.setDate(newDate.getDate() + (weekType * 7))
                  newDate = new Date(newDate)

                  let appointment = generateAppointment(item, null, newDate)
                  newEvents.push(appointment)
                }
              }
              
            }
          }

          if(!item.recurring.occurrenceType && item.recurring.occurrenceMonth && item.recurring.occurrenceDay){
            let start = new Date(item.startDate)

            if(item.recurring.rangeEndOccurrence){
              let currentMonth

              for(let i = 0; i < item.recurring.rangeEndOccurrence; i++){
                currentMonth = start.getUTCMonth() + +item.recurring.occurrenceMonth
                let newMonth = start.setMonth(currentMonth)
                newMonth = new Date(newMonth)
                newMonth = new Date(newMonth.setDate(+item.recurring.occurrenceDay))
                start = newMonth

                let appointment = generateAppointment(item, null, newMonth)
                newEvents.push(appointment)
              }

            }

            if(item.recurring.rangeEndDate){
              let currentMonth
 
              while(start <= new Date(item.recurring.rangeEndDate)){

                currentMonth = start.getUTCMonth() + +item.recurring.occurrenceMonth
                let newMonth = start.setMonth(currentMonth)
                newMonth = new Date(newMonth)
                newMonth = new Date(newMonth.setDate(+item.recurring.occurrenceDay))
                start = newMonth

                let appointment = generateAppointment(item, null, newMonth)
                newEvents.push(appointment)

              }
              
            }
            
          }
          
        }

      }

    })
  }

  if(appointments){

    appointments.forEach((item) => {

      let appointment = generateAppointment(item)

      newEvents.push(appointment)
      
    })

  }

  if(jobs){
    jobs.forEach((job) => {

      job.activities.forEach((item) => {
        let activity = new Object()
        
        activity.id = item._id
        activity.title = item.name
  
        let startTime = item.scheduleTime.split(' ')
        let hourTime = startTime[0].split(':')[0]
        let startMinutes = startTime[0].split(':')[1]

        if(startTime[1] == 'PM') hourTime = +hourTime + 12

        let newDate = new Date(item.startDate)
        let endDate = new Date(item.startDate)

        let newDateInfo = new Date(item.startDate)
        let endDateInfo = new Date(item.startDate)
        
        if(hourTime){
          newDateInfo.setHours(hourTime)
          newDateInfo.setMinutes(+startMinutes)

          let duration = +hourTime
          let durationMinutes = 0
          
          if(item.duration){
            let type = item.duration.split(' ')[1]

            if(type == 'hour' || type == 'hours'){

              durationMinutes = newDate.getMinutes()
              
              if(item.duration.split(' ')[0].split('.')[0]) duration = +duration + +item.duration.split(' ')[0].split('.')[0]

              if(item.duration.split(' ')[0].split('.')[1]) durationMinutes = +durationMinutes + 30

              // if(checkNumber(duration)) durationMinutes += 30
              
            }

            if(type == 'min'){

              durationMinutes = newDate.getMinutes()
              
              if(item.duration.split(' ')[0]) durationMinutes = +durationMinutes + +item.duration.split(' ')[0]
            }
          }

          endDateInfo.setHours(+duration)
          endDateInfo.setMinutes(+durationMinutes)
        }
        
        activity.type = 'activity'
        activity.start = newDate
        activity.end = endDate
        activity.startDateInfo = newDateInfo
        activity.endDateInfo = endDateInfo
        activity.originalData = item
        activity.backgroundColor = item.color
        activity.jobName = job.name
        activity.jobID = job._id
        activity.assigned = item.assignee
        
        if(lightOrDark(item.color) == 'dark') activity.className = 'activities-light'
        if(lightOrDark(item.color) == 'light') activity.className = 'activities-dark'
        
        activity.jobID = job._id
        
        newEvents.push(activity)
      })
      
    })

    return newEvents
  }
  
}