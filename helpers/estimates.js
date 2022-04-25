export {
  manageEstimates,
  updateQuoteLine,
  calculateEstimate
}

const manageEstimates = (type, quantity, price) => {

  if(type == 'lineTotal'){
    return `$` + (+quantity * (+price.replace('$', '').replace(',', ''))).toFixed(2)
  }
  
}

const updateQuoteLine = (data, stateMethod, caseType, idx) => {

  for(let key in data){
    stateMethod(caseType, key, data[key])
  }
  
  stateMethod(caseType, 'idx', idx)
  
}

const calculateEstimate = (stateData, stateMethod, caseType, depositType) => {
  let subtotal              = 0
  let taxableDiscount       = 0
  let taxableTotal          = 0
  let nonTaxableSubtotal    = 0
  let nonTaxableDiscount    = 0
  let total                 = 0
  let deposit               = 0
  let balance               = 0
  
  // console.log(stateData)
  
  stateData.quote_lines.forEach((item) => {
    
    if(item.taxable){ 
      subtotal += (
        (+item.quantity * +item.price.replace('$', '').replace(',', ''))
      )
    }
   
    
  })
  stateMethod(caseType, 'quote_subtotal', subtotal.toFixed(2))

 


  stateData.quote_lines.forEach((item) => {
    
    if(item.discount && item.taxable){ 

      taxableDiscount += (
        (+item.quantity * +item.price.replace('$', '').replace(',', ''))
        * 
        ( +stateData.quote_discount.replace('$', '').replace(',', '') / 100 )
      )
    }
    
  })
  stateMethod(caseType, 'quote_taxable_discount', taxableDiscount.toFixed(2))




  stateData.quote_lines.forEach((item) => {
    
    if(item.taxable){ 

      taxableTotal += (
        (stateData.quote_tax) *
        (+item.quantity * +item.price.replace('$', '').replace(',', ''))
        / 100
      )
    }
    
  })
  stateMethod(caseType, 'quote_taxable_total', taxableTotal.toFixed(2))




  stateData.quote_lines.forEach((item) => {
    
    if(!item.taxable){ 
      nonTaxableSubtotal += (
        (+item.quantity * +item.price.replace('$', '').replace(',', ''))
      )
    }
    
  })
  stateMethod(caseType, 'quote_nontaxable_subtotal', nonTaxableSubtotal.toFixed(2))




  stateData.quote_lines.forEach((item) => {

    if(!item.taxable && item.discount){ 
      nonTaxableDiscount += (
        (+item.quantity * +item.price.replace('$', '').replace(',', ''))
        *
        (+stateData.quote_discount / 100)
      )
    }

  })
  stateMethod(caseType, 'quote_nontaxable_discount', nonTaxableDiscount.toFixed(2))



  
  stateData.quote_lines.forEach((item) => {

    //// SUBTOTAL
    if(item.taxable){ 
      total += (
        (+item.quantity * +item.price.replace('$', '').replace(',', ''))
      )
    }

    //// TAXABLE DISCOUNT
    if(item.discount && item.taxable){ 

      total -= (
        (+item.quantity * +item.price.replace('$', '').replace(',', ''))
        * 
        ( +stateData.quote_discount.replace('$', '').replace(',', '') / 100 )
      )
    }

    ///// TAX
    if(item.taxable){ 

      total += (
        (stateData.quote_tax) *
        (+item.quantity * +item.price.replace('$', '').replace(',', ''))
        / 100
      )
    }

    ///// NONTAXABLE SUBTOTAL
    if(!item.taxable){ 
      total += (
        (+item.quantity * +item.price.replace('$', '').replace(',', ''))
      )
    }

    ///// NONTAXABLE DISCOUNT
    if(!item.taxable && item.discount){ 
      total -= (
        (+item.quantity * +item.price.replace('$', '').replace(',', ''))
        *
        (+stateData.quote_discount / 100)
      )
    }

  })
  stateMethod(caseType, 'quote_total', total.toFixed(2))




  if(stateData.quote_deposit.includes('%')){
      
    deposit += (
      +total.toFixed(2)
      *
      ( +stateData.quote_deposit.replace('%', '').replace(',', '') / 100)
    )
  } 
  

  if(stateData.quote_deposit.includes('%')) stateMethod(caseType, 'quote_deposit_total', deposit.toFixed(2))
  
  if(stateData.quote_deposit.includes('$')){
      
    deposit += (
      ( +stateData.quote_deposit.replace('$', '').replace(',', ''))
    )
  }
  // console.log(deposit)
  if(stateData.quote_deposit.includes('$')) stateMethod(caseType, 'quote_deposit_total', deposit.toFixed(2))

  balance += (
    +total.toFixed(2) - +deposit.toFixed(2)
  )

  stateMethod(caseType, 'quote_balance', balance.toFixed(2))

}