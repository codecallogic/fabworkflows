const initialState = {
  name: '',
}

export const brandReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'CREATE_BRAND':
      return {
        ...state,
        [action.name]: action.value
      }
      break;
    
    case 'RESET_BRAND':
      return initialState
      break;
  
    default:
      return state
  }
}