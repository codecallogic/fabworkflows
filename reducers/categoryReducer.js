const initialState = {
  name: '',
}

export const categoryReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'CREATE_CATEGORY':
      return {
        ...state,
        [action.name]: action.value
      }
      break;
    
    case 'RESET_CATEGORY':
      return initialState
      break;
  
    default:
      return state
  }
}