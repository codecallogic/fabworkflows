const initialState = {
  supplier: '',
  shipping: '',
  POnumber: ''
}
export const purchaseOrderReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'CREATE_PO':
      return {
        ...state,
        [action.name]: action.value
      }
      break;
    
    case 'RESET_PO':
      return initialState
      break;

    default:
     return state
    }
}