import { API } from '../config'
import axios from 'axios'

const errorHandlingConfirmed = (error, setLoading, setMessage) => {
  
  if(error == 'startDate'){
    setMessage('Start date required to confirm an activity')
    // setLoading('')
  }

  if(error == 'scheduleTime'){
    setMessage('Schedule time required to confirm an activity')
    // setLoading('')
  }

  if(error == 'duration'){
    setMessage('Duration required to confirm an activity')
    // setLoading('')
  }

  if(error == 'assignee'){
    setMessage('Assignee required to confirm an activity')
    // setLoading('')
  }
  
}

export const newActivityConfirmed = async (token, stateData, setModal, setLoading, loadingType, setMessage, setDynamicSVG) => {
  
  if(!stateData.status) return setModal('')

  setLoading(loadingType)

  if(stateData.status == 'confirmed'){
    if(!stateData.startDate) return errorHandlingConfirmed('startDate', setLoading, setMessage)
    if(!stateData.scheduleTime) return errorHandlingConfirmed('scheduleTime', setLoading, setMessage)
    if(!stateData.duration) return errorHandlingConfirmed('duration', setLoading, setMessage)
    if(stateData.assignee.length == 0) return errorHandlingConfirmed('assignee', setLoading, setMessage)
  }

  if(stateData.status !== 'confirmed') return (setLoading(''), setModal(''))

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