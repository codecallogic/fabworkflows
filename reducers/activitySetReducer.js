const initialState = {
  name:'',
  set: [],
}
export const activitySetReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'CREATE_ACTIVITY_SET':
     return {
       ...state,
       [action.name]: action.value
      }
      break;
      
    case 'RESET_ACTIVITY_SET':
      return initialState
      break;

    case 'CREATE_ACTIVITY_SET_ITEM':
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

    default:
     return state
    }
}