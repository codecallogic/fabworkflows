export {
  manageEstimates
}

const manageEstimates = (type, quantity, price) => {

  if(type == 'lineTotal'){
    return `$` + +quantity * +price.replace('$', '')
  }
  
}