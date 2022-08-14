export {
  editData,
  populateEditData,
  populateAddress,
  populateDependency,
  handleTableDropdowns,
  returnSelectedData
}

const allowArrays = ['quotes', 'jobs', 'activities', 'activitySets', 'jobIssues', 'accounts', 'purchaseOrders']
const allowObjects = ['account', 'accountAddress', 'jobAddress']

const populateEditData = (originalData, keyType, caseType, stateMethods, selectID, list, setSelectID) => {
  stateMethods.createType(caseType, '_id', selectID)

  if(originalData[keyType] && originalData[keyType].length > 0){
    for(let key in originalData[keyType]){
      if(originalData[keyType][key]._id == selectID){
        
        let object = originalData[keyType][key]

        if(object.jobs && object.jobs.length > 0) stateMethods.createType(caseType, 'jobs', object.jobs)
        
        for(let keyOfObject in object){
          stateMethods.createType(caseType, keyOfObject, object[keyOfObject])

          if(Array.isArray(object[keyOfObject]) && object[keyOfObject].length > 0){
  
            if(!object[keyOfObject][0]['location'] ) stateMethods.createType(caseType, keyOfObject, object[keyOfObject][0])
            
            if(object[keyOfObject][0]['location'] !== undefined){
              return stateMethods.createType(caseType, keyOfObject, object[keyOfObject])
            }
  
            if(allowArrays.includes(keyType)){
              stateMethods.createType(caseType, keyOfObject, object[keyOfObject])
            }
  
            if(allowObjects.includes(keyOfObject)){
              stateMethods.createType(caseType, keyOfObject, object[keyOfObject][0])
            }
          }
  
        }
  
      }
    }
  } else {
    if(list.length > 0){
      for(let i = 0; i <= list.length; i++){
        if(i === selectID){
          for( let key in list[i]){
            stateMethods.createType(caseType, key, list[i][key])
          }
        }
      }
      
      setSelectID(selectID + 1)
    }
  }
  
}

const editData = (keyType, caseType, stateMethod, allData, setSelectID, id, selectID, list) => {

  let stateMethods = new Object();
  stateMethods.createType = stateMethod;

  return populateEditData(
    allData,
    keyType,
    caseType,
    stateMethods,
    id && id + 1 ? id : selectID,
    list,
    setSelectID
  );
  
}


const populateAddress = (keyID, data, stateMethod, stateType) => {
  for(let key in data){
    stateMethod(stateType, key, data[key])
    if(key == '_id') stateMethod(stateType, keyID, data['_id'])
  }
}

const populateDependency = (data, stateType, stateMethod, selectID, setEdit) => {

  data.forEach((item) => {
    if(item._id == selectID){
      for(let key in item.dependency){
        setEdit('dependency')
        stateMethod(stateType, key, item.dependency[key])
      }
    }else{
      return
    }
  })
  
}

const handleTableDropdowns = (allData, keyType, item, stateMethod, setEdit, setModal, changeView) => {
  
  let listType
  let editType
  let modalType
  let viewType
  let createType

  if( keyType == 'accountAddress'){
    listType      = 'contacts'
    editType      = 'contact'
    modalType     = 'new_contact'
    viewType      = 'contacts'
    createType    = 'CREATE_CONTACT'
  }

  if( keyType == 'quotes'){
    listType      = 'quotes'
    editType      = 'quotes'
    modalType     = ''
    viewType      = 'quote'
    createType    = 'CREATE_QUOTE'
  }

  if( keyType == 'assignee'){
    listType      = 'assignees'
    editType      = 'assignees'
    modalType     = 'assignee'
    viewType      = 'assignees'
    createType    = 'CREATE_ASSIGNEE'
  }

  if( keyType == 'set'){
    listType      = 'activities'
    editType      = 'activities'
    modalType     = 'activities'
    viewType      = 'activities'
    createType    = 'CREATE_ACTIVITY'
  }

  if( keyType == 'activities'){
    listType      = 'activities'
    editType      = 'activities'
    modalType     = 'activities'
    viewType      = 'activities'
    createType    = 'CREATE_ACTIVITY'
  }

  if( keyType == 'purchaseOrders'){
    listType      = 'purchaseOrders'
    editType      = 'purchaseOrders'
    modalType     = 'purchaseOrders'
    viewType      = 'purchaseOrders'
    createType    = 'CREATE_PO'
  }

  if( keyType == 'contacts'){
    listType      = 'contacts'
    editType      = 'contact'
    modalType     = 'new_contact'
    viewType      = 'contacts'
    createType    = 'CREATE_CONTACT'
  }

  if( keyType == 'priceLists'){
    listType      = 'prices'
    editType      = 'price_list'
    modalType     = 'new_price_list'
    viewType      = 'prices'
    createType    = 'CREATE_PRICE_LIST'
  }

  if( keyType == 'jobs'){
    listType      = 'jobs'
    editType      = 'jobs'
    modalType     = ''
    viewType      = 'job'
    createType    = 'CREATE_JOB'
  }

  for(let keyItem in allData[listType]){
    if( allData[listType][keyItem]._id == item._id ){

      for(let key in allData[listType][keyItem]){
        stateMethod(createType, key, allData[listType][keyItem][key])

        if(
          Array.isArray(allData[listType][keyItem][key]) && 
          allData[listType][keyItem][key].length > 0 && 
          key !== 'images' &&
          listType === 'priceLists'
        ){
          stateMethod(createType, key, allData[listType][keyItem][key][0])
        }
      }
      
      setEdit(editType)
      changeView(viewType)
      setModal(modalType)

    }
  }
  
}

const returnSelectedData = (data, listType, selectID) => {
  let selected

  if(data[listType].length > 0){
    data[listType].map((item, idx) => {
      if(item._id ? item._id : idx == selectID){
        selected = item
      }
    })
  }

  return selected
}