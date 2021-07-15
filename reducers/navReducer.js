const initialState = {
  sidenav: true,
  main: false,
  slab: false,
  new: true,
}

export const navReducer = (state = initialState, action) => {
  console.log(action)
  switch(action.type){

    case "TOGGLE_SIDENAV":
      return {
        ...state,
        sidenav: !state.sidenav
      }
    
    case "CHANGE_VIEW":
      return {
        ...state,
        [action.name]: !state[action.name],
        [action.toggle]: !state[action.toggle]
      }
    
    default: 
      return state
  }
}