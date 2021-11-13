const initialState = {
  quantity: '',
  description: '',
  category: '',
  price: 0,
  price_unformatted: 0,
  taxable: false,
  discount: false,
  // PRODUCT
  model: '',
  brand: ''
}

export const quoteLineReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'CREATE_QUOTE_LINE':
      return {
        ...state,
        [action.name]: action.value
      }
      break;
    
    case 'RESET_QUOTE_LINE':
      return initialState
      break;
  
    default:
      return state
  }
}