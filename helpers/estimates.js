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

const calculateEstimate = (type, stateData, depositType) => {
  let subtotal              = 0
  let taxableDiscount       = 0
  let taxableTotal          = 0
  let nonTaxableSubtotal    = 0
  let nonTaxableDiscount    = 0
  let total                 = 0
  let deposit               = 0
  let balance               = 0
  

  if(type == 'subtotal'){
    stateData.quote_lines.forEach((item) => {
      
      if(item.taxable){ 
        subtotal += (
          (+item.quantity * +item.price.replace('$', '').replace(',', ''))
        )
      }
     
    })

    return `$${subtotal.toFixed(2)}`
    
  }

 
  if(type == 'taxableDiscount'){
    stateData.quote_lines.forEach((item) => {
      
      if(item.discount && item.taxable){ 

        taxableDiscount += (
          (+item.quantity * +item.price.replace('$', '').replace(',', ''))
          * 
          ( +stateData.quote_discount.replace('$', '').replace(',', '') / 100 )
        )
      }
      
    })

    return `$${taxableDiscount.toFixed(2)}`
  }


  if(type == 'taxableTotal'){
    stateData.quote_lines.forEach((item) => {
      
      if(item.taxable){ 

        taxableTotal += (
          (stateData.quote_tax) *
          (+item.quantity * +item.price.replace('$', '').replace(',', ''))
          / 100
        )
      }
      
    })

    return `$${taxableTotal.toFixed(2)}`
  }


  if(type == 'nonTaxableSubtotal'){
    stateData.quote_lines.forEach((item) => {
      
      if(!item.taxable){ 
        nonTaxableSubtotal += (
          (+item.quantity * +item.price.replace('$', '').replace(',', ''))
        )
      }
      
    })

    return `$${nonTaxableSubtotal.toFixed(2)}`
  }


  if(type == 'nonTaxableDiscount'){
    stateData.quote_lines.forEach((item) => {

      if(!item.taxable && item.discount){ 
        nonTaxableDiscount += (
          (+item.quantity * +item.price.replace('$', '').replace(',', ''))
          *
          (+stateData.quote_discount / 100)
        )
      }

    })

    return `$${nonTaxableDiscount.toFixed(2)}`
  }

  if(type == 'total'){

    total += (
      
      ( +stateData.quote_subtotal + +stateData.quote_nontaxable_subtotal + +stateData.quote_taxable_total ) 
      - 
      ( +stateData.quote_taxable_discount + +stateData.quote_nontaxable_discount )

    )
    
    return `$${total.toFixed(2)}`
  }

  if(type == 'deposit'){

    if(depositType == 'percentage'){
      
      deposit += (
        ( +stateData.quote_total )
        *
        ( +stateData.quote_deposit.replace('%', '') / 100)
      )

      return `$${deposit.toFixed(2)}`
    }
    
   
    if(depositType == 'dollar'){
      
      deposit += (
        ( +stateData.quote_deposit.replace('$', ''))
      )

      return `$${deposit.toFixed(2)}`
    }
  }

  if(type == 'balance'){

    balance += (
      ( +stateData.quote_total - +stateData.quote_deposit_total)
    )

    return `$${balance.toFixed(2)}`
  }

  //   return `$${nonTaxableSubtotal.toFixed(2)}`
  // }

  // quote.quote_lines.forEach((item) => {
  //   if(item.taxable) subtotal += (item.quantity * item.price_unformatted)
  //   if(!item.taxable) nontaxablesubtotal += (item.quantity * item.price_unformatted)
  // })

  // createQuote('quote_subtotal', subtotal)
  // createQuote('quote_nontaxable_subtotal', nontaxablesubtotal)

  // let total = 0
  // quote.quote_lines.forEach((item) => {
  //   if(item.discount){
  //     if(item.taxable){
  //       total += ((((item.quantity * item.price_unformatted) - ((item.quantity * item.price_unformatted) * (quote.quote_discount / 100)))))
  //     }
  //   }else{
  //     if(item.taxable){
  //       total += (item.quantity * item.price_unformatted)
  //     }        
  //   }
  // })
  
  // total += (total * quote.quote_tax/100)

  // !nontaxablesubtotal
  // ? 
  //   (total = total - (nontaxablesubtotal - (nontaxablesubtotal * (quote.quote_discount/100))))
  // :
  //   (total = total + (nontaxablesubtotal - (nontaxablesubtotal * (quote.quote_discount/100))))

  // createQuote('quote_total', total)

  // let totalDeposit = quote.quote_deposit ? quote.quote_deposit.includes('$') ? +quote.quote_deposit.replace('$', '') : typeof(quote.quote_deposit) == 'string' ? (total * (quote.quote_deposit.replace('%', '')/100)) : 0 : 0

  // let balance = total - totalDeposit
  // createQuote('quote_balance', balance)

  // // DISCOUNT TOTAL
  // let discountTotal = 0
  // quote.quote_lines.forEach((item) => { 
  //   if(item.discount) discountTotal += +quote.quote_subtotal * (+quote.quote_discount / 100)
  // })
  // setDiscountTotal(discountTotal)
}