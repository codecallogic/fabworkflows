const initialState = {
  name: '',
  account: '',
  date: '',
  salesperson: '',
  invoice: '',
  notes: '',
  jobAddress: '',
  accountAddress: '',
  quotes: [],
  activities: [],
  purchaseOrders: [],
  jobIssues: [],
  files: [],
  contracts: []
}

export const jobReducer = (state = initialState, action) => {
  switch(action.type){

    case 'CREATE_JOB':
      return {
        ...state,
        [action.name]: action.value
      }
      break;

    case 'RESET_JOB':
      return initialState
      break;

    case 'CREATE_JOB_ARRAY_ITEM':
      let oldArray = [...state[action.name]]
      let newArray = []
      
      if(oldArray.findIndex((item) => item._id == action.value._id) == -1){
        oldArray.push(action.value)
        newArray = [...oldArray]
      }else{
        newArray = oldArray.filter((item) => item._id !== action.value._id)
      }


      return {
        ...state,
        [action.name]: newArray
      }
      break;

    case 'UPDATE_JOB_ARRAY_ITEM':
      let updateArray = [...state[action.name]]
      let newUpdatedArray = []

      newUpdatedArray = updateArray.filter((item) => item._id !== action.value._id)
      newUpdatedArray.push(action.value)
      
      return {
        ...state,
        [action.name]: newUpdatedArray
      }
      break;

    case 'COMPLETE_ACTIVITY_STATUS':
      let activitiesComplete = [...state[action.name]]

      activitiesComplete.forEach( (item) => {
        if(item._id == action.value._id){
          item.status = 'complete'
        }
      })
      
      return {
        ...state,
        [action.name]: activitiesComplete
      }
      
      break;

    case 'CANCEL_ACTIVITY_STATUS':
      let activitiesCancelled = [...state[action.name]]

      activitiesCancelled.forEach( (item) => {
        if(item._id == action.value._id){
          item.status = 'cancelled'
        }
      })
      
      return {
        ...state,
        [action.name]: activitiesCancelled
      }
      
      break;

    case 'ADD_ARRAY_WITH_ITEMS':
      return {
        ...state,
        [action.name]: [...action.value]
      }
      break;
    
    default:
      return state
  }
}