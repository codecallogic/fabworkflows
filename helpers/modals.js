export {
  populateEditData
}

const populateEditData = (originalData, keyType, caseType, reduxMethodType, stateMethods, selectID) => {
  if(reduxMethodType == 'createSlab'){
    for(let key in originalData[keyType]){
      if(originalData[keyType][key]._id == selectID){
        let object = originalData[keyType][key]
        for(let keyOfObject in object){
          stateMethods.createType(caseType, keyOfObject, object[keyOfObject])
        }
      }
    }
  }
}