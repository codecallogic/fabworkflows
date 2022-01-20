import QRCode from 'qrcode'

export {
  validateNumber,
  validatePrice,
  validateDate,
  generateQR,
  multipleImages
}

///// VALIDATIONS
const formFields = {
  slabs: ['material'],
  slabQRCode: ['material', 'size_1', 'size_2', 'lot_number']
}

const validateNumber = (type) => {
  const input = document.getElementById(type)
  
  const regex = /[^0-9|\n\r]/g

  if(type == 'quantity' || type == 'block' || type == 'lot'){
    input.value = input.value.split(regex).join('')
  }

  if(type == 'size_1' || type == 'size_2') {
    input.value = input.value.split(regex).join('') + ' in'
  }

  if(type == 'thickness') {
    input.value = input.value.split(regex).join('') + ' cm'
  }

  if(input.value == ' in') input.value = ''
  if(input.value == ' cm') input.value = ''
}

const validatePrice = (e) => {
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
    width: 288,
    quality: 1,
    margin: 1,
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
    qrData.name         = stateData.material
    qrData.size_width   = stateData.size_1
    qrData.size_height  = stateData.size_2
    qrData.lot          = stateData.lot_number
    
    const image = await QRCode.toDataURL(JSON.stringify(qrData), options)
    reduxMethod(caseType, 'qr_code', image)
    setMessage('')

  } catch (err) {
    console.log(err)
    if(err) return (window.scrollTo(0, 0), setMessage('Error occurred generating QR code'))
  }
}

const multipleImages = (e, stateData, setMessage, caseType, reduxMethod) => {
  
  let imageMax = stateData.images.length + e.target.files.length

  if(imageMax > 3) return (
    setMessage('Max number of images is 3'), 
    window.scrollTo(0,0)
  )

  if(e.target.files.length > 0){
    let array = Array.from(e.target.files)
    
    array.forEach( (item) => {
      let url = URL.createObjectURL(item);
      item.location = url
    })
  }

  reduxMethod(caseType, [...stateData.images, ...e.target.files])

  // if(type == 'slab'){
  //   setSelectedFiles( prevState => [...selectedFiles, ...e.target.files])
  //   addSlabImages([...selectedFiles, ...e.target.files])
  //   setImageCount(imageMax)
  // }

  // if(type == 'product'){
  //   setSelectedFiles( prevState => [...selectedFiles, ...e.target.files])
  //   addProductImages([...selectedFiles, ...e.target.files])
  //   setImageCount(imageMax)
  // }
}