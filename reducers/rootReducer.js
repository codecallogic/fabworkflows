import {combineReducers} from 'redux'
import {navReducer} from './navReducer'
import {slabReducer} from './slabReducer'
import {productReducer} from './productReducer'
import {materialReducer} from './materialReducer'

const rootReducer = combineReducers({
  nav: navReducer,
  slab: slabReducer,
  product: productReducer,
  material: materialReducer
})

export default rootReducer