const initialState = {
  sidenav: true,
  main: false,
  slab: false,
  new: true,
}

export const navReducer = (state = initialState, action) => {
  switch(action.type){

    case "TOGGLE_SIDENAV":
      if(action.toggle == 'toggle_nav_button'){
        document.getElementById('nav-toggle').checked = false
      }
      
      return {
        ...state,
        sidenav: !state.sidenav
      }

    case "HIDE_SIDENAV":
      return {
        ...state,
        sidenav: false
      }

    case "SHOW_SIDENAV":
      return {
        ...state,
        sidenav: true
      }
    
    case "CHANGE_VIEW":
      return {
        ...state,
        [action.name]: !state[action.name],
        [action.toggle]: !state[action.toggle]
      }

    case "NEW_VIEW":
      return {
        ...state,
        new: true,
        slab: false,
        main: false
      }
    
    default: 
      return state
  }
}