const initialState = {
  type:'',
  occurrenceDay: '',
  occurrenceWeek: '',
  occurrenceMonth: '',
  occurrenceType: '',
  rangeEndOccurrence: '',
  rangeEndDate: ''
}

export const recurringReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'CREATE_RECURRING':
     return {
       ...state,
       [action.name]: action.value
      }
      break;

    case 'RESET_RECURRING':
      return initialState
      break;

    default:
     return state
    }
}