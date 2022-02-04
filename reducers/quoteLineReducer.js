const initialState = {
  category: '',
  quantity: '',
  description: '',
  price: '',
  taxable: false,
  discount: false,

  // PRODUCT
  model: '',
  brand: '',
  typeForm: '',
  idx: ''
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