const initialState = {
  job: '',
  name: '',
  description: '',
  status: 'active',
  contract: '',
  email: '',
  subject: '',
  message: ''
}

export const contractReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'CREATE_CONTRACT':
      return {
        ...state,
        [action.name]: action.value
      }
      break;
    
    case 'RESET_CONTRACT':
      return initialState
      break;
  
    default:
      return state
  }
}