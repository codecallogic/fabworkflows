const initialState = {
  // ADDRESS
  name: '',
  address: '',
  city: '',
  state: '',
  zip_code: '',
  country: '',
  email: '',
  order: '',
  total: ''
}

export const orderReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'CREATE_ORDER':
      return {
        ...state,
        [action.name]: action.value
      }
      break;
    
    case 'RESET_ORDER':
      return initialState
      break;

    case 'UPDATE_ORDER':
      let newArray = [...state.quote_lines]
      newArray[action.index] = action.quoteline

      return {
        ...state,
        quote_lines: newArray
      }

    case 'DELETE_ORDER':
      let oldArray = [...state.quote_lines]
      let newArrayWithRemovedQuoteLine = oldArray.filter((item, index) => index !== action.index)

      return {
        ...state,
        quote_lines: newArrayWithRemovedQuoteLine
      }
  
    default:
      return state
  }
}