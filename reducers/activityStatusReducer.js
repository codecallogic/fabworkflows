const initialState = {
  status:'',
  abbreviation: '',
  color: '',
  confirmTimeChange: 'no',
  appointments: 'no',
  active: 'active',
}
export const activityStatusReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'CREATE_ACTIVITY_STATUS':
     return {
       ...state,
       [action.name]: action.value
      }
      break;

    case 'RESET_ACTIVITY_STATUS':
      return initialState
      break;

    default:
     return state
    }
}