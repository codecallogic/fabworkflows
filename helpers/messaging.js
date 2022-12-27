import { API } from '../config'
import axios from 'axios'
import { formatDate, validateZipCode } from './validations'

const errorHandlingConfirmed = (error, setLoading, setMessage) => {
  
  if(error == 'startDate'){
    setMessage('Start date required to confirm an activity')
    setLoading('error_loading')
  }

  if(error == 'scheduleTime'){
    setMessage('Schedule time required to confirm an activity')
    setLoading('error_loading')
  }

  if(error == 'duration'){
    setMessage('Duration required to confirm an activity')
    setLoading('error_loading')
  }

  if(error == 'assignee'){
    setMessage('Assignee required to confirm an activity')
    setLoading('error_loading')
  }
  
}

export const newActivityConfirmed = async (token, stateData, setModal, setLoading, loadingType, setMessage, setDynamicSVG) => {
  
  if(!stateData.status) return setModal('')

  if(stateData.status === 'confirmed'){
    if(!stateData.startDate) return errorHandlingConfirmed('startDate', setLoading, setMessage)
    if(!stateData.scheduleTime) return errorHandlingConfirmed('scheduleTime', setLoading, setMessage)
    if(!stateData.duration) return errorHandlingConfirmed('duration', setLoading, setMessage)
    if(stateData.assignee.length == 0) return errorHandlingConfirmed('assignee', setLoading, setMessage)
  }

  if(stateData.status !== 'confirmed') return (setLoading(''), setModal(''))

  setLoading(loadingType)

  let data = new FormData()
  
  if(stateData){
    for(let key in stateData){
      data.append(key, JSON.stringify(stateData[key]))
    }
  }
  
  try {
    
    const responseMessage = await axios.post(`${API}/messaging/send-message`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
        contentType: 'multipart/form-data',
      },
      maxContentLength: 1000000000000,
      maxBodyLength: 10000000000000
    })

    setLoading('')
    setMessage(responseMessage.data)
    setModal()
    
  } catch (error) {
    
    console.log(error)
    setLoading('')

    if(error){
      error.response ? 
      error.response.statusText == 'Unauthorized' ? 
      (setDynamicSVG('notification'), setMessage(error.response.statusText), window.location.href = '/login') : 
      (setDynamicSVG('notification'), setMessage(error.response.data)) : 
      (setDynamicSVG('notification'), setMessage('Error ocurred with creating item'))
    }
    
  }
  
}

export const insertAppointmentKey = (key, data, type) => {


  if(type == 0){
    let content = document.getElementById('messageContent').textContent
  
    document.getElementById('messageContent').textContent = content + ` ` + `{{${key}}}`.trim()
    data.template = content + ` ` + `{{${key}}}`.trim()
  }

  if(type == 1){
    let content = document.getElementById('emailContent').textContent
  
    document.getElementById('emailContent').textContent = content + ` ` + `{{${key}}}`.trim()
    data.emailTemplate = content + ` ` + `{{${key}}}`.trim()
  }
  
}

export const onInputContent = (data, content, type) => {

  if(type == 'message') data.template = content
  if(type == 'email') data.emailTemplate = content
  
}

const manageType = (data) => {

  if(Array.isArray(data)) return data[0]
  if(!Array.isArray(data) && typeof data == 'object') return data
  if(!Array.isArray(data) && typeof data !== 'object') return data
}

export const showPreview = (event, template) => {
  
  let array = template.split(' ')
  let newArray = []
  
  array.map((item, idx) => {
    if(item.includes('{{')){
      let newItem = item.replace(/{{2,}|}{2,}/g, '')
      let keys = newItem.split('.')
      
      if(keys[0]) newItem = manageType(event[keys[0]])
      if(keys[1]) newItem = manageType(newItem[keys[1]])
      if(keys[2]) newItem = manageType(newItem[keys[2]])
      if(keys[3]) newItem = manageType(newItem[keys[3]])
      
      console.log(keys)
      if(validateZipCode(newItem) && !isNaN(new Date(newItem))) newItem = formatDate(newItem)
      
      newArray.push(newItem)

    }else{
      newArray.push(item)
    }
  })

  return newArray.join(' ')
  
}

export const stringCount = (event, template) => {
  let regex = /[a-zA-Z0-9]/g
  
  let array = template.split(' ')
  let newArray = []
  
  array.map((item, idx) => {
    if(item.includes('{{')){
      let newItem = item.replace(/{{2,}|}{2,}/g, '')
      let keys = newItem.split('.')
      
      if(keys[0]) newItem = manageType(event[keys[0]])
      if(keys[1]) newItem = manageType(newItem[keys[1]])
      if(keys[2]) newItem = manageType(newItem[keys[2]])
      if(keys[3]) newItem = manageType(newItem[keys[3]])
      
      if(validateZipCode(newItem) && !isNaN(new Date(newItem))) newItem = formatDate(newItem)
      newArray.push(newItem)

    }else{
      newArray.push(item)
    }
  })

  let str = newArray.join(' ')

  if(str.match(regex)){
    return str.match(regex).length
  }

  return ''

  
}