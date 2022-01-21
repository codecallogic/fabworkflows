import { API } from '../config'
import axios from 'axios'
import { nanoid } from 'nanoid'
import { validateEmail } from '../helpers/validations'

export {
  submitCreate,
  manageFormFields
}

//// VALIDATIONS
const formFields = {
  slabs: ['material'],
  materials: ['name', 'description'],
  colors: ['name'],
  suppliers: ['name', 'contact_email'],
  locations: ['name']
}

const submitCreate = async (e, stateData, type, setMessage, loadingType, setLoading, token, path, resetType, resetState, allData, setAllData, setDynamicSVG) => {
  e.preventDefault()

  for(let i = 0; i < formFields[type].length; i++){
    
    if(formFields[type][i].includes('email') && !validateEmail(formFields[type][i])) return (setDynamicSVG('notification'), setMessage('Invalid email address'))

    if(!stateData[formFields[type][i]]) return (setDynamicSVG('notification'), setMessage(`${formFields[type][i].replace('_', ' ')} is required`))

  }

  setMessage('')
  console.log(loadingType)
  setLoading(loadingType)
  let data = new FormData()
  
  if(stateData.images && stateData.images.length > 0){
    stateData.images.forEach((item) => {
      let fileID = nanoid()
      data.append('file', item, `${type}-${fileID}.${item.name.split('.')[1]}`)
    })
  }

  if(stateData){
    for(let key in stateData){
      if(key !== 'images') data.append(key, JSON.stringify(stateData[key]))
    }
  }

  try {
    const responseCreate = await axios.post(`${API}/${path}`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
        contentType: 'multipart/form-data'
      }
    })
    setLoading('')
    allData[type]= responseCreate.data
    setAllData(allData)
    setDynamicSVG('checkmark-2')
    setMessage('Item was created')
    resetState(resetType)
    
  } catch (error) {
    console.log(error)
    setLoading('')
    if(error) error.response ? setMessage(error.response.data) : setMessage('Error ocurred with creating item')
  }
}

const manageFormFields = (data, key) => {

  if(typeof data == 'object'){ return data[key] }
  if(typeof data == 'string'){ return data }
  
}