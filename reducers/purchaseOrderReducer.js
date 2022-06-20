const initialState = {
  supplier: '',
  shipping: '',
  POnumber: '',
  status: 'not ordered',
  orderDate: '',
  expectedDelivery: '',
  taxRate: '',
  notes: '',
  POLines: []
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

    case 'ADD_PO_LINE':
      let oldArray = [...state[action.name]]
      let newArray = []

      if(oldArray.findIndex((item) => item.idx == action.value.idx) == -1){
        oldArray.push(action.value)
        newArray = [...oldArray]
      }else{
        newArray = oldArray.filter((item) => item.idx !== action.value.idx)
      }

      return {
        ...state,
        POLines: newArray
      }
      break;

    default:
     return state
    }
}