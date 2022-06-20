const initialState = {
  description: '',
  color: '',
  unitCost: '',
  quantity: '',
  lineStatus: 'ordered',
  total: '',
  typeForm: '',
  idx: ''
}

export const purchaseOrderLineReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'CREATE_PO_LINE':

      return {
        ...state,
        [action.name]: action.value
      }
      break;
    
    case 'RESET_PO_LINE':
      return initialState
      break;
  
    default:
      return state
  }
}