import axios from 'axios'
import {API} from '../../config'
import {useState, useEffect, useRef} from 'react'
import {connect} from 'react-redux'
import PlacesAutocomplete from 'react-places-autocomplete'
import {geocodeByPlaceId} from 'react-places-autocomplete'
import SVGs from '../../files/svgs'

const searchOptionsAddress = {
  componentRestrictions: {country: 'us'},
  types: ['address']
}

const searchOptionsCities = {
  componentRestrictions: {country: 'us'},
  types: ['(cities)']
}

const Checkout = ({quote, order, createOrder}) => {
  console.log(quote)
  const [show, setShow] = useState('address')
  const [loading, setLoading] = useState('')

  const handleSelect = async (e, type, id) => {
    let geo
    
    if(id){
     geo = await geocodeByPlaceId(id)
    }

    if(geo){
      geo[0].address_components.forEach((item) => {
        // console.log(item)
        if(item.types.includes('postal_code')){
          createOrder('zip_code', item.long_name)
        }
        if(item.types.includes('country')){
          createOrder('country', item.long_name)
        }
      })
    }

    if(type == 'address'){
      createOrder('address', e.split(',')[0])
    }
    
    createOrder('city', e.split(',')[1])
    createOrder('state', e.split(',')[2])
  }

  const validateIsPriceNumber = (amount) => {
    let newValue = amount
    let formatter = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }) 
    return formatter.format(newValue)
  }
  
  return (
    <div className="checkout">
      <div className="checkout-title">
        <img className="checkout-title-image" src="/media/logo_4.png" alt="" />
        <span>Checkout</span>
      </div>
      <div className="checkout-box">
        <div className="checkout-box-billing">
          <div className="checkout-box-billing-title">Billing Information</div>
          <form className="checkout-box-billing-form">
            <div className="form-group-single-textarea">
              <div className="form-group-single-textarea-field">
                <label htmlFor="name">Cardholder Name</label>
                <textarea id="name" rows="1" name="name" placeholder="Cardholder Name" value={order.name} onChange={(e) => createOrder('name', e.target.value)} onFocus={(e) => e.target.placeholder = ''} onBlur={(e) => e.target.placeholder = 'Cardholder Name'} wrap="off" onKeyDown={(e) => e.keyCode == 13 ? e.preventDefault() : null} autoFocus={true} required></textarea>
              </div>
            </div>
            <PlacesAutocomplete value={order.address} onChange={(e) => createOrder('address', e)} onSelect={(e) => handleSelect(e, 'address', document.getElementById('address_place_id').value)} searchOptions={searchOptionsAddress}>
              {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
                <div className="form-group-single-textarea-autocomplete">
                  <label htmlFor="address">Address</label>
                  <div className="form-group-single-textarea-autocomplete-textarea"><textarea {...getInputProps({rows: 2, placeholder: 'Address'})} required/>
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
                <label htmlFor="city">City</label>
                <textarea id="city" rows="1" name="city" placeholder="City" value={order.city} onChange={(e) => createOrder('city', e.target.value)} onFocus={(e) => e.target.placeholder = ''} onBlur={(e) => e.target.placeholder = 'City'} wrap="off" onKeyDown={(e) => e.keyCode == 13 ? e.preventDefault() : null} required></textarea>
              </div>
            </div>
            <div className="form-group-single-textarea">
              <div className="form-group-single-textarea-field">
                <label htmlFor="state">State</label>
                <textarea id="state" rows="1" name="state" placeholder="State" value={order.state} onChange={(e) => createOrder('state', e.target.value)} onFocus={(e) => e.target.placeholder = ''} onBlur={(e) => e.target.placeholder = 'State'} wrap="off" onKeyDown={(e) => e.keyCode == 13 ? e.preventDefault() : null} required></textarea>
              </div>
            </div>
            <div className="form-group-single-textarea">
              <div className="form-group-single-textarea-field">
                <label htmlFor="zip_code">Zip Code</label>
                <textarea id="zip_code" rows="1" name="zip_code" placeholder="Zip Code" value={order.zip_code} onChange={(e) => createOrder('zip_code', e.target.value)} onFocus={(e) => e.target.placeholder = ''} onBlur={(e) => e.target.placeholder = 'Zip Code'} wrap="off" onKeyDown={(e) => e.keyCode == 13 ? e.preventDefault() : null} required></textarea>
              </div>
            </div>
            <button type="submit" className="form-button w100">{loading !== 'address' && <span>Confirm Order</span>} {loading == 'address' && <div className="loading"><span></span><span></span><span></span></div>}</button>
          </form>
        </div>
        <div className="checkout-box-summary">
          <div className="checkout-box-summary-title">Quote {quote.quote_name} for {quote.contact_name} created on {quote.quote_date}</div>
          <div className="checkout-box-summary-quote">
            { quote.quote_lines.length > 0 && quote.quote_lines.map((item, idx) => 
            <div key={idx} id={`quote_line_${idx}`}className="clientDashboard-view-slab_form-quoteLine-right-box-line">
              <div className="clientDashboard-view-slab_form-quoteLine-right-box-line-container">
                <SVGs svg={'checkmark-2'}></SVGs>
                <div className="clientDashboard-view-slab_form-quoteLine-right-box-line-quantity">{item.quantity}</div>
                <pre className="clientDashboard-view-slab_form-quoteLine-right-box-line-description">{item.brand ? `${item.brand}/${item.model}` : item.description}</pre>
                <div className="clientDashboard-view-slab_form-quoteLine-right-box-line-total">{item.price_unformatted ? validateIsPriceNumber(item.quantity * item.price_unformatted) : `(No price)`}</div>
              </div>
              <div className="clientDashboard-view-slab_form-quoteLine-right-box-line-label">
                [Category: {item.category ? item.category : 'none'}][{item.price ? `${item.price}/each` : 'No Price'}]
              </div>
            </div>
            )
            }
            <div className="clientDashboard-view-slab_form-quoteLine-right-box-estimate">
              { quote.quote_lines.length > 0 &&
                <div className="clientDashboard-view-slab_form-quoteLine-right-box-estimate-subtotal">
                  <label>Subtotal</label>
                  <span id="subtotal">{validateIsPriceNumber(quote.quote_subtotal)}</span>
                </div>
              }
              { quote.quote_lines.length > 0 &&
              <div className="clientDashboard-view-slab_form-quoteLine-right-box-estimate-discount">
                <div className="clientDashboard-view-slab_form-quoteLine-right-box-estimate-subtotal">
                  <label>Discount</label>
                  <span id="discount">{quote.quote_subtotal ? (validateIsPriceNumber(quote.quote_subtotal * (quote.quote_discount / 100))) : 0}</span>
                </div>
              </div>
              }
              { quote.quote_lines.length > 0 &&
              <div className="clientDashboard-view-slab_form-quoteLine-right-box-estimate-tax">
                <div className="clientDashboard-view-slab_form-quoteLine-right-box-estimate-subtotal">
                  <label>Tax</label>
                  <span id="tax">{quote.quote_tax ? (validateIsPriceNumber((quote.quote_subtotal - (quote.quote_subtotal * (quote.quote_discount/100))) * (quote.quote_tax / 100))) : 0}</span>
                </div>
              </div>
              }
              { quote.quote_lines.length > 0 &&
              <div className="clientDashboard-view-slab_form-quoteLine-right-box-estimate-nontaxable-subtotal">
                <div className="clientDashboard-view-slab_form-quoteLine-right-box-estimate-subtotal">
                  <label>Non-Taxable Subtotal</label>
                  <span id="nontaxable_subtotal">{validateIsPriceNumber(quote.quote_nontaxable_subtotal)}</span>
                </div>
              </div>
              }
              { quote.quote_lines.length > 0 &&
              <div className="clientDashboard-view-slab_form-quoteLine-right-box-estimate-nontaxable-discount">
                <div className="clientDashboard-view-slab_form-quoteLine-right-box-estimate-subtotal">
                  <label>Non-Taxable Discount</label>
                  <span id="discount">{quote.quote_discount ? (validateIsPriceNumber(quote.quote_nontaxable_subtotal * (quote.quote_discount / 100))) : 0}</span>
                </div>
              </div>
              }
              { quote.quote_lines.length > 0 &&
              <div className="clientDashboard-view-slab_form-quoteLine-right-box-estimate-total">
                <div className="clientDashboard-view-slab_form-quoteLine-right-box-estimate-subtotal">
                  <label>Total</label>
                  <span id="total" data-target={quote.quote_total}>{quote.quote_count}</span>
                </div>
              </div>
              }
              { quote.quote_lines.length > 0 &&
              <div className="clientDashboard-view-slab_form-quoteLine-right-box-estimate-deposit">
                <div className="clientDashboard-view-slab_form-quoteLine-right-box-estimate-subtotal">
                  <label>Deposit</label>
                  <span id="deposit" >{quote.quote_deposit ? quote.quote_deposit.includes('$') ? quote.quote_deposit : validateIsPriceNumber((quote.quote_total * (quote.quote_deposit.replace('%', '')/100))): 0}</span>
                </div>
              </div>
              }
              { quote.quote_lines.length > 0 &&
              <div className="clientDashboard-view-slab_form-quoteLine-right-box-estimate-balance">
                <div className="clientDashboard-view-slab_form-quoteLine-right-box-estimate-subtotal">
                  <label>Balance Due</label>
                  <span id="balance" >{validateIsPriceNumber(quote.quote_balance)}</span>
                </div>
              </div>
              }
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

const mapStateToProps = (state) => {
  return {
    order: state.order
  }
}

const mapDispatchToProps = dispatch => {
  return {
    createOrder: (name, data) => dispatch({type: 'CREATE_ORDER', name: name, value: data})
  }
}

Checkout.getInitialProps = async ({query}) => {
  // console.log(query)
  let quote
  try {
    const responseQuote = await axios.post(`${API}/transaction/get-quote`, {id: query.id})
    quote = responseQuote.data
  } catch (error) {
    if(error) console.log(error)
  }

  return {
    quote: quote
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Checkout)
