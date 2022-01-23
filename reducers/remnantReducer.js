const initialState = {
  name: '',
  material: '',
  color: '',
  lot: '',
  bundle: '',
  supplier_ref: '',
  bin: '',
  shape: '',
  notes: '',
  qr_code: '',
  l1: '',
  w1: '',
  l2: '',
  w2: '',
  images: []
}

export const remnantReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'CREATE_REMNANT':
      return {
        ...state,
        [action.name]: action.value
      }
      break;
    
    case 'ADD_REMNANT_IMAGES':
      return {
        ...state,
        images: [...action.value]
      }
      break;
    
    case 'RESET_REMNANT':
      return initialState
      break;

    default:
      return state
  }
}