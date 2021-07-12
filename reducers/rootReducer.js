import {combineReducers} from 'redux'
import {navReducer} from './navReducer'

const rootReducer = combineReducers({
  nav: navReducer
})

export default rootReducer