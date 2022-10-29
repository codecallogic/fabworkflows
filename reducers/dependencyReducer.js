const initialState = {
  name: '',
  schedule: 'after',
  activity: '',
  days: '',
  typeOfDay: 'workdays',
  ignoreForAutoSchedule: '',
  activityID: '',
  statusType: ''
}
export const dependencyReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'CREATE_DEPENDENCY':
     return {
       ...state,
       [action.name]: action.value
      }
      break;

    case 'RESET_DEPENDENCY':
      return initialState
      break;

    default:
     return state
    }
}