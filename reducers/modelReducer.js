const initialState = {
  name: '',
}

export const modelReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'CREATE_MODEL':
      return {
        ...state,
        [action.name]: action.value
      }
      break;
    
    case 'RESET_MODEL':
      return initialState
      break;
  
    default:
      return state
  }
}