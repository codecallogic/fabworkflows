import { API } from '../config'
import axios from 'axios'
import { nanoid } from 'nanoid'
import { validateEmail } from '../helpers/validations'

export {
  formFields,
  manageFormFields,
  submitCreate,
  submitUpdate,
  submitDeleteFile,
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
  prices: ['supplier', 'price'],
  contacts: ['contact_name', 'phone', 'email'],
  quotes: ['contact_name', 'phone', 'email', 'quote_lines', 'quote_subtotal', 'quote_total', 'quote_balance', 'quote_date', 'quote_name', 'quote_number'],
  payment: ['name', 'address', 'city', 'state', 'zip_code'],
  phases: ['name'],
  jobs: ['name', 'account', 'date', 'invoice'],
  assignees: ['name', 'color'],
  activities: ['name'],
  activityStatus: ['status'],
  activitySets: ['name', 'set'],
  purchaseOrders: ['supplier', 'shipping', 'POnumber'],
  contracts: ['job', 'name', 'status', 'contract', 'email', 'subject', 'message']
}


const manageFormFields = (data, key) => {  

  if(data){
    if(typeof data == 'object'){ return data[key] }
    if(typeof data == 'string'){ return data }
  }else{
    return ''
  }
  
}

const submitCreate = async (e, stateData, type, fileType, setMessage, loadingType, setLoading, token, path, resetType, resetState, allData, setAllData, setDynamicSVG, changeView, viewType) => {
  e.preventDefault()

  for(let i = 0; i < formFields[type].length; i++){
    
    if(formFields[type][i].includes('email') && !validateEmail(formFields[type][i])) return (setDynamicSVG('notification'), setMessage('Invalid email address'))

    if(!stateData[formFields[type][i]] || stateData[formFields[type][i]].length < 1) return (setDynamicSVG('notification'), setMessage(`${formFields[type][i].replace('_', ' ')} is required`))

  }

  setMessage('')
  setLoading(loadingType)
  let data = new FormData()
  
  if(stateData[fileType] && stateData[fileType].length > 0){
    stateData[fileType].forEach((item) => {
      let fileID = nanoid()
      data.append('file', item, `${type}-${fileID}.${item.name.split('.')[1]}`)
    })
  }

  if(stateData){
    for(let key in stateData){
      if(key !== fileType) data.append(key, JSON.stringify(stateData[key]))
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
    if(changeView) changeView(viewType)
    
  } catch (error) {
    console.log(error)
    setLoading('')
    if(error)  error.response ? error.response.statusText == 'Unauthorized' ? (setDynamicSVG('notification'), setMessage(error.response.statusText), window.location.href = '/login') : (setDynamicSVG('notification'), setMessage(error.response.data)) : (setDynamicSVG('notification'), setMessage('Error ocurred with creating item'))
  }
}

const submitUpdate = async (e, stateData, type, filesType, setMessage, loadingType, setLoading, token, path, resetType, resetState, allData, setAllData, setDynamicSVG, changeView, viewType, setModal) => {
  
  for(let i = 0; i < formFields[type].length; i++){
    
    if(formFields[type][i].includes('email') && !validateEmail(formFields[type][i])) return (setDynamicSVG('notification'), setMessage('Invalid email address'))

    if(!stateData[formFields[type][i]]) return (setDynamicSVG('notification'), setMessage(`${formFields[type][i].replace('_', ' ')} is required`))

  }
  
  setMessage('')
  setLoading(loadingType)
  let data = new FormData()
  
  if(stateData[filesType] && stateData[filesType].length > 0){
    stateData[filesType].forEach((item) => {
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
    if(resetType) resetState(resetType)
    if(viewType) changeView(viewType)
    if(setModal) setModal('')
    
  } catch (error) {
    console.log(error)
    setLoading('')
    if(error) error.response ? error.response.statusText == 'Unauthorized' ? (setDynamicSVG('notification'), setMessage(error.response.statusText), window.location.href = '/login') : (setDynamicSVG('notification'), setMessage(error.response.data)) : (setDynamicSVG('notification'), setMessage('Error ocurred with updating item'))
  }
}

const submitDeleteFile = async (e, fileItem, key, caseType, stateMethod, stateData, type, setMessage, loadingType, setLoading, token, path, allData, setAllData, setDynamicSVG, editData, setModal, selectID) => {
 

  if(!fileItem.key){
    let filtered = stateData[key].filter((item) => item.location !== fileItem.location)
    return stateMethod(caseType, key, filtered)
  }

  setLoading(loadingType)

  try {
    const responseDelete = await axios.post(`${API}/${path}`, {key: fileItem.key, stateData: stateData}, {
      headers: {
        Authorization: `Bearer ${token}`,
        contentType: 'multipart/form-data'
      }
    })
    setLoading('')
    allData[type]= responseDelete.data
    setAllData(allData)
    editData(type, caseType, selectID)
    if(setModal) setModal('')
    
  } catch (error) {
    console.log(error)
    setLoading('')
    if(error)  error.response ? error.response.statusText == 'Unauthorized' ? (setDynamicSVG('notification'), setMessage(error.response.statusText), window.location.href = '/login') : (setDynamicSVG('notification'), setMessage(error.response.data)) : (setDynamicSVG('notification'), setMessage('Error ocurred with deleting item'))
  }
  
}

const submitDeleteRow = async (e, type, setMessage, loadingType, setLoading, token, path, selectID, allData, setAllData, setDynamicSVG, resetCheckboxes, setControls, typeOfDataParent, changeView) => {
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
    if(typeOfDataParent) getAll(setDynamicSVG, setMessage, token, allData, setAllData, typeOfDataParent)
    if(changeView) changeView(type)
    
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

const getAll = async (setDynamicSVG, setMessage, token, allData, setAllData, typeOfData) => {
  try {

    let response

    if(typeOfData == 'jobs') response = await axios.get(`${API}/jobs/all-jobs`, {
      headers: {
        Authorization: `Bearer ${token}`,
        contentType: 'multipart/form-data'
      }
    })

    allData[typeOfData] = response.data
    setAllData(allData)
    
  } catch (error) {
    console.log(error)
    if(error) error.response ? error.response.statusText == 'Unauthorized' ? (setDynamicSVG('notification'), setMessage(error.response.statusText), window.location.href = '/login') : (setDynamicSVG('notification'), setMessage(error.response.data)) : (setDynamicSVG('notification'), setMessage('Error ocurred with deleting item'))
  }
}