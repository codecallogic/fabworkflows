const initialState = {
  sidenav: true
}

export const navReducer = (state = initialState, action) => {
  switch(action.type){

    case "toggleSideNav":
      console.log('hello')
      return {
        ...state,
        sidenav: !state.sidenav
      }
    
    default: 
      return state
  }
}