import axios from 'axios'
import {API} from '../config'

const filterTable = (data, includes, slice) => {
  
  data.length > 0 && data.forEach((item) => {
    if(includes){
      for(let key in item){
        if(includes.includes(key)) delete item[key]
      }
    }
  })

  if(slice) return data.slice(0, slice)
  return data
}

const tableData = async (token, dataType) => {

  if(dataType == 'slabs'){
    try {
      const responseSlabs = await axios.get(`${API}/slabs/all-slabs`, { 
        headers: {
          Authorization: `Bearer ${token}`,
          contentType: `application/json`
        }
      })
      return responseSlabs.data
    } catch (error) {
      console.log(error)
      if(error) return error
    }
  }

  if(dataType == 'materials'){
    try {
      const responseMaterials = await axios.get(`${API}/inventory/materials`, { 
        headers: {
          Authorization: `Bearer ${token}`,
          contentType: `application/json`
        }
      })
      return responseMaterials.data
    } catch (error) {
      console.log(error)
      if(error) return error
    }
  }

  if(dataType == 'colors'){
    try {
      const responseColors = await axios.get(`${API}/inventory/colors`)
      return responseColors.data
    } catch (error) {
      console.log(error)
      if(error) return error
    }
  }

}

export {
  filterTable,
  tableData
}