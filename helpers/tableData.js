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

const tableData = async (token, path) => {

  try {
    const responseItems = await axios.get(`${API}/${path}`, { 
      headers: {
        Authorization: `Bearer ${token}`,
        contentType: `application/json`
      }
    })
    return responseItems.data
  } catch (error) {
    console.log(error)
    if(error) return error
  }

}

export {
  filterTable,
  tableData
}