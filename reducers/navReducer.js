const initialState = {
  sidenav: true,
  view: 'new',
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
        view: action.value,
      }

    case "NEW_VIEW":
      return {
        ...state,
        view: action.value
      }
    
    default: 
      return state
  }
}