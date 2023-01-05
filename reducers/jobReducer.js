import { formatDate } from '../helpers/validations'
import { getWeekDayListJobActivities } from '../helpers/calendar'

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
  contracts: [],
}

export const jobReducer = (state = initialState, action) => {
  switch(action.type){

    case 'CREATE_JOB':
      // console.log("NAME", action.name, "VALUE", action.value)
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

      // console.log(updateArray)

      if(action.value.name && action.value.startDate){
        updateArray.forEach((item, idx) => {

          // console.log(item)
          
          if(item.dependency.activity === action.value.name && item.status === 'auto-schedule'){

            if(item.dependency.typeOfDay === 'days'){
              
              if(item.dependency.schedule === 'after'){
                let date = new Date(action.value.startDate)
                // console.log('DATE', date)
                let newDate = new Date(date.setDate(date.getDate() + +item.dependency.days))

                // console.log('NEW DATE AFTER', newDate)
                item.startDate = formatDate(newDate)
              }

              if(item.dependency.schedule === 'before'){
                let date = new Date(action.value.startDate)
                // console.log('DATE', date)
                let newDate = new Date(date.setDate(date.getDate() - +item.dependency.days))

                // console.log('NEW DATE BEFORE', newDate)
                item.startDate = formatDate(newDate)

              }

            }
            
            if(item.dependency.typeOfDay === 'workdays'){

              if(item.dependency.schedule === 'after'){
                let date = new Date(action.value.startDate)

                const days = getWeekDayListJobActivities(date, item.dependency.days, 'after')

                item.startDate = formatDate(days[days.length - 1])

              }

              if(item.dependency.schedule === 'before'){
                let date = new Date(action.value.startDate)

                const days = getWeekDayListJobActivities(date, item.dependency.days, 'before')

                item.startDate = formatDate(days[days.length - 1])

              }

            }
            
          }
          
        })
      }

      // console.log(updateArray)
      // console.log(action.value)
      
      newUpdatedArray = updateArray.filter((item, idx) => (item._id ? item._id : idx) !== action.value._id)

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
    
    case 'CREATE_JOB_ISSUE_ITEM':
      let issueArray = [...state[action.name]]
      let newIssueArray = []

      if(issueArray.findIndex((item) => item.subject == action.value.subject) == -1){
        issueArray.push(action.value)
        newIssueArray = [...issueArray]
      }else{
        newIssueArray = issueArray.filter((item) => item.subject !== action.value.subject)
      }

      return {
        ...state,
        [action.name]: newIssueArray
      }
      break;
    
    default:
      return state
  }
}