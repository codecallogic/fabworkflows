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

const searchData = (view, submitSearch, search, setLoading, setMessage, urlRequest, dataType, allData, setAllData, token, setDynamicSVG, changeView, viewType) => {
  
    if (view == 'slabs') {
      submitSearch( search, setLoading, setMessage, 'slabs/search-slabs', 'slabs', allData, setAllData, token, setDynamicSVG, changeView, 'slabs'
      );
    }
    if (view == 'products') {
      submitSearch( search, setLoading, setMessage, 'products/search-products', 'products', allData, setAllData, token, setDynamicSVG, changeView, 'products'
      );
    }
    if (view == 'remnants') {
      submitSearch( search, setLoading, setMessage, 'remnants/search-remnants', 'remnants', allData, setAllData, token, setDynamicSVG, changeView, 'remnants'
      );
    }
    if (view == 'trackers' && loading == 'slabs') {
      submitSearch( search, setLoading, setMessage, 'slabs/search-slabs', 'slabs', allData, setAllData, token, setDynamicSVG, changeView, 'trackers'
      );
    }
    if (view == 'trackers' && loading == 'products') {
      submitSearch( search, setLoading, setMessage, 'products/search-products', 'products', allData, setAllData, token, setDynamicSVG, changeView, 'trackers'
      );
    }
    if (view == 'quotes') {
      submitSearch( search, setLoading, setMessage, 'quotes/search-quotes', 'quotes', allData, setAllData, token, setDynamicSVG, changeView, 'quotes'
      );
    }
    if (view == 'jobs') {
      submitSearch( search, setLoading, setMessage, 'jobs/search-jobs', 'jobs', allData, setAllData, token, setDynamicSVG, changeView, 'jobs'
      );
    }
   
}

const resetTableData = (view, resetDataType, search, loading, setLoading, setMessage, urlRequest, dataType, allData, setAllData, token, setDynamicSVG, changeView, viewType) => {

  if (search.length == 0) {
    if (view == 'slabs') {
      resetDataType( loading, setLoading, setMessage, 'slabs/all-slabs', 'slabs', allData, setAllData, token, setDynamicSVG, changeView, 'slabs'
      );
    }
    if (view == 'products') {
      resetDataType( loading, setLoading, setMessage, 'products/all-products', 'products', allData, setAllData, token, setDynamicSVG, changeView, 'products'
      );
    }
    if (view == 'remnants') {
      resetDataType( loading, setLoading, setMessage, 'remnants/all-remnants', 'remnants', allData, setAllData, token, setDynamicSVG, changeView, 'remnants'
      );
    }
    if (view == 'trackers' && loading == 'slabs') {
      resetDataType( loading, setLoading, setMessage, 'slabs/all-slabs', 'slabs', allData, setAllData, token, setDynamicSVG, changeView, 'trackers'
      );
    }
    if (view == 'trackers' && loading == 'products') {
      resetDataType( loading, setLoading, setMessage, 'products/all-products', 'products', allData, setAllData, token, setDynamicSVG, changeView, 'trackers'
      );
    }
    if (view == 'quotes') {
      resetDataType( loading, setLoading, setMessage, 'quotes/all-quotes', 'quotes', allData, setAllData, token, setDynamicSVG, changeView, 'quotes'
      );
    }
    if (view == 'jobs') {
      resetDataType( loading, setLoading, setMessage, 'jobs/all-jobs', 'jobs', allData, setAllData, token, setDynamicSVG, changeView, 'jobs'
      );
    }
  }
}

const buildHeaders = (setHeaders, sortType, tableType) => {

  if(tableType == 'edges'){
    let objectEdges = new Object();
    Object.values(sortType).forEach((item) => { objectEdges[item] = item });
    setHeaders((oldArray) => [...oldArray, objectEdges]);
  }

  if(tableType == 'cutouts'){
    let objectCutouts = new Object();
    Object.values(sortType).forEach((item) => { objectCutouts[item] = item });
    setHeaders((oldArray) => [...oldArray, objectCutouts]);
  }

}

const sortColumns = (a, b, type) => {
  if(typeof a[type] == 'string' && /^[0-9.,$]+$/.test(a[type])){
    if(parseFloat(a[type].replace('$', '').replace(',', '')) > parseFloat(b[type].replace('$', '').replace(',', ''))) return true

    return false
  } 
  
  if(typeof a[type] == 'string'){
    if(a[type] > b[type]) return true
    return false
  }

  if(typeof a[type] == 'object'){
    let left = a[type][0] ? a[type][0].name : null
    let right = b[type][0] ? b[type][0].name : null
    
    if(left > right) return true
    return false
  }
}

export {
  filterTable,
  tableData,
  searchData, 
  resetTableData,
  buildHeaders,
  sortColumns
}