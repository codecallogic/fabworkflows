const initialState = {
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
  address_id: '',
}

export const contactReducer = ( state = initialState, action) => {
  switch (action.type) {
    case 'CREATE_CONTACT':
      return {
        ...state,
        [action.name]: action.value
      }
      break;
    
    case 'RESET_CONTACT':
      return initialState
      break;
  
    default:
      return state
  }

}