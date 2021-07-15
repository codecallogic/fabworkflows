const initialState = {
  material: '',
  color: '',
  quantity: '',
  size_1: '',
  size_2: '',
  thickness: '',
  price_slab: '',
  price_sqft: '',
  block: '',
  qr_code: ''
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