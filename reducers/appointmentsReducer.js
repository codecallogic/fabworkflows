const initialState = {
  name:'',
  status: '',
  startDate: '',
  scheduleTime: '',
  duration: '',
  assigne: '',
  category: '',
  notes: '',
  recurring: '',
}

export const appointmentReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'CREATE_APPOINTMENT':
     return {
       ...state,
       [action.name]: action.value
      }
      break;

    case 'RESET_APPOINTMENT':
      return initialState
      break;

    default:
     return state
    }
}