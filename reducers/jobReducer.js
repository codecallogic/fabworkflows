const initialState = {
  name: '',
  createdAt: '',
  salesperson: '',
  invoice: '',
  notes: ''
}

export const jobReducer = (state = initialState, action) => {
  switch(action.type){

    case 'CREATE_JOB':
      return {
        ...state,
        [action.name]: action.value
      }
      break;
    
    default:
      return state
  }
}