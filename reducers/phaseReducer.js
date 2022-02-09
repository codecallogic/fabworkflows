const initialState = {
  name: '',
}

export const phaseReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'CREATE_PHASE':
      return {
        ...state,
        [action.name]: action.value
      }
      break;
    
    case 'RESET_PHASE':
      return initialState
      break;
  
    default:
      return state
  }
}