const initialState = {
  name: '',
  account: '',
  date: '',
  salesperson: '',
  invoice: '',
  notes: '',
  jobAddress: '',
  accountAddress: '',
  quotes: []
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
      return {
        ...state,
        [action.name]: [...state[action.name], action.value]
      }
      break;

    case 'REMOVE_QUOTE_ITEM':
      let oldArray = [...state.quotes]

      let newArray = oldArray.filter((item, index) => item.quote_name !== action.value)

      return {
        ...state,
        quotes: newArray
      }
      break;
    
    default:
      return state
  }
}