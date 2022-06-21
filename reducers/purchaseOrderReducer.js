const initialState = {
  supplier: '',
  shipping: '',
  POnumber: '',
  status: 'not ordered',
  orderDate: '',
  expectedDelivery: '',
  taxRate: '',
  notes: '',
  POLines: [],
  files: []
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
      let updateArray = [...state[action.name]]
      let newUpdatedArray = []

      newUpdatedArray = updateArray.filter((item, idx) => item.idx !== action.value.idx)
      newUpdatedArray.push(action.value)
      
      return {
        ...state,
        [action.name]: newUpdatedArray
      }
      break;

    case 'RECEIVE_PO_LINE':
      let updateReceiveArray = [...state[action.name]]
      let newReceiveArray = []
      
      newReceiveArray = updateReceiveArray.filter((item, idx) => item.idx !== action.value.idx)
      newReceiveArray.push(action.value)
      
      return {
        ...state,
        [action.name]: newReceiveArray
      }
      break;

    case 'PO_DELIVERY_DATE':
      let updateDeliveryArray = [...state[action.name]]
      let newDeliveryArray = []
      
      if(action.value){
        updateDeliveryArray.forEach((item, idx) => {
          item.deliveryDate = action.value;
          item.lineStatus = 'delivered';
        })
      }
      
      return {
        ...state,
        [action.name]: updateDeliveryArray
      }
      break;

    case 'ADD_PO_ARRAY_WITH_ITEMS':
      return {
        ...state,
        [action.name]: [...action.value]
      }
      break;

    default:
     return state
    }
}