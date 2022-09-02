import { lightOrDark } from './css'

const generateAppointment = (item, day) => {
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
                newDay = newDay + 2
                // let newStartDate = `${newItem.startDate.split('/')[0]}/${newDay}/${newItem.startDate.split('/')[2]}`
                // console.log(newStartDate)

                // newItem.startDate = newStartDate

                let appointment = generateAppointment(item, newDay)

                newEvents.push(appointment)
                
                // newItem.startDate = `${newItem.startDate.split('/')[0]}/${newDay}/${newItem.startDate.split('/')[2]}`
                // console.log(newItem)
                // item.startDate = `${item.startDate.split('/')[0]}/${+item.startDate.split('/')[1] + +item.recurring.occurrenceDay}/${item.startDate.split('/')[2]}`
                // console.log(item.startDate)

              }
            }
            
          }
          
          if(item.recurring.occurenceType == 'workday'){

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