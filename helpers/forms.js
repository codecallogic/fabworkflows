import {API} from '../config'
import axios from 'axios'
import {nanoid} from 'nanoid'

export {
  submitCreate,
  manageFormFields
}

//// VALIDATIONS
const formFields = {
  slabs: ['material']
}

const submitCreate = async (e, stateData, type, setMessage, setLoading, token, path, resetState, allData, setAllData) => {
  e.preventDefault()
  setMessage('')
  console.log(allData)

  for(let i = 0; i < formFields[type].length; i++){
    if(!stateData[formFields[type][i]]) return setMessage(`${formFields[type][i].replace('_', ' ')} is required`)
  }

  setLoading('create_slab')
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
    setMessage('Slab was created')
    resetState()
    
  } catch (error) {
    console.log(error)
    setLoading('')
    if(error) error.response ? setMessage(error.response.data) : setMessage('Error ocurred with creating a slab')
  }
}

const manageFormFields = (data, key) => {

  if(typeof data == 'object'){ return data[key] }
  if(typeof data == 'string'){ return data }
  
}