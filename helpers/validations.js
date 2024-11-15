import QRCode from 'qrcode'
import { geocodeByPlaceId } from 'react-places-autocomplete'
import { manageFormFields } from './forms'

export {
  validateNumber,
  validateTax,
  validateSize,
  validateEmail,
  validateEmailData,
  validatePrice,
  validateDate,
  generateQR,
  multipleFiles,
  singleImage,
  dateNow,
  phoneNumber,
  addressSelect,
  formatDate,
  formatDate2,
  numberType,
  filterAccountSearch,
  filterContactSearch,
  filterActivitySearch,
  filterQuoteSearch,
  filterJobSearch,
  filterPurchaseOrderSearch,
  filterProductSearch,
  filterPriceListSearch,
  filterSlabSearch,
  filterRemnantSearch,
  validatePDFContent,
  validateZipCode,
  generateRandomNumber,
  returnIfTrue,
  checkObjectValues,
  validateTime,
  formatTime,
  getTimeHour
}

///// VALIDATIONS
const formFields = {
  slabs: ['material'],
  slabQRCode: ['material', 'size_1', 'size_2', 'lot_number'],
  productQRCode: ['brand', 'model', 'category', 'price'],
  remnantQRCode: ['name', 'material', 'l1', 'w1', 'l2', 'w2'],
  pdfQuote: ['contact_name', 'address', 'city', 'state', 'zip_code', 'phone', 'quote_date', 'quote_number', 'quote_name', 'salesperson', 'quote_subtotal', 'quote_tax', 'quote_total', 'quote_balance'],
  pdfAgreement: ['contact_name', 'quote_name', 'quote_date'],
  pdfJobIssues: ['job', 'subject', 'status', 'category', 'history']
}

const validateNumber = (type) => {
  const input = document.getElementById(type)
  
  const regex = /[^0-9|\n\r]/g

  if(type == 'size_1' || type == 'size_2') {
    return input.value = input.value.split(regex).join('') + ' in'
  }

  if(type == 'thickness') {
    return input.value = input.value.split(regex).join('') + ' cm'
  }

  if(input.value == ' in') return input.value = ''
  if(input.value == ' cm') return input.value = ''

  // type == 'quantity' || type == 'block' || type == 'lot'
  input.value = input.value.split(regex).join('')
}


const validateTax = (data) => {
  // ^\d*\.?\d+$
  const regex = /^\d*\.?\d{0,2}$/g
  
  if(data.match(regex)){
    return data.match(regex)[0]
  }else{
    return data.substring(0, data.length - 1)
  }

}


const validateSize = (e, type, createType, reduxMethod) => {
  const input = document.getElementById(type)
  const regex = /[^0-9|\n\r]/g
  
  input.onkeydown = function(event){
    if(event.keyCode == 8){
      return reduxMethod(createType, type, '')
    }
  }
  
  return input.value = input.value.split(regex).join('') + ' in'
}

const validateEmail = (type) => {
  const input = document.getElementById(type)
  const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/g
  
  if(regex.test(input.value)){
    return true
  }else{
    return false
  }
  // return !regex.test(input.value) ? 'true' : 'false'
}

const validateEmailData = (value) => {
  const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/g
  
  if(regex.test(value)){
    return true
  }else{
    return false
  }
}

const validatePrice = (e) => {
  
  if(e.target.value == ''){ return '' }
  
  if(e.keyCode){
    if( e.keyCode == 8 ){
      return e.target.value.substring(0, e.target.value - 1)
    }
  }
  
  let newValue = Number(e.target.value.replace(/\D/g, '')) / 100
  let formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  })
  
  return formatter.format(newValue)

}

function checkValue(str, max){
  if (str.charAt(0) !== '0' || str == '00') {
    var num = parseInt(str);
    if (isNaN(num) || num <= 0 || num > max) num = 1;
    str = num > parseInt(max.toString().charAt(0)) && num.toString().length == 1 ? '0' + num : num.toString();
  };
  return str;
}

