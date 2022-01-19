const initialState = {
  material: '',
  color: '',
  grade: '',
  finish: '',
  quantity: '',
  size_1: '',
  size_2: '',
  thickness: '',
  price_slab: '',
  price_sqft: '',
  block: '',
  supplier: '',
  location: '',
  ordered_status: '',
  received_status: '',
  delivered_status: '',
  lot_number: '',
  delivery_date: '',
  images: [],
  qr_code: '',
}

export const slabReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'CREATE_SLAB':
      return {
        ...state,
        [action.name]: action.value
      }
      break;

    case 'ADD_SLAB_IMAGES':
      return {
        ...state,
        images: [...action.value]
      }
      break;
    
    case 'RESET_SLAB':
      return initialState
      break;

    default:
      return state
  }
}