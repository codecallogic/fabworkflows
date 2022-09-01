import { lightOrDark } from './css'

export const setAllEvents = (appointments, jobs) => {

  let newEvents = []

  if(appointments){
    appointments.forEach((item) => {

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
      
      appointment.type = 'appointment'
      appointment.start = newDate
      appointment.end = endDate
      appointment.originalData = item
      appointment.className = 'appointments'
  
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