import {combineReducers} from 'redux'
import {navReducer} from './navReducer'
import {slabReducer} from './slabReducer'
import {productReducer} from './productReducer'
import {materialReducer} from './materialReducer'
import {supplierReducer} from './supplierReducer'
import {remnantReducer} from './remnantReducer'
import {quoteReducer} from './quoteReducer'
import {quoteLineReducer} from './quoteLineReducer'

const rootReducer = combineReducers({
  nav: navReducer,
  slab: slabReducer,
  product: productReducer,
  material: materialReducer,
  supplier: supplierReducer,
  remnant: remnantReducer,
  quote: quoteReducer,
  quoteLine: quoteLineReducer
})

export default rootReducer