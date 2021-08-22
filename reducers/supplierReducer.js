const initialState = {
  name: '',
  phone: '',
  tax_id: '',
  address: '',
  note: '',
  contact_name: '',
  contact_phone: '',
  contact_email: '',
  bank: '',
  account: '',
  agency: '',
  bank_notes: ''
}

export const supplierReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'ADD':
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