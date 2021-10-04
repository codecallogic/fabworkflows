const initialState = {
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
  quote_name: '',
  price_list: '',
  price_list_id: '',
  salesperson: '',
  lead: '',
  quote_number: '',
  po_number: '',
  quote_notes: ''
}

export const quoteReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'CREATE_QUOTE':
      return {
        ...state,
        [action.name]: action.value
      }
      break;
    
    case 'RESET':
      return initialState
      break;
  
    default:
      return state
  }
}