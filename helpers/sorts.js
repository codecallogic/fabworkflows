export {
  slabSort,
  productSort,
  remnantSort,
  materialSort,
  priceSort,
  quoteSort,
  jobSort,
  assigneeSort,
  activitySort,
  activityStatusSort,
  activitySetSort
}

const slabSort = ['lot_number','location','supplier','block','price_sqft','price_slab','thickness','size_2','size_1','finish','color','grade', 'delivered_status', 'received_status','ordered_status', 'delivery_date','quantity', 'material', 'qr_code', 'images']

const productSort = ['location', 'description', 'quantity', 'price', 'category', 'model', 'brand', 'qr_code', 'images']

const remnantSort = ['bundle', 'lot', 'bin', 'supplier_ref', 'notes', 'l1', 'w1', 'l2', 'w2', 'color', 'shape', 'material', 'name', 'qr_code', 'images']

const materialSort = ['name']

const priceSort = ['model', 'color', 'brand', 'price', 'images']

const quoteSort = ['address', 'city', 'state', 'zip_code', 'country', 'phone', 'cell', 'fax', 'email', 'contact_notes', 'contact_name', 'salesperson', 'lead', 'po_number', 'quote_notes', 'quote_lines', 'quote_subtotal', 'quote_discount', 'quote_taxable_discount', 'quote_taxable_total', 'quote_nontaxable_subtotal', 'quote_nontaxable_discount', 'quote_total', 'quote_deposit_total', 'quote_deposit', 'quote_discount', 'quote_tax', 'quote_balance', 'quote_date', 'payment', 'quote_number', 'quote_name']

const jobSort = ['files', 'priceLists', 'contacts', 'jobAddress', 'account', 'activities', 'quotes', 'accountAddress',  'notes', 'date', 'invoice', 'salesperson', 'name']

const assigneeSort = ['description', 'color', 'status', 'name']

const activitySort = ['description', 'assignee', 'dependency', 'status', 'color', 'duration', 'cost', 'active', 'name']

const activityStatusSort = ['active', 'appointments', 'confirmTimeChange', 'color', 'abbreviation', 'status']

const activitySetSort = ['set', 'name']