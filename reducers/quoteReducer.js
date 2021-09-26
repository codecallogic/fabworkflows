const initialState = {
  address_one: '',
  city: '',
  state: '',
  zip_code: '',
  country: ''
}

export const quoteReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'CREATE_QUOTE':
      return {
        ...state,
        [action.name]: action.value
      }
      break;
    
    case 'RESET':
      return initialState
      break;
  
    default:
      return state
  }
}