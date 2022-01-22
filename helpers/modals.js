export {
  populateEditData
}

const populateEditData = (originalData, keyType, caseType, objectKey, stateMethods, selectID) => {

  for(let key in originalData[keyType]){
    if(originalData[keyType][key]._id == selectID){
      console.log(originalData[keyType][key])
      let object = originalData[keyType][key]

      for(let keyOfObject in object){
        stateMethods.createType(caseType, keyOfObject, object[keyOfObject])

        if(Array.isArray(object[keyOfObject]) && object[keyOfObject].length > 0){

          if(!object[keyOfObject][0]['location']) stateMethods.createType(caseType, keyOfObject, object[keyOfObject][0])

          if(object[keyOfObject][0]['location']) stateMethods.createType(caseType, keyOfObject, object[keyOfObject])

        }

      }

    }
  }

}