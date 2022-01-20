const initialState = {
  name: '',
}

export const colorReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'CREATE_COLOR':
      return {
        ...state,
        [action.name]: action.value
      }
      break;
    
    case 'RESET_COLOR':
      return initialState
      break;
  
    default:
      return state
  }
}