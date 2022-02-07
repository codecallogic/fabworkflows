const initialState = {
  // ADDRESS
  contact_name: '',
  address: '',
  city: '',
  state: '',
  zip_code: '',
  country: '',
  phone: '',
  cell: '',
  fax: '',
  email: '',
  contact_notes: '',

  // QUOTE DETAIL
  quote_name: '',
  salesperson: '',
  lead: '',
  quote_number: '',
  po_number: '',
  quote_notes: '',

  // REVISION
  quote_date: '',
  quote_discount: '',
  quote_tax: '',
  quote_deposit: '',

  // QUOTE LINES
  quote_lines: [],
  quote_subtotal: '',
  quote_taxable_discount: '',
  quote_taxable_total: '',
  quote_nontaxable_subtotal: '',
  quote_nontaxable_discount: '',
  quote_total: '',
  quote_deposit_total: '',
  quote_balance: '',
  payment: ''
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
      newArray[action.name] = action.value

      return {
        ...state,
        quote_lines: newArray
      }

    case 'DELETE_QUOTE_LINE':
      let oldArray = [...state.quote_lines]
      let newArrayWithRemovedQuoteLine = oldArray.filter((item, index) => index !== action.value)

      return {
        ...state,
        quote_lines: newArrayWithRemovedQuoteLine
      }
  
    default:
      return state
  }
}