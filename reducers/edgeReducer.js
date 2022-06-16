const initialState = {
  type: '',
  price: ''
}

export const edgeReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'CREATE_EDGE':
      return {
        ...state,
        [action.name]: action.value
      }
      break;
    
    case 'RESET_EDGE':
      return initialState
      break;
  
    default:
      return state
  }
}