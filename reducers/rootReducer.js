import {combineReducers} from 'redux'
import {navReducer} from './navReducer'
import {slabReducer} from './slabReducer'
import {productReducer} from './productReducer'
import {materialReducer} from './materialReducer'
import {colorReducer} from './colorReducer'
import {supplierReducer} from './supplierReducer'
import {locationReducer} from './locationReducer'
import {remnantReducer} from './remnantReducer'
import {quoteReducer} from './quoteReducer'
import {quoteLineReducer} from './quoteLineReducer'
import {orderReducer} from './orderReducer'
import {priceListReducer} from './priceListReducer'
import {jobReducer} from './jobReducer'

const rootReducer = combineReducers({
  nav: navReducer,
  slab: slabReducer,
  product: productReducer,
  material: materialReducer,
  color: colorReducer,
  supplier: supplierReducer,
  location: locationReducer,
  remnant: remnantReducer,
  quote: quoteReducer,
  quoteLine: quoteLineReducer,
  order: orderReducer,
  priceList: priceListReducer,
  job: jobReducer
})

export default rootReducer