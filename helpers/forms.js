import { API } from '../config'
import axios from 'axios'
import { nanoid } from 'nanoid'
import { validateEmail } from '../helpers/validations'

export {
  formFields,
  manageFormFields,
  submitCreate,
  submitUpdate,
  submitDeleteImage,
  submitDeleteRow,
  submitSearch,
  resetDataType
}

//// FORM FIELDS
const formFields = {
  slabs: ['material'],
  materials: ['name', 'description'],
  colors: ['name'],
  suppliers: ['name', 'contact_email'],
  locations: ['name'],
  products: ['brand'],
  brands: ['name'],
  models: ['name'],
  categories: ['name'],
  remnants: ['name'],
  prices: ['brand', 'price', 'model'],
  contacts: ['contact_name', 'phone', 'email'],
  quotes: ['contact_name', 'phone', 'email', 'quote_lines', 'quote_subtotal', 'quote_total', 'quote_balance', 'quote_date', 'quote_name', 'quote_number'],
  payment: ['name', 'address', 'city', 'state', 'zip_code'],
  phases: ['name'],
  jobs: ['name', 'account', 'date', 'invoice'],
  assignees: ['name', 'color']
}


const manageFormFields = (data, key) => {  

  if(data){
    if(typeof data == 'object'){ return data[key] }
    if(typeof data == 'string'){ return data }
  }else{
    return ''
  }
  
}

const submitCreate = async (e, stateData, type, setMessage, loadingType, setLoading, token, path, resetType, resetState, allData, setAllData, setDynamicSVG) => {
  e.preventDefault()

  for(let i = 0; i < formFields[type].length; i++){
    
    if(formFields[type][i].includes('email') && !validateEmail(formFields[type][i])) return (setDynamicSVG('notification'), setMessage('Invalid email address'))

    if(!stateData[formFields[type][i]] || stateData[formFields[type][i]].length < 1) return (setDynamicSVG('notification'), setMessage(`${formFields[type][i].replace('_', ' ')} is required`))

  }

  setMessage('')
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

    if(loadingType == 'create_email') setMessage(responseCreate.data)
    
  } catch (error) {
    console.log(error)
    setLoading('')
    if(error)  error.response ? error.response.statusText == 'Unauthorized' ? (setDynamicSVG('notification'), setMessage(error.response.statusText), window.location.href = '/login') : (setDynamicSVG('notification'), setMessage(error.response.data)) : (setDynamicSVG('notification'), setMessage('Error ocurred with creating item'))
  }
}

const submitUpdate = async (e, stateData, type, setMessage, loadingType, setLoading, token, path, resetType, resetState, allData, setAllData, setDynamicSVG, changeView, viewType, setModal) => {
  for(let i = 0; i < formFields[type].length; i++){
    
    if(formFields[type][i].includes('email') && !validateEmail(formFields[type][i])) return (setDynamicSVG('notification'), setMessage('Invalid email address'))

    if(!stateData[formFields[type][i]]) return (setDynamicSVG('notification'), setMessage(`${formFields[type][i].replace('_', ' ')} is required`))

  }

  setMessage('')
  setLoading(loadingType)
  let data = new FormData()
  
  if(stateData.images && stateData.images.length > 0){
    stateData.images.forEach((item) => {
      let fileID = nanoid()
      if(!item.key) return data.append('file', item, `${type}-${fileID}.${item.name.split('.')[1]}`)
    })
  }

  if(stateData){
    for(let key in stateData){
      data.append(key, JSON.stringify(stateData[key]))
    }
  }
  
  try {
    const responseUpdate = await axios.post(`${API}/${path}`, data, {
      headers: {
        Authorization: `Bearer ${token}`,
        contentType: 'multipart/form-data'
      }
    })
    setLoading('')
    allData[type]= responseUpdate.data
    setAllData(allData)
    resetState(resetType)
    changeView(viewType)
    if(setModal) setModal('')
    
  } catch (error) {
    console.log(error)
    setLoading('')
    if(error) error.response ? error.response.statusText == 'Unauthorized' ? (setDynamicSVG('notification'), setMessage(error.response.statusText), window.location.href = '/login') : (setDynamicSVG('notification'), setMessage(error.response.data)) : (setDynamicSVG('notification'), setMessage('Error ocurred with updating item'))
  }
}

const submitDeleteImage = async (e, imageItem, key, caseType, stateMethod, stateData, type, setMessage, loadingType, setLoading, token, path, allData, setAllData, setDynamicSVG, editData, setModal) => {
 

  if(!imageItem.key){
    let filtered = stateData.images.filter((item) => item.location !== imageItem.location)
    return stateMethod(caseType, key, filtered)
  }

  setLoading('delete_image')

  try {
    const responseDelete = await axios.post(`${API}/${path}`, {key: imageItem.key, stateData: stateData}, {
      headers: {
        Authorization: `Bearer ${token}`,
        contentType: 'multipart/form-data'
      }
    })
    setLoading('')
    allData[type]= responseDelete.data
    setAllData(allData)
    editData(type, caseType)
    if(setModal) setModal('')
    
  } catch (error) {
    console.log(error)
    setLoading('')
    if(error)  error.response ? error.response.statusText == 'Unauthorized' ? (setDynamicSVG('notification'), setMessage(error.response.statusText), window.location.href = '/login') : (setDynamicSVG('notification'), setMessage(error.response.data)) : (setDynamicSVG('notification'), setMessage('Error ocurred with updating item'))
  }
  
}

const submitDeleteRow = async (e, type, setMessage, loadingType, setLoading, token, path, selectID, allData, setAllData, setDynamicSVG, resetCheckboxes, setControls) => {

  setLoading(loadingType)
  
  try {
    const responseDelete = await axios.post(`${API}/${path}`, {id: selectID}, {
      headers: {
        Authorization: `Bearer ${token}`,
        contentType: 'multipart/form-data'
      }
    })
    setLoading('')
    allData[type]= responseDelete.data
    setAllData(allData)
    setDynamicSVG('checkmark-2')
    setMessage('Item was deleted')
    setControls('')
    resetCheckboxes()
    
  } catch (error) {
    console.log(error)
    setLoading('')
    if(error)  error.response ? error.response.statusText == 'Unauthorized' ? (setDynamicSVG('notification'), setMessage(error.response.statusText), window.location.href = '/login') : (setDynamicSVG('notification'), setMessage(error.response.data)) : (setDynamicSVG('notification'), setMessage('Error ocurred with deleting item'))
  }
  
}

const submitSearch = async (search, setLoading, setMessage, path, type, allData, setAllData, token, setDynamicSVG, changeView, viewType) => {

  try {
    const responseSearch = await axios.post(`${API}/${path}`, {query: search}, {
      headers: {
        Authorization: `Bearer ${token}`,
        contentType: 'multipart/form-data'
      }
    })
    setLoading('')
    setMessage('')
    allData[type]= responseSearch.data
    setAllData(allData)
    changeView(viewType)
    
  } catch (error) {
    console.log(error)
    setLoading('')
    if(error)  error.response ? error.response.statusText == 'Unauthorized' ? (setDynamicSVG('notification'), setMessage(error.response.statusText), window.location.href = '/login') : (setDynamicSVG('notification'), setMessage(error.response.data)) : (setDynamicSVG('notification'), setMessage('Error ocurred searching items'))
  }
  
}

const resetDataType = async (loadingType, setLoading, setMessage, path, type, allData, setAllData, token, setDynamicSVG, changeView, viewType) => {
  setLoading(loadingType)
  
  try {
    const responseGet = await axios.get(`${API}/${path}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        contentType: 'multipart/form-data'
      }
    })
    setLoading('')
    allData[type]= responseGet.data
    setAllData(allData)
    changeView(viewType)
    
  } catch (error) {
    console.log(error)
    setLoading('')
    if(error) error.response ? error.response.statusText == 'Unauthorized' ? (setDynamicSVG('notification'), setMessage(error.response.statusText), window.location.href = '/login') : (setDynamicSVG('notification'), setMessage(error.response.data)) : (setDynamicSVG('notification'), setMessage('Error ocurred searching items'))
  }
}