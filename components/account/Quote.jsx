import {useState, useEffect, useRef} from 'react'
import { connect } from 'react-redux'
import SVGs from '../../files/svgs'
import PlacesAutocomplete from 'react-places-autocomplete'
import {geocodeByPlaceId} from 'react-places-autocomplete'
import {API} from '../../config'
import axios from 'axios'
import Calendar from 'react-calendar'
import 'react-calendar/dist/Calendar.css';

const searchOptionsAddress = {
  componentRestrictions: {country: 'us'},
  types: ['address']
}

const searchOptionsCities = {
  componentRestrictions: {country: 'us'},
  types: ['(cities)']
}

const Quote = ({quote, createQuote, priceList, addressList}) => {
  const myRefs = useRef(null)
  const [error, setError] = useState('')
  const [modal, setModal] = useState('')
  const [edit, setEdit] = useState('')
  const [loading, setLoading] = useState('')
  const [show, setShow] = useState('address')
  const [input_dropdown, setInputDropdown] = useState('')
  const [calendar, setCalendar] = useState('')
  const [allPriceLists, setPriceLists] = useState(priceList ? priceList : '')
  const [allAddresses, setAllAddresses] = useState(addressList ? addressList : '')

  const handleClickOutside = (event) => {
    if(myRefs.current){
      if(!myRefs.current.contains(event.target)){
        setInputDropdown('')
      }
    }
  }

  useEffect(() => {
    document.addEventListener("click", handleClickOutside, true);

    return () => {
      document.removeEventListener("click", handleClickOutside, true);
    };
  }, [])

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

  const formatDate = (e) => {

    const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    
    var month = monthNames[e.getUTCMonth()]
    var day = e.getUTCDate()
    var year = e.getUTCFullYear()
    return `${month} ${day}, ${year}`
  }

  const handleDate = (date) => {
    setCalendar(date)
    createQuote('quote_date', formatDate(date))
    setInputDropdown('')
  }
  
  return (
    <div className="clientDashboard-view-slab_form-container">
      <div className="clientDashboard-view-slab_form-heading">
        <span>New Quote</span>
        <div className="form-error-container">
          {error && <span className="form-error"><SVGs svg={'error'}></SVGs></span>}
        </div>
      </div>
      <div className="clientDashboard-view-slab_form">
        <div className="clientDashboard-view-form-left">
        <div className="clientDashboard-view-slab_form-left-box">
          <div className="clientDashboard-view-form-left-box-heading">
            <span>Set Address</span>
            <span onClick={() => (setModal('add_address'), setShow('address'))}><SVGs svg={'edit'}></SVGs></span>
          </div>
          <div className="clientDashboard-view-form-left-box-container-2">
              <div className="clientDashboard-view-form-left-box-container-2-item">
                <div className="clientDashboard-view-form-left-box-container-2-item-heading">Contact Name: </div>
                <div className="clientDashboard-view-form-left-box-container-2-item-content">
                  {quote.contact_name ? quote.contact_name : 
                    <>
                    <div className="clientDashboard-view-form-left-box-container-2-item-content-textarea">
                      <textarea rows="2" name="name" placeholder="(Select By Name)" onClick={() => setInputDropdown('quote_address')} value={quote.contact_name} readOnly></textarea>
                      <SVGs svg={'dropdown-arrow'}></SVGs>
                    </div>
                    {input_dropdown == 'quote_address' && 
                    <div className="clientDashboard-view-form-left-box-container-2-item-content-list" ref={myRefs}>
                      {allAddresses && allAddresses.map((item, idx) => 
                        <div key={idx} className="clientDashboard-view-form-left-box-container-2-item-content-list-item">
                        {item.contact_name}
                       </div>
                      )   
                      }
                    </div>
                    }
                    </>
                  }
                </div>
              </div>
              <div className="clientDashboard-view-form-left-box-container-2-item">
                <div className="clientDashboard-view-form-left-box-container-2-item-heading">Address: </div>
                <div className="clientDashboard-view-form-left-box-container-2-item-content">
                  {quote.address_one ? quote.address_one : ''}
                </div>
              </div>
              <div className="clientDashboard-view-form-left-box-container-2-item">
                <div className="clientDashboard-view-form-left-box-container-2-item-heading">City: </div>
                <div className="clientDashboard-view-form-left-box-container-2-item-content">
                  {quote.city ? quote.city : ''}
                </div>
              </div>
              <div className="clientDashboard-view-form-left-box-container-2-item">
                <div className="clientDashboard-view-form-left-box-container-2-item-heading">State: </div>
                <div className="clientDashboard-view-form-left-box-container-2-item-content">
                  {quote.state ? quote.state : ''}
                </div>
              </div>
              <div className="clientDashboard-view-form-left-box-container-2-item">
                <div className="clientDashboard-view-form-left-box-container-2-item-heading">Zip Code: </div>
                <div className="clientDashboard-view-form-left-box-container-2-item-content">
                  {quote.zip_code ? quote.zip_code : ''}
                </div>
              </div>
              <div className="clientDashboard-view-form-left-box-container-2-item">
                <div className="clientDashboard-view-form-left-box-container-2-item-heading">Country: </div>
                <div className="clientDashboard-view-form-left-box-container-2-item-content">
                  {quote.country ? quote.country : ''}
                </div>
              </div>
              <div className="clientDashboard-view-form-left-box-container-2-item">
                <div className="clientDashboard-view-form-left-box-container-2-item-heading">Phone: </div>
                <div className="clientDashboard-view-form-left-box-container-2-item-content">
                  {quote.phone ? quote.phone : ''}
                </div>
              </div>
              <div className="clientDashboard-view-form-left-box-container-2-item">
                <div className="clientDashboard-view-form-left-box-container-2-item-heading">Cell: </div>
                <div className="clientDashboard-view-form-left-box-container-2-item-content">
                  {quote.cell ? quote.cell : ''}
                </div>
              </div>
              <div className="clientDashboard-view-form-left-box-container-2-item">
                <div className="clientDashboard-view-form-left-box-container-2-item-heading">Fax: </div>
                <div className="clientDashboard-view-form-left-box-container-2-item-content">
                  {quote.fax ? quote.fax : ''}
                </div>
              </div>
              <div className="clientDashboard-view-form-left-box-container-2-item">
                <div className="clientDashboard-view-form-left-box-container-2-item-heading">Email: </div>
                <div className="clientDashboard-view-form-left-box-container-2-item-content">
                  {quote.email ? quote.email : ''}
                </div>
              </div>
              <div className="clientDashboard-view-form-left-box-container-2-item">
                <div className="clientDashboard-view-form-left-box-container-2-item-heading">Notes: </div>
                <div className="clientDashboard-view-form-left-box-container-2-item-content">
                  {quote.address_notes ? quote.address_notes : ''}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="clientDashboard-view-form-right">
        <div className="clientDashboard-view-slab_form-left-box">
          <div className="clientDashboard-view-form-left-box-heading">
            <span>Quote Detail</span>
            <span onClick={() => setModal('quote_detail')}><SVGs svg={'edit'}></SVGs></span>
          </div>
          <div className="clientDashboard-view-form-left-box-container-2">
          <div className="clientDashboard-view-form-left-box-container-2-item">
                <div className="clientDashboard-view-form-left-box-container-2-item-heading">Quote Name: </div>
                <div className="clientDashboard-view-form-left-box-container-2-item-content">
                  {quote.quote_name? quote.quote_name : ''}
                </div>
              </div>
              <div className="clientDashboard-view-form-left-box-container-2-item">
                <div className="clientDashboard-view-form-left-box-container-2-item-heading">Price List: </div>
                <div className="clientDashboard-view-form-left-box-container-2-item-content">
                  {quote.price_list ? quote.price_list : ''}
                </div>
              </div>
              <div className="clientDashboard-view-form-left-box-container-2-item">
                <div className="clientDashboard-view-form-left-box-container-2-item-heading">Salesperson: </div>
                <div className="clientDashboard-view-form-left-box-container-2-item-content">
                  {quote.salesperson ? quote.salesperson : ''}
                </div>
              </div>
              <div className="clientDashboard-view-form-left-box-container-2-item">
                <div className="clientDashboard-view-form-left-box-container-2-item-heading">Lead: </div>
                <div className="clientDashboard-view-form-left-box-container-2-item-content">
                  {quote.lead ? quote.lead : ''}
                </div>
              </div>
              <div className="clientDashboard-view-form-left-box-container-2-item">
                <div className="clientDashboard-view-form-left-box-container-2-item-heading">Quote #: </div>
                <div className="clientDashboard-view-form-left-box-container-2-item-content">
                  {quote.quote_number ? quote.quote_number : ''}
                </div>
              </div>
              <div className="clientDashboard-view-form-left-box-container-2-item">
                <div className="clientDashboard-view-form-left-box-container-2-item-heading">PO #: </div>
                <div className="clientDashboard-view-form-left-box-container-2-item-content">
                  {quote.po_number ? quote.po_number : ''}
                </div>
              </div>
              <div className="clientDashboard-view-form-left-box-container-2-item">
                <div className="clientDashboard-view-form-left-box-container-2-item-heading">Notes: </div>
                <div className="clientDashboard-view-form-left-box-container-2-item-content">
                  {quote.quote_notes ? quote.quote_notes : ''}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="clientDashboard-view-slab_form-quoteLine">
          <div className="clientDashboard-view-slab_form-quoteLine-left">
            <div className="clientDashboard-view-slab_form-quoteLine-left-box">
              <div className="clientDashboard-view-slab_form-quoteLine-left-box-heading">
                <span>Revision</span>
                <span onClick={() => setModal('revision')}><SVGs svg={'edit'}></SVGs></span>
              </div>
              <div className="clientDashboard-view-slab_form-quoteLine-left-box-item">
                <div className="clientDashboard-view-slab_form-quoteLine-left-box-item-heading">Quote Date: </div>
                <div className="clientDashboard-view-slab_form-quoteLine-left-box-item-content">
                  {quote.quote_date ? quote.quote_date : ''}
                </div>
              </div>
              <div className="clientDashboard-view-slab_form-quoteLine-left-box-item">
                <div className="clientDashboard-view-slab_form-quoteLine-left-box-item-heading">Discount: </div>
                <div className="clientDashboard-view-slab_form-quoteLine-left-box-item-content">
                  {quote.quote_discount ? `${quote.quote_discount}%` : ''}
                </div>
              </div>
              <div className="clientDashboard-view-slab_form-quoteLine-left-box-item">
                <div className="clientDashboard-view-slab_form-quoteLine-left-box-item-heading">Tax Rate: </div>
                <div className="clientDashboard-view-slab_form-quoteLine-left-box-item-content">
                  {quote.quote_tax ? `${quote.quote_tax}%` : ''}
                </div>
              </div>
              <div className="clientDashboard-view-slab_form-quoteLine-left-box-item">
                <div className="clientDashboard-view-slab_form-quoteLine-left-box-item-heading">Deposit: </div>
                <div className="clientDashboard-view-slab_form-quoteLine-left-box-item-content">
                  {quote.quote_deposit ? quote.quote_deposit : ''}
                </div>
              </div>
            </div>
          </div>
          <div className="clientDashboard-view-slab_form-quoteLine-right">
            <div className="clientDashboard-view-slab_form-quoteLine-left-box">
              <div className="clientDashboard-view-slab_form-quoteLine-right-box-heading">
                <div>Quote Estimate</div>
                <span onClick={() => setModal('revision')}>Add <SVGs svg={'dropdown-arrow'}></SVGs></span>
              </div>
            </div>
          </div>
        </div>
      </div>
      { modal == 'add_address' &&
        <div className="addFieldItems-modal">
        <div className="addFieldItems-modal-box">
          <div className="addFieldItems-modal-box-header">
            <span className="addFieldItems-modal-form-title">{edit ? 'Edit Color' : 'Address'}</span>
            <div onClick={() => (setModal(''), setError(''), setEdit(''))}><SVGs svg={'close'}></SVGs></div>
          </div>
          <form className="addFieldItems-modal-form" onSubmit={(e) => (e.preventDefault(), setModal(''))}>
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
            {!edit && <button type="submit" className="form-button w100">{!loading && <span>Done</span>} {loading && <div className="loading"><span></span><span></span><span></span></div>}</button>}
            {edit == 'color' && <button onClick={(e) => updateColor(e)} className="form-button w100">{!loading && <span>Update Color</span>} {loading && <div className="loading"><span></span><span></span><span></span></div>}</button>}
            {error && <span className="form-error"><SVGs svg={'error'}></SVGs>{error}</span>}
          </form>
        </div>
      </div>
      }
      { modal == 'quote_detail' &&
        <div className="addFieldItems-modal">
        <div className="addFieldItems-modal-box">
          <div className="addFieldItems-modal-box-header">
            <span className="addFieldItems-modal-form-title">{edit ? 'Edit Color' : 'Quote Detail'}</span>
            <div onClick={() => (setModal(''), setError(''), setEdit(''))}><SVGs svg={'close'}></SVGs></div>
          </div>
          <form className="addFieldItems-modal-form" onSubmit={(e) => (e.preventDefault(), setModal(''))}>
            <div className="form-group-single-textarea">
              <div className="form-group-single-textarea-field">
                <label htmlFor="quote_name">Quote Name</label>
                <textarea id="quote_name" rows="1" name="quote_name" placeholder="(Quote Name)" value={quote.quote_name} onChange={(e) => createQuote('quote_name', e.target.value)} onFocus={(e) => e.target.placeholder = ''} onBlur={(e) => e.target.placeholder = '(Quote Name)'} wrap="off" onKeyDown={(e) => e.keyCode == 13 ? e.preventDefault() : null} autoFocus={true} required></textarea>
              </div>
            </div>
            <div className="form-group-single-dropdown">
                <label htmlFor="">Price List</label>
                <div className="form-group-single-dropdown-textarea">
                  <textarea id="price_list" rows="2" name="price_list" placeholder="(Select Price List)" onClick={() => setInputDropdown('price_list')} value={quote.price_list} readOnly></textarea>
                  <SVGs svg={'dropdown-arrow'}></SVGs>
                </div>
                {input_dropdown == 'price_list' && 
                <div className="form-group-single-dropdown-list" ref={myRefs}>
                  {allPriceLists && allPriceLists.map((item, idx) => 
                    <div key={idx} className="clientDashboard-view-form-left-box-container-2-item-content-list-item" onClick={() => (createQuote('price_list', `${item.name} (${item.tax}%)`), createQuote('price_list_id', item._id), createQuote('quote_tax', item.tax), setInputDropdown(''))}>
                    {item.name} ({item.tax}%)
                    </div>
                  )   
                  }
                </div>
                }
            </div>
            <div className="form-group-single-textarea">
              <div className="form-group-single-textarea-field">
                <label htmlFor="salesperson">Salesperson</label>
                <textarea id="salesperson" rows="1" name="salesperson" placeholder="(Salesperson)" value={quote.salesperson} onChange={(e) => createQuote('salesperson', e.target.value)} onFocus={(e) => e.target.placeholder = ''} onBlur={(e) => e.target.placeholder = '(Salesperson)'} wrap="off" onKeyDown={(e) => e.keyCode == 13 ? e.preventDefault() : null}></textarea>
              </div>
            </div>
            <div className="form-group-single-textarea">
              <div className="form-group-single-textarea-field">
                <label htmlFor="lead">Lead</label>
                <textarea id="lead" rows="1" name="lead" placeholder="(Lead)" value={quote.lead} onChange={(e) => createQuote('lead', e.target.value)} onFocus={(e) => e.target.placeholder = ''} onBlur={(e) => e.target.placeholder = '(Lead)'} wrap="off" onKeyDown={(e) => e.keyCode == 13 ? e.preventDefault() : null}></textarea>
              </div>
            </div>
            <div className="form-group-single-textarea">
              <div className="form-group-single-textarea-field">
                <label htmlFor="quote_number">Quote #</label>
                <textarea id="quote_number" rows="1" name="quote_number" placeholder="(Quote Number)" value={quote.quote_number} onChange={(e) => (validateIsNumber('quote_number'), createQuote('quote_number', e.target.value))} onFocus={(e) => e.target.placeholder = ''} onBlur={(e) => e.target.placeholder = '(Quote Number)'} wrap="off" onKeyDown={(e) => e.keyCode == 13 ? e.preventDefault() : null}></textarea>
              </div>
            </div>
            <div className="form-group-single-textarea">
              <div className="form-group-single-textarea-field">
                <label htmlFor="po_number">PO #</label>
                <textarea id="po_number" rows="1" name="po_number" placeholder="(PO #)" value={quote.po_number} onChange={(e) => (validateIsNumber('po_number'), createQuote('po_number', e.target.value))} onFocus={(e) => e.target.placeholder = ''} onBlur={(e) => e.target.placeholder = '(PO #)'} wrap="off" onKeyDown={(e) => e.keyCode == 13 ? e.preventDefault() : null}></textarea>
              </div>
            </div>
            <div className="form-group-single-textarea">
              <div className="form-group-single-textarea-field">
                <label htmlFor="quote_notes">Notes</label>
                <textarea id="quote_notes" rows="4" name="quote_notes" placeholder="(Notes)" value={quote.quote_notes} onChange={(e) => (createQuote('quote_notes', e.target.value))} onFocus={(e) => e.target.placeholder = ''} onBlur={(e) => e.target.placeholder = '(Notes)'} ></textarea>
              </div>
            </div>
            {!edit && <button type="submit" className="form-button w100">{!loading && <span>Done</span>} {loading && <div className="loading"><span></span><span></span><span></span></div>}</button>}
            {edit == 'color' && <button onClick={(e) => updateColor(e)} className="form-button w100">{!loading && <span>Update Color</span>} {loading && <div className="loading"><span></span><span></span><span></span></div>}</button>}
            {error && <span className="form-error"><SVGs svg={'error'}></SVGs>{error}</span>}
          </form>
        </div>
      </div>
      }
      { modal == 'revision' &&
      <div className="addFieldItems-modal">
        <div className="addFieldItems-modal-box">
          <div className="addFieldItems-modal-box-header">
            <span className="addFieldItems-modal-form-title">{edit ? 'Edit Color' : 'Revision'}</span>
            <div onClick={() => (setModal(''), setError(''), setEdit(''))}><SVGs svg={'close'}></SVGs></div>
          </div>
          <form className="addFieldItems-modal-form" onSubmit={(e) => (e.preventDefault(), setModal(''))}>
            <div className="form-group-single-textarea">
              <div className="form-group-single-textarea-dropdown">
                <label htmlFor="quote_date">Date</label>
                <div className="form-group-single-textarea-dropdown-input">
                  <textarea id="quote_date" rows="1" name="quote_date" placeholder="(Quote Date)" value={quote.quote_date} onClick={() => input_dropdown == 'calendar' ? setInputDropdown('') : setInputDropdown('calendar')}onFocus={(e) => e.target.placeholder = ''} onBlur={(e) => e.target.placeholder = '(Quote Date)'} wrap="off" onKeyDown={(e) => e.keyCode == 13 ? e.preventDefault() : null} readOnly required></textarea>
                  <span onClick={() => input_dropdown == 'calendar' ? setInputDropdown('') : setInputDropdown('calendar')}><SVGs svg={'calendar'}></SVGs></span>
                  {input_dropdown == 'calendar' && <span className="form-group-single-textarea-dropdown-input-popup">
                    <Calendar
                      onClickDay={(date) => handleDate(date)}
                      value={calendar}
                      minDate={new Date(Date.now())}
                    />
                  </span>
                  }
                </div>
              </div>
            </div>
            <div className="form-group-single-textarea">
              <div className="form-group-single-textarea-field">
                <label htmlFor="quote_discount">Discount %</label>
                <textarea id="quote_discount" rows="1" name="quote_discount" placeholder="(Quote Discount)" value={quote.quote_discount} onChange={(e) => (validateIsNumber('quote_discount'), createQuote('quote_discount', e.target.value))} onFocus={(e) => e.target.placeholder = ''} onBlur={(e) => e.target.placeholder = '(Quote Discount)'} wrap="off" onKeyDown={(e) => e.keyCode == 13 ? e.preventDefault() : null} required></textarea>
              </div>
            </div>
            <div className="form-group-single-textarea">
              <div className="form-group-single-textarea-field">
                <label htmlFor="quote_tax">Tax %</label>
                <textarea id="quote_tax" rows="1" name="quote_tax" placeholder="(Quote Tax)" value={quote.quote_tax} onChange={(e) => (validateIsNumber('quote_tax'), createQuote('quote_tax', e.target.value))} onFocus={(e) => e.target.placeholder = ''} onBlur={(e) => e.target.placeholder = '(Quote Tax)'} wrap="off" onKeyDown={(e) => e.keyCode == 13 ? e.preventDefault() : null} required></textarea>
              </div>
            </div>
            <div className="form-group-single-textarea">
              <div className="form-group-single-textarea-dropdown">
                <label htmlFor="quote_deposit">Deposit</label>
                <div className="form-group-single-textarea-dropdown-input">
                  <textarea id="quote_deposit" rows="1" name="quote_deposit" placeholder="(Quote Deposit)" value={quote.quote_deposit} onChange={(e) => (validateIsNumber('quote_deposit'), createQuote('quote_deposit', show == 'address' ? `$${e.target.value}` : `${e.target.value}%`))} onFocus={(e) => e.target.placeholder = ''} onBlur={(e) => e.target.placeholder = '(Quote Deposit)'} wrap="off" onKeyDown={(e) => e.keyCode == 13 ? e.preventDefault() : null} required></textarea>
                  {show == 'address' ? <span onClick={() => (createQuote('quote_deposit', ''), setShow('percentage'))}><SVGs svg={'percentage'}></SVGs></span> : <span onClick={() => (createQuote('quote_deposit', ''),setShow('address'))}><SVGs svg={'dollar'}></SVGs></span>}
                </div>
              </div>
            </div>
            {!edit && <button type="submit" className="form-button w100">{!loading && <span>Done</span>} {loading && <div className="loading"><span></span><span></span><span></span></div>}</button>}
            {edit == 'color' && <button onClick={(e) => updateColor(e)} className="form-button w100">{!loading && <span>Update Color</span>} {loading && <div className="loading"><span></span><span></span><span></span></div>}</button>}
            {error && <span className="form-error"><SVGs svg={'error'}></SVGs>{error}</span>}
          </form>
        </div>
      </div>
      }
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
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Quote)
