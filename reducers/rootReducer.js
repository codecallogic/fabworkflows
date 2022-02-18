import { combineReducers } from 'redux'
import { navReducer } from './navReducer'
import { slabReducer } from './slabReducer'
import { productReducer } from './productReducer'
import { materialReducer } from './materialReducer'
import { colorReducer } from './colorReducer'
import { supplierReducer } from './supplierReducer'
import { contactReducer } from './contactReducer'
import { remnantReducer } from './remnantReducer'
import { brandReducer } from './brandReducer'
import { modelReducer } from './modelReducer'
import { categoryReducer } from './categoryReducer'
import { quoteReducer } from './quoteReducer'
import { quoteLineReducer } from './quoteLineReducer'
import { orderReducer } from './orderReducer'
import { priceListReducer } from './priceListReducer'
import { phaseReducer } from './phaseReducer'
import { jobReducer } from './jobReducer'
import { assigneeReducer } from './assigneeReducer'
import { activityReducer } from './activityReducer'
import { dependencyReducer } from './dependencyReducer'

const rootReducer = combineReducers({
  nav: navReducer,
  slab: slabReducer,
  product: productReducer,
  material: materialReducer,
  color: colorReducer,
  supplier: supplierReducer,
  contact: contactReducer,
  remnant: remnantReducer,
  brand: brandReducer,
  model: modelReducer,
  category: categoryReducer,
  quote: quoteReducer,
  quoteLine: quoteLineReducer,
  order: orderReducer,
  priceList: priceListReducer,
  phase: phaseReducer,
  job: jobReducer,
  assignee: assigneeReducer,
  activity: activityReducer,
  dependency: dependencyReducer
})

export default rootReducer