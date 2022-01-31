export {
  populateEditData,
  populateAddress
}

const populateEditData = (originalData, keyType, caseType, stateMethods, selectID) => {
  stateMethods.createType(caseType, '_id', selectID)
  
  for(let key in originalData[keyType]){
    if(originalData[keyType][key]._id == selectID){
      // console.log(originalData[keyType][key])
      let object = originalData[keyType][key]

      for(let keyOfObject in object){
        // console.log(keyOfObject)
        stateMethods.createType(caseType, keyOfObject, object[keyOfObject])

        if(Array.isArray(object[keyOfObject]) && object[keyOfObject].length > 0){
          // console.log(object[keyOfObject])
          if(!object[keyOfObject][0]['location']) stateMethods.createType(caseType, keyOfObject, object[keyOfObject][0])

          if(object[keyOfObject][0]['location']) return stateMethods.createType(caseType, keyOfObject, object[keyOfObject])

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
