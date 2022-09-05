import { lightOrDark } from './css'

const generateAppointment = (item, day, workday) => {
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

  if(day){
    let startDate = `${item.startDate.split('/')[0]}/${day}/${item.startDate.split('/')[2]}`
    
    newDate = new Date(startDate)
    endDate = new Date(startDate)
  }

  if(workday){
    newDate = new Date(workday)
    endDate = new Date(workday)
  }

  newDate.setHours(hourTime)
  endDate.setHours(hourTime)
  
  endDate.setMinutes(minutes)
  
  appointment.type = 'appointment'
  appointment.start = newDate
  appointment.end = endDate
  appointment.originalData = item
  appointment.className = 'appointments'

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
        
        activity.type = 'activity'
        activity.start = newDate
        activity.end = endDate
        activity.originalData = item
        activity.backgroundColor = item.color
        
        if(lightOrDark(item.color) == 'dark') activity.className = 'activities-light'
        if(lightOrDark(item.color) == 'light') activity.className = 'activities-dark'
        
        activity.jobID = job._id
        
        newEvents.push(activity)
      })
      
    })

    return newEvents
  }
  
}