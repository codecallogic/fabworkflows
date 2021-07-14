import {combineReducers} from 'redux'
import {navReducer} from './navReducer'
import {slabReducer} from './slabReducer'

const rootReducer = combineReducers({
  nav: navReducer,
  slab: slabReducer
})

export default rootReducer