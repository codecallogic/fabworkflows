export {
  populateEditData,
  populateAddress,
  populateDependency
}

const allowArrays = ['quotes', 'jobs', 'activities', 'activitySets']
const allowObjects = ['account', 'accountAddress']

const populateEditData = (originalData, keyType, caseType, stateMethods, selectID) => {
  stateMethods.createType(caseType, '_id', selectID)
  
  for(let key in originalData[keyType]){
    if(originalData[keyType][key]._id == selectID){
      // console.log(originalData[keyType][key])
      let object = originalData[keyType][key]

      for(let keyOfObject in object){
        // console.log(object[keyOfObject])
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
