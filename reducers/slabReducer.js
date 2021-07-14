const initialState = {
  price_slab: '',
  price_sqft: ''
}

export const slabReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'CREATE_SLAB':
      return {
        ...state,
        [action.name]: action.value
      }
      break;
  
    default:
      return state
  }
}