let initialState = {
  brand: '',
  model: '',
  category: '',
  quantity: '',
  location: '',
  qr_code: '',
  description: '',
  price: '',
  images: [],
}

export const productReducer = (state = initialState, action) => {
  switch(action.type){
    case "CREATE_PRODUCT":
      return {
        ...state,
        [action.name]: action.value
    }

    case 'ADD_PRODUCT_IMAGES':
      return {
        ...state,
        images: [...action.value]
      }
      break;

    case 'RESET_PRODUCT':
      return initialState
      break;
    
    default: 
      return state
  }
}