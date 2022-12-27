const initialState = {
  message: '',
  email: '',
  settings: ''
}

export const messageReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'CREATE_MESSAGE':
      return {
        ...state,
        [action.name]: action.value
      }
      break;
    
    case 'RESET_MESSAGE':
      return initialState
      break;
  
    default:
      return state
  }
}