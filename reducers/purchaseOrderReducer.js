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
  files: [],
  jobs: []
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

      let oldItemUpdate = updateArray.findIndex((item, idx) => item.idx == action.value.idx)
      if(!isNaN(oldItemUpdate)) updateArray[oldItemUpdate] = action.value
      
      return {
        ...state,
        [action.name]: updateArray
      }
      break;

    case 'RECEIVE_PO_LINE':
      let updateReceiveArray = [...state[action.name]]
      
      let oldItem = updateReceiveArray.findIndex((item, idx) => item.idx == action.value.idx)
      
      if(oldItem) updateReceiveArray[oldItem] = action.value
      
      return {
        ...state,
        [action.name]: updateReceiveArray
      }
      break;

    case 'PO_DELIVERY_DATE':
      let updateDeliveryArray = [...state[action.name]]
      
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

    case 'CREATE_PO_ARRAY_ITEM':
      let oldJobsArray = [...state[action.name]]
      let newJobsArray = []

      if(oldJobsArray.findIndex((item) => item._id == action.value._id) == -1){
        oldJobsArray.push(action.value)
        newJobsArray = [...oldJobsArray]
      }else{
        newJobsArray = oldJobsArray.filter((item) => item._id !== action.value._id)
      }

      return {
        ...state,
        [action.name]: newJobsArray
      }
      break;

    default:
     return state
    }
}