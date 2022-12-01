const initialState = {
  name: '',
  phone: '',
  color: '',
  description: '',
  status: ''
}

export const assigneeReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'CREATE_ASSIGNEE':
      return {
        ...state,
        [action.name]: action.value
      }
      break;
    
    case 'RESET_ASSIGNEE':
      return initialState
      break;
  
    default:
      return state
  }
}