export {
  populateEditData,
  populateAddress,
  populateDependency,
  handleTableDropdowns
}

const allowArrays = ['quotes', 'jobs', 'activities', 'activitySets', 'jobIssues']
const allowObjects = ['account', 'accountAddress']

const populateEditData = (originalData, keyType, caseType, stateMethods, selectID) => {
  stateMethods.createType(caseType, '_id', selectID)

  for(let key in originalData[keyType]){
    if(originalData[keyType][key]._id == selectID){

      let object = originalData[keyType][key]

      for(let keyOfObject in object){
        stateMethods.createType(caseType, keyOfObject, object[keyOfObject])

        if(Array.isArray(object[keyOfObject]) && object[keyOfObject].length > 0){


          if(!object[keyOfObject][0]['location'] ) stateMethods.createType(caseType, keyOfObject, object[keyOfObject][0])

          if(object[keyOfObject][0]['location']) return stateMethods.createType(caseType, keyOfObject, object[keyOfObject])

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

  for(let keyItem in allData[listType]){
    if( allData[listType][keyItem]._id == item._id ){

      for(let key in allData[listType][keyItem]){
        stateMethod(createType, key, allData[listType][keyItem][key])
      }
      
      setEdit(editType)
      changeView(viewType)
      setModal(modalType)

    }
  }
  
}