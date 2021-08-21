const initialState = {
  name: '',
  color: '',
  classification: '',
  composition: ''
}

export const materialReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'ADD':
      return {
        ...state,
        [action.name]: action.value
      }
      break;
  
    default:
      return state
  }
}