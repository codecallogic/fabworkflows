const initialState = {
  name: ''
}

export const locationReducer = ( state = initialState, action) => {
  switch (action.type) {
    case 'CREATE_LOCATION':
      return {
        ...state,
        [action.name]: action.value
      }
      break;
    
    case 'RESET_LOCATION':
      return initialState
      break;
  
    default:
      return state
  }

}