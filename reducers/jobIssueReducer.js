const initialState = {
  job: '',
  subject: '',
  status: '',
  category: '',
  notes: '',
  history: []
}
export const jobIssueReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'CREATE_JOB_ISSUE':
     return {
        ...state,
        [action.name]: action.value
      }
      break;

    case 'CREATE_JOB_ISSUE_ARRAY_ITEM':
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

    case 'UPDATE_JOB_ISSUE_ARRAY_ITEM':
      let updateArray = [...state[action.name]]
      let newUpdatedArray = []

      newUpdatedArray = updateArray.filter((item) => item.id !== action.value.id)
      newUpdatedArray.push(action.value)

      return {
        ...state,
        [action.name]: newUpdatedArray
      }
      break;

    case 'RESET_JOB_ISSUE':
      return initialState
      break;

    default:
     return state
    }
}