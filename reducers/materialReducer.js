const initialState = {
  name: '',
  description: ''
}

export const materialReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'ADD':
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