const validateDate = (e, key, caseType, reduxMethod) => {
  let name = document.getElementById(key)
  let input = e.target.value
  
  name.onkeydown = function(event){
    if(event.keyCode == 8){
      if(input.length == 1) return (reduxMethod(key, ''), name.classList.remove("field-red"))
      return reduxMethod(caseType, key, input.substr(0, input.length - 1))
    }
  }
  
  name.classList.remove("red")

  if (/\D\/$/.test(input)) input = input.substr(0, input.length - 3);

  var values = input.split('/').map(function(v) {
    return v.replace(/\D/g, '')
  });

  if (values[0]) values[0] = checkValue(values[0], 12);
  if (values[1]) values[1] = checkValue(values[1], 31);
  var output = values.map(function(v, i) {
    return v.length == 2 && i < 2 ? v + '/' : v;
  });

  input = output.join('').substr(0, 10);

  reduxMethod(caseType, key, input)

  let date_regex = /^(0[1-9]|1[0-2])\/(0[1-9]|1\d|2\d|3[01])\/(19|20)\d{2}$/

  if(!date_regex.test(input)){
    name.classList.add('red');
    if(input == '') name.classList.remove("red")
    return
  }
}




const generateQR = async (e, type, stateData, caseType, reduxMethod, setMessage, setDynamicSVG) => {
  let options = {
    type: 'image/png',
    width: 500,
    scale: 10,
    margin: 1,
    color: {
      dark:"#413838",
      light:"#ededec"
    }
  }
  setMessage('')
  setDynamicSVG('notification')
  e.preventDefault()
  e.stopPropagation()

  for(let i = 0; i < formFields[type].length; i++){
    if(!stateData[formFields[type][i]]) return (
      window.scrollTo(0, 0), 
      setMessage(`${formFields[type][i].replace('_', ' ')} is required`)
      )
  }

  try {

    let qrData = new Object()
    for(let i = 0; i < formFields[type].length; i++){
      if(stateData[formFields[type][i]]){
        qrData[formFields[type][i]] = stateData[formFields[type][i]]
      }
    }
    
    const image = await QRCode.toDataURL(JSON.stringify(qrData), options)
    reduxMethod(caseType, 'qr_code', image)
    setMessage('')

  } catch (err) {
    console.log(err)
    if(err) return (window.scrollTo(0, 0), setMessage('Error occurred generating QR code'))
  }
}





const multipleFiles = (e, stateData, dataType, setMessage, caseType, key, reduxMethod) => {
  
  let filesMax = stateData[dataType].length + e.target.files.length

  if(filesMax > 3) return (
    setMessage('Max number of items is 3'), 
    window.scrollTo(0,0)
  )


  if(e.target.files.length > 0){
    let array = Array.from(e.target.files)
    
    array.forEach( (item) => {
      let url = URL.createObjectURL(item);
      item.location = url
    })
  }

  reduxMethod(caseType, key, [...stateData[dataType], ...e.target.files])
}

const singleImage = (e, stateData, setMessage, caseType, key, reduxMethod) => {

  if(e.target.files.length > 0){
    let array = Array.from(e.target.files)
    
    array.forEach( (item) => {
      let url = URL.createObjectURL(item);
      item.location = url
    })
  }

  reduxMethod(caseType, key, [...e.target.files])
}





const dateNow = () => {
  let date = new Date(Date.now())
  let hr = date.getHours()
  let min = date.getMinutes();

  if (min < 10) {
    min = "0" + min;
  }

  let ampm = "am";
  if( hr > 12 ) {
      hr -= 12;
      ampm = "pm";
  }


  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  var month = monthNames[date.getUTCMonth()]
  var day = date.getUTCDate()
  var year = date.getUTCFullYear()

  return `${month} ${day}, ${year}, ${hr}:${min} ${ampm}`
}





const phoneNumber = (type, createType, reduxMethod) => {
  const input = document.getElementById(type)
  let phoneNumber = input.value.replace(/\D/g, '');

  const phoneNumberLength = phoneNumber.length

  if(phoneNumberLength < 4) return phoneNumber

  if( phoneNumberLength < 7){
    return reduxMethod(createType, type, `(${phoneNumber.slice(0,3)}) ${phoneNumber.slice(3,7)}`)
  }

  return reduxMethod(createType, type, `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(
    3,
    6
  )}-${phoneNumber.slice(6, 10)}`)
}





const addressSelect = async (e, key, createType, reduxMethod, id, keyTwo, keyThree, keyFour, keyFive) => {

  let geo = null
  let geoId = null 
  
  if(id){ geoId = document.getElementById(id).value }

  if(geoId){ 
    geo = await geocodeByPlaceId(geoId)
  }
  
  if(geo){
    geo[0].address_components.forEach((item) => {
      
      if(item.types.includes('postal_code')){
        //// ZIP CODE
        reduxMethod(createType, keyFour, item.long_name)
      }

      if(item.types.includes('country')){
        //// COUNTRY
        reduxMethod(createType, keyFive, item.long_name)
      }
    })
  }

  //// ADDRESS
  if(key){ reduxMethod(createType, key, e.split(',')[0])}

  //// CITY
  if(keyTwo){ reduxMethod(createType, keyTwo, e.split(',')[1])}

  //// STATE
  if(keyThree){ reduxMethod(createType, keyThree, e.split(',')[2])}
}

const formatDate = (e) => {
  console.log(e)
  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  // console.log(e.getUTCMonth() + 1)
  
  var month = e.getUTCMonth() + 1
  // var month = monthNames[e.getUTCMonth()]
  var day = e.getUTCDate()
  var year = e.getUTCFullYear()
  
  return `${+month}/${day}/${year}`
}

const formatDate2 = (e) => {

  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const weekday = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
  // console.log(e.getUTCMonth() + 1)
  // console.log(e.getUTCDay())
  // var month = e.getUTCMonth() + 1
  let dayOfWeek = weekday[e.getUTCDay()]
  let month = monthNames[e.getUTCMonth()]
  let day = e.getUTCDate()
  let year = e.getUTCFullYear()

  return `${dayOfWeek}, ${month} ${day}, ${year}`
}

const formatTime = (duration) => {

  var milliseconds = Math.floor((duration % 1000) / 100),

  seconds = Math.floor((duration / 1000) % 60),
  minutes = Math.floor((duration / (1000 * 60)) % 60),
  hours = Math.floor((duration / (1000 * 60 * 60)) % 24);

  hours = (hours < 10) ? "0" + hours : hours;
  minutes = (minutes < 10) ? "0" + minutes : minutes;
  seconds = (seconds < 10) ? "0" + seconds : seconds;

  return hours + ":" + minutes + ":" + seconds;
}

const getTimeHour = (e) => {
  
  let hours = e.getHours() == 0 ? 12 : (e.getHours() > 12 ? e.getHours() - 12 : e.getHours());
  let minutes = e.getMinutes();
  let ampm = e.getHours() < 12 ? 'AM' : 'PM';

  if(`${minutes}`.length == 1) minutes = `0${minutes}`
  
  return hours + ":" + minutes + ' ' + ampm
}

const numberType = (e, type) => {

  if(type == 'dollar'){ 
    if(e.target.value == '') return ''
    if(e.target.value !== '') return e.target.value + '%'
  }

  if(type == 'percentage'){ 
    if(e.target.value == '') return ''
    if(e.target.value !== '') return validatePrice(e)
  }
  
}

const filterAccountSearch = (item, search) => {
  
  if( item.name && item.name.toLowerCase().includes(search.toLowerCase())) 
    return true

}

const filterContactSearch = (item, search) => {
  
  if( item.contact_name && item.contact_name.toLowerCase().includes(search.toLowerCase())) 
    return true

  if( item.address && item.address.toLowerCase().includes(search.toLowerCase())) 
    return true

  if( item.city && item.city.toLowerCase().includes(search.toLowerCase())) 
    return true

  if( item.phone && item.phone.toLowerCase().includes(search.toLowerCase())) 
    return true

}

const filterActivitySearch = (item, search) => {
  
  if( item.name && item.name.toLowerCase().includes(search.toLowerCase())) 
    return true

  if( item.status && item.status.toLowerCase().includes(search.toLowerCase())) 
    return true
  
}

const filterQuoteSearch = (item, search) => {
  
  if( item.quote_name && item.quote_name.toLowerCase().includes(search.toLowerCase())) 
    return true

  if(item.quote_number && item.quote_number.toLowerCase().includes(search.toLowerCase())) 
    return true

  if(item.contact_name && item.contact_name.toLowerCase().includes(search.toLowerCase())) 
    return true

}

const filterJobSearch = (item, search) => {
  
  if( item.name && item.name.toLowerCase().includes(search.toLowerCase()) ) 
    return true

  if( item.invoice && item.invoice.toLowerCase().includes(search.toLowerCase()) ) 
    return true

}

const filterPurchaseOrderSearch = (item, search) => {
  
  if( manageFormFields(item.supplier[0], 'name') && manageFormFields(item.supplier[0], 'name').toLowerCase().includes(search.toLowerCase())) 
    return true

  if( item.POnumber && item.POnumber.toLowerCase().includes(search.toLowerCase()) ) 
    return true

  if( item.orderDate && item.orderDate.toLowerCase().includes(search.toLowerCase()) ) 
    return true
}

const filterProductSearch = (item, search) => {
  
  if( manageFormFields(item.brand[0], 'name') && manageFormFields(item.brand[0], 'name').toLowerCase().includes(search.toLowerCase())) 
    return true

  if( manageFormFields(item.category[0], 'name') && manageFormFields(item.category[0], 'name').toLowerCase().includes(search.toLowerCase())) 
    return true

  if( manageFormFields(item.model[0], 'name') && manageFormFields(item.model[0], 'name').toLowerCase().includes(search.toLowerCase())) 
    return true

}

const filterPriceListSearch = (item, search) => {

  if( manageFormFields(item.supplier[0], 'name') && manageFormFields(item.supplier[0], 'name').toLowerCase().includes(search.toLowerCase())) 
    return true

  if( manageFormFields(item.color[0], 'name') && manageFormFields(item.color[0], 'name').toLowerCase().includes(search.toLowerCase())) 
    return true

  if( manageFormFields(item.model[0], 'name') && manageFormFields(item.model[0], 'name').toLowerCase().includes(search.toLowerCase())) 
    return true

}

const filterSlabSearch = (item, search) => {

  if( manageFormFields(item.material[0], 'name') && manageFormFields(item.material[0], 'name').toLowerCase().includes(search.toLowerCase())) 
    return true

  if( manageFormFields(item.color[0], 'name') && manageFormFields(item.color[0], 'name').toLowerCase().includes(search.toLowerCase())) 
    return true

  if( manageFormFields(item.supplier[0], 'name') && manageFormFields(item.supplier[0], 'name').toLowerCase().includes(search.toLowerCase())) 
    return true

}

const filterRemnantSearch = (item, search) => {

  if( manageFormFields(item.material[0], 'name') && manageFormFields(item.material[0], 'name').toLowerCase().includes(search.toLowerCase())) 
    return true

  if( manageFormFields(item.color[0], 'name') && manageFormFields(item.color[0], 'name').toLowerCase().includes(search.toLowerCase())) 
    return true

  if( item.shape && item.shape.toLowerCase().includes(search.toLowerCase())) 
    return true

}

const validatePDFContent = async (functionType, type, stateData, url, setDynamicSVG, setMessage, selectID) => {

  console.log(stateData)
  
  for(let i = 0; i < formFields[type].length; i++){
  
    if(!stateData[formFields[type][i]] || stateData[formFields[type][i]].length < 1) return (setDynamicSVG('notification'), setMessage(`${formFields[type][i].replace('_', ' ')} is required`))

  }
  
  if( functionType == 'viewQuote' ){
    window.open(url, '_blank')
  }
  
  if( functionType == 'downloadQuote' ){
    let link = document.createElement('a');
    link.href = url;
    link.download = 'quote.pdf';
    link.dispatchEvent(new MouseEvent('click'));
  }

  if( functionType == 'viewAgreement' ){
    window.open(url, '_blank')
  }
  
  if( functionType == 'downloadAgreement' ){
    let link = document.createElement('a');
    link.href = url;
    link.download = 'agreement.pdf';
    link.dispatchEvent(new MouseEvent('click'));
  }

  if( functionType == 'viewJobIssues'){
    window.open(url, '_blank')
  }

}

const validateZipCode = (zip) => {
  
  return !/^\d{5}(-\d{4})?$/.test(zip)
  
}

const generateRandomNumber = () => {
  let orderNumber = Math.floor(100000000 + Math.random() * 900000000)

  return orderNumber
}

const returnIfTrue = (data) => {
  
  return data ? data : ''
  
}

const checkObjectValues = (data) => {
  let array = []

  for(let key in data){
    if(data[key]) array.push(true)
  }
  
  if(array.length == 0) return false

  return true
}




const validateTime = (e, type, createType, reduxMethod) => {
  let input = document.getElementById(type)
  let time = e.target.value.replace(/\D/g, '');
  time = time.replace(/^0+/, '')

  input.onkeydown = function(event){
    if(event.keyCode == 8){
      if(input.length == 1) return stateMethod(createType, type, '')
      return reduxMethod(createType, type, time.substr(0, time.length - 0))
    }
  }
  
  if(time.length > 4) return 

  if(time.length < 3 && +time < 60) return reduxMethod(createType, type, `00:${time}`)
  if(time.length < 4) return reduxMethod(createType, type, `${time.slice(0,1)}:${time.slice(1,3)}`)
  if(time.length < 5) return reduxMethod(createType, type, `${time.slice(0,2)}:${time.slice(2,4)}`)
  
}