const initialState = {
  brand: '',
  model: '',
  color: '',
  price: '',
  images: []
}

export const priceListReducer = (state = initialState, action) => {

  switch (action.type) {
    case 'CREATE_PRICE_LIST':
      return {
        ...state,
        [action.name]: action.value
      }
      break;
    
    case 'PRICE_LIST_IMAGE':
      return {
        ...state,
        images: [...action.value]
      }
      break;

    case 'RESET_PRICE_LIST':
      return initialState
      break;

    default: 
      return state
  }
}