const initialState = {
  type: '',
  price: ''
}

export const cutoutReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'CREATE_CUTOUT':
      return {
        ...state,
        [action.name]: action.value
      }
      break;
    
    case 'RESET_CUTOUT':
      return initialState
      break;
  
    default:
      return state
  }
}