const initialState = {
  // ADDRESS
  contact_name: '',
  address_one: '',
  city: '',
  state: '',
  zip_code: '',
  country: '',
  phone: '',
  cell: '',
  fax: '',
  email: '',
  address_notes: '',
  // QUOTE DETAIL
  quote_name: '',
  price_list: '',
  price_list_id: '',
  salesperson: '',
  lead: '',
  quote_number: '',
  po_number: '',
  quote_notes: '',
  // REVISION
  quote_date: '',
  quote_discount: '',
  quote_tax: '',
  quote_deposit: ''
}

export const quoteReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'CREATE_QUOTE':
      return {
        ...state,
        [action.name]: action.value
      }
      break;
    
    case 'RESET_QUOTE':
      return initialState
      break;
  
    default:
      return state
  }
}