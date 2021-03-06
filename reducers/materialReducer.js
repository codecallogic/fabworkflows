const initialState = {
  name: '',
  description: ''
}

export const materialReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'CREATE_MATERIAL':
      return {
        ...state,
        [action.name]: action.value
      }
      break;
    
    case 'RESET_MATERIAL':
      return initialState
      break;
  
    default:
      return state
  }
}