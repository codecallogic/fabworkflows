import {useState, useEffect, useRef} from 'react'
import { connect } from 'react-redux'
import SVGs from '../../files/svgs'
import PlacesAutocomplete from 'react-places-autocomplete'
import {geocodeByPlaceId} from 'react-places-autocomplete'
import {API} from '../../config'
import axios from 'axios'

const searchOptionsAddress = {
  componentRestrictions: {country: 'us'},
  types: ['address']
}

const searchOptionsCities = {
  componentRestrictions: {country: 'us'},
  types: ['(cities)']
}

const Address = ({setmodal, quote, createQuote, resetQuote}) => {

  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [edit, setEdit] = useState('')
  const [loading, setLoading] = useState(false)
  const [show, setShow] = useState('address')

  const handleSelect = async (e, type, id) => {
    let geo
    
    if(id){
     geo = await geocodeByPlaceId(id)
    }

    if(geo){
      geo[0].address_components.forEach((item) => {
        console.log(item)
        if(item.types.includes('postal_code')){
          createQuote('zip_code', item.long_name)
        }
        if(item.types.includes('country')){
          createQuote('country', item.long_name)
        }
      })
    }

    if(type == 'address_one'){
      createQuote('address_one', e.split(',')[0])
    }
    
    createQuote('city', e.split(',')[1])
    createQuote('state', e.split(',')[2])
  }

  const validateIsNumber = (type) => {
    const input = document.getElementById(type)
    const regex = /[^0-9|\n\r]/g
    input.value = input.value.split(regex).join('')
  }

  const validateIsEmail = (type) => {
    const input = document.getElementById(type)
    const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/g
    return regex.test(input.value)
  }
  
  const addAddress = async (e) => {
    e.preventDefault()
    setLoading(true)
    if(!validateIsEmail('email')) return setError('Email is not valid')
    try {
      const responseAddress = await axios.post(`${API}/transaction/create-address`, quote)
      setLoading(false)
      resetQuote()
      setMessage(responseAddress.data)
    } catch (error) {
      console.log(error)
      setLoading(false)
      setmodal('')
      if(error) error.response ? setError(error.response.data) : setError('Error creating address, please try again later')
    }
  }
  
  return (
    <div className="addFieldItems-modal">
      <div className="addFieldItems-modal-box">
        <div className="addFieldItems-modal-box-header">
          <span className="addFieldItems-modal-form-title">{edit ? 'Edit Color' : 'Address'}</span>
          <div onClick={() => (setmodal(''), setError(''), setMessage(''), setEdit(''))}><SVGs svg={'close'}></SVGs></div>
        </div>
        <form className="addFieldItems-modal-form" onSubmit={(e) => addAddress(e)}>
          <div className="form-group-single-textarea">
            <div className="form-group-single-textarea-field">
              <label htmlFor="name">Contact Name</label>
              <textarea id="name" rows="1" name="name" placeholder="(Contact Name)" value={quote.name} onChange={(e) => createQuote('contact_name', e.target.value)} onFocus={(e) => e.target.placeholder = ''} onBlur={(e) => e.target.placeholder = '(Contact Name)'} wrap="off" onKeyDown={(e) => e.keyCode == 13 ? e.preventDefault() : null} autoFocus={true} required></textarea>
            </div>
          </div>
          <PlacesAutocomplete value={quote.address_one} onChange={(e) => createQuote('address_one', e)} onSelect={(e) => handleSelect(e, 'address_one', document.getElementById('address_place_id').value)} searchOptions={searchOptionsAddress}>
            {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
              <div className="form-group-single-textarea-autocomplete">
                <label htmlFor="address">Address One</label>
                <div className="form-group-single-textarea-autocomplete-textarea"><textarea {...getInputProps({rows: 2, placeholder: 'Address One'})} required/>
                {show == 'address' ? <span onClick={() => setShow('hide')}>Hide</span> : <span onClick={() => setShow('address')}>Show</span>}
                </div>
                <div  className="form-group-single-textarea-autocomplete-box">
                {show == 'address' && loading ? <div>...loading</div> : null}
                {show == 'address' && suggestions.map((suggestion, idx) => {
                  const className = suggestion.active
                  ? 'form-group-single-textarea-autocomplete-suggestion-active'
                  : 'form-group-single-textarea-autocomplete-suggestion';
                  const style = suggestion.active ? {cursor: 'pointer'} : {cursor: 'pointer'}
                  return (
                  <div key={idx} {...getSuggestionItemProps(suggestion, {className, style})}>{suggestion.description}
                  <input id="address_place_id" value={suggestion.placeId} readOnly/>
                  </div>
                  )
                })}
                </div>
              </div>
            )}
          </PlacesAutocomplete>
          <div className="form-group-single-textarea">
            <div className="form-group-single-textarea-field">
              <label htmlFor="address">City</label>
              <textarea id="city" rows="1" name="city" placeholder="(City)" value={quote.city} onChange={(e) => createQuote('city', e.target.value)} onFocus={(e) => e.target.placeholder = ''} onBlur={(e) => e.target.placeholder = '(City)'} wrap="off" onKeyDown={(e) => e.keyCode == 13 ? e.preventDefault() : null} required></textarea>
            </div>
          </div>
          <div className="form-group-single-textarea">
            <div className="form-group-single-textarea-field">
              <label htmlFor="state">State</label>
              <textarea id="state" rows="1" name="state" placeholder="(State)" value={quote.state} onChange={(e) => createQuote('state', e.target.value)} onFocus={(e) => e.target.placeholder = ''} onBlur={(e) => e.target.placeholder = '(State)'} wrap="off" onKeyDown={(e) => e.keyCode == 13 ? e.preventDefault() : null} required></textarea>
            </div>
          </div>
          <div className="form-group-single-textarea">
            <div className="form-group-single-textarea-field">
              <label htmlFor="zip_code">Zip Code</label>
              <textarea id="zip_code" rows="1" name="zip_code" placeholder="(Zip Code)" value={quote.zip_code} onChange={(e) => createQuote('zip_code', e.target.value)} onFocus={(e) => e.target.placeholder = ''} onBlur={(e) => e.target.placeholder = '(Zip Code)'} wrap="off" onKeyDown={(e) => e.keyCode == 13 ? e.preventDefault() : null} required></textarea>
            </div>
          </div>
          <div className="form-group-single-textarea">
            <div className="form-group-single-textarea-field">
              <label htmlFor="phone">Phone</label>
              <textarea id="phone_number" rows="1" name="phone" placeholder="(Phone Number)" value={quote.phone} onChange={(e) => (validateIsNumber('phone_number'), createQuote('phone', e.target.value))} onFocus={(e) => e.target.placeholder = ''} onBlur={(e) => e.target.placeholder = '(Phone Number)'} wrap="off" onKeyDown={(e) => e.keyCode == 13 ? e.preventDefault() : null}></textarea>
            </div>
          </div>
          <div className="form-group-single-textarea">
            <div className="form-group-single-textarea-field">
              <label htmlFor="cell">Cell Number</label>
              <textarea id="cell_number" rows="1" name="cell" placeholder="(Cell Number)" value={quote.cell} onChange={(e) => (validateIsNumber('cell_number'), createQuote('cell', e.target.value))} onFocus={(e) => e.target.placeholder = ''} onBlur={(e) => e.target.placeholder = '(Cell Number)'} wrap="off" onKeyDown={(e) => e.keyCode == 13 ? e.preventDefault() : null} ></textarea>
            </div>
          </div>
          <div className="form-group-single-textarea">
            <div className="form-group-single-textarea-field">
              <label htmlFor="fax">Fax</label>
              <textarea id="fax" rows="1" name="fax" placeholder="(Fax)" value={quote.fax} onChange={(e) => (createQuote('fax', e.target.value))} onFocus={(e) => e.target.placeholder = ''} onBlur={(e) => e.target.placeholder = '(Fax)'} wrap="off" onKeyDown={(e) => e.keyCode == 13 ? e.preventDefault() : null} ></textarea>
            </div>
          </div>
          <div className="form-group-single-textarea">
            <div className="form-group-single-textarea-field">
              <label htmlFor="email">Email</label>
              <textarea id="email" rows="1" name="email" placeholder="(Email)" value={quote.email} onChange={(e) => (createQuote('email', e.target.value))} onFocus={(e) => e.target.placeholder = ''} onBlur={(e) => e.target.placeholder = '(Email)'} wrap="off" onKeyDown={(e) => e.keyCode == 13 ? e.preventDefault() : null} ></textarea>
            </div>
          </div>
          <div className="form-group-single-textarea">
            <div className="form-group-single-textarea-field">
              <label htmlFor="notes">Notes</label>
              <textarea id="notes" rows="4" name="notes" placeholder="(Notes)" value={quote.address_notes} onChange={(e) => (createQuote('address_notes', e.target.value))} onFocus={(e) => e.target.placeholder = ''} onBlur={(e) => e.target.placeholder = '(Notes)'} ></textarea>
            </div>
          </div>
          {!edit && <button type="submit" className="form-button w100">{!loading && <span>Save</span>} {loading && <div className="loading"><span></span><span></span><span></span></div>}</button>}
          {edit == 'color' && <button onClick={(e) => updateColor(e)} className="form-button w100">{!loading && <span>Update Color</span>} {loading && <div className="loading"><span></span><span></span><span></span></div>}</button>}
          {error && <span className="form-error"><SVGs svg={'error'}></SVGs>{error}</span>}
          {message && <span className="form-message-modal">{message}</span>}
        </form>
      </div>
    </div>
  )
}

const mapStateToProps = (state) => {
  return {
    quote: state.quote
  }
}

const mapDispatchToProps = dispatch => {
  return {
    createQuote: (name, data) => dispatch({type: 'CREATE_QUOTE', name: name, value: data}),
    resetQuote: () => dispatch({type: 'RESET'})
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Address)
