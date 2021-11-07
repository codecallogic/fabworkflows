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
  quote_discount: 0,
  quote_tax: 0,
  quote_deposit: '',
  // QUOTE LINES
  quote_lines: [],
  quote_subtotal: 0,
  quote_discount: '',
  quote_nontaxable_subtotal: '',
  quote_nontaxable_discount: '',
  quote_total: '',
  quote_balance: '',
  // VARIABLES
  quote_count: 0
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

    case 'ADD_QUOTE_LINE':
      return {
        ...state,
        quote_lines: [...state.quote_lines, action.value]
      }
      break;

    case 'UPDATE_QUOTE_LINE':
      let newArray = [...state.quote_lines]
      newArray[action.index] = action.quoteline

      return {
        ...state,
        quote_lines: newArray
      }
  
    default:
      return state
  }
}