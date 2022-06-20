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

    case 'UPDATE_PO_LINE':
      console.log(action.value)
      let updateArray = [...state[action.name]]
      let newUpdatedArray = []

      newUpdatedArray = updateArray.filter((item, idx) => item.idx !== action.value.idx)
      newUpdatedArray.push(action.value)
      
      return {
        ...state,
        [action.name]: newUpdatedArray
      }
      break;

    default:
     return state
    }
}