const initialState = {
  name: '',
  salesperson: '',
  tax_exempt: '',
  notes: '',
  accountAddress: '',
  contacts: [],
  priceLists: [],
  quotes: [],
  jobs: [],
  accountIssues: [],
  files: []
}

export const accountReducer = (state = initialState, action) => {
  switch(action.type){

    case 'CREATE_ACCOUNT':
      return {
        ...state,
        [action.name]: action.value
      }
      break;

    case 'RESET_ACCOUNT':
      return initialState
      break;

    case 'CREATE_ACCOUNT_ARRAY_ITEM':
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

    case 'UPDATE_ACCOUNT_ARRAY_ITEM':
      let updateArray = [...state[action.name]]
      let newUpdatedArray = []

      newUpdatedArray = updateArray.filter((item) => item._id !== action.value._id)
      newUpdatedArray.push(action.value)
      
      return {
        ...state,
        [action.name]: newUpdatedArray
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