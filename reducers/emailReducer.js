const initialState = {
  email: '',
  data: '',
  route: '',
  job: ''
}

export const emailReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'CREATE_EMAIL':
      return {
        ...state,
        [action.name]: action.value
      }
      break;
    
    case 'RESET_EMAIL':
      return initialState
      break;
  
    default:
      return state
  }
}