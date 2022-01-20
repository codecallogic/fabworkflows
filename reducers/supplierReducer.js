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
  bank_note: ''
}

export const supplierReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'CREATE_SUPPLIER':
      return {
        ...state,
        [action.name]: action.value
      }
      break;

    case 'RESET_SUPPLIER':
      return initialState
      break;
  
    default:
      return state
  }
}