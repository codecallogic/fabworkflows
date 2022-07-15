import axios from 'axios'
import PlacesAutocomplete from 'react-places-autocomplete'
import SVG from '../../files/svgs'
import CheckoutForm from '../../components/payments/checkoutForm'
import { API, STRIPE_TEST } from '../../config'
import { useState, useEffect, useRef } from 'react'
import { connect } from 'react-redux'
import { useStripe, useElements, CardElement, Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';

//// VALIDATIONS
import { addressSelect, validateNumber, validatePrice } from '../../helpers/validations'
import { manageFormFields } from '../../helpers/forms'
import { manageEstimates } from '../../helpers/estimates'

const stripePromise = loadStripe(STRIPE_TEST)

const searchOptionsAddress = {
  componentRestrictions: {country: 'us'},
  types: ['address']
}

const Checkout = ({
  quote, 
  createMethod, 
  resetMethod, 
  order
}) => {
  // console.log(quote)
  const createType        = 'CREATE_ORDER'
  const resetType         = 'RESET_ORDER'
  
  const myRefs = useRef(null)
  const [show, setShow] = useState('address')
  const [modal, setModal] = useState('')
  const [newDeposit, setNewDeposit] = useState('')
  const [input_dropdown, setInputDropdown] = useState('')
  const [otherDeposit, setOtherDeposit] = useState(false)

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
  
  return (
    <>
    {quote ?
    <div className="checkout">
      <div className="checkout-title">
        <img className="checkout-title-image" src="/media/logo_4.png" alt="" />
        <span>Checkout</span>
      </div>
      <div className="checkout-box">
        <div className="checkout-box-billing">
          <div className="checkout-box-billing-title">Billing Information</div>
          <form className="checkout-box-billing-form">
            <div className="form-group inputFieldWhite">
              <input 
              id="name" 
              value={order.name} 
              onChange={(e) => (createMethod(createType, 'name', e.target.value))}
              />
              
              <label 
              className={`input-label ` + (
                order.name.length > 0 || 
                typeof order.name == 'object' 
                ? ' labelHover' 
                : ''
              )}
              htmlFor="name">
                Cardholder Name
              </label>
            </div>
            <PlacesAutocomplete 
            value={order.address} 
            onChange={(e) => createMethod(createType, 'address', e)} 

            /////  KEYS RESPECTIVELY: ADDRESS, CITY, STATE, ZIP, COUNTRY
            onSelect={(e) => (
              setInputDropdown(''), 
              addressSelect(e, 'address', createType, createMethod, 'addressGeoId', 'city', 'state', 'zip_code', 'country'))
            } 
            searchOptions={searchOptionsAddress}
            >
            { ({getInputProps, suggestions, getSuggestionItemProps, loading}) => (
            <div className="form-group inputFieldWhite">
              <input 
              onClick={() => setInputDropdown('billing_address')} 
              {...getInputProps()}/>
              <label 
                className={`input-label ` + (
                order.address.length > 0 || 
                typeof order.address == 'object' 
                ? ' labelHover' 
                : ''
              )}
              htmlFor="address">
                Address
              </label>
              <div onClick={() => setInputDropdown('') }>
                <SVG svg={'arrow-left'}></SVG>
              </div>
              { input_dropdown == 'billing_address' &&
                <div 
                className="form-group-list" 
                ref={myRefs}
                >
                  {loading ? <div>...loading</div> : null}
                  {suggestions.map( (item, idx) => (
                    <div 
                    key={idx} 
                    className="form-group-list-item" 
                    {...getSuggestionItemProps(item)}
                    >
                      {item.description}
                      <input 
                      id="addressGeoId" 
                      value={item.placeId} 
                      style={{display: 'none'}}
                      readOnly
                      />
                    </div>
                  ))}
                </div>
              }
            </div>
            )}
            </PlacesAutocomplete>
            <div className="form-group inputFieldWhite">
              <input 
              id="city" 
              value={order.city} 
              onChange={(e) => (createMethod(createType, 'city', e.target.value))}/>
              
              <label 
              className={`input-label ` + (
                order.city.length > 0 || 
                typeof order.city == 'object' 
                ? ' labelHover' 
                : ''
              )}
              htmlFor="city">
                City
              </label>
            </div>
            <div className="form-group inputFieldWhite">
              <input 
              id="state" 
              value={order.state} 
              onChange={(e) => (createMethod(createType, 'state', e.target.value))}/>
              
              <label 
              className={`input-label ` + (
                order.state.length > 0 || 
                typeof order.state == 'object' 
                ? ' labelHover' 
                : ''
              )}
              htmlFor="state">
                State
              </label>
            </div>
            <div className="form-group inputFieldWhite">
              <input 
              id="zip_code" 
              value={order.zip_code} 
              onChange={(e) => (validateNumber('zip_code'), createMethod(createType, 'zip_code', e.target.value))}/>
              
              <label 
              className={`input-label ` + (
                order.zip_code.length > 0 || 
                typeof order.zip_code == 'object' 
                ? ' labelHover' 
                : ''
              )}
              htmlFor="zip_code">
                Zip Code
              </label>
            </div>
            <div className="checkout-box-newDeposit">
                { !otherDeposit && 
                <>
                  <span 
                  className="checkout-box-newDeposit-option"
                  onClick={() => setNewDeposit(50)}
                  >
                    50% Deposit
                  </span>
                  <span 
                  className="checkout-box-newDeposit-option"
                  onClick={() => setOtherDeposit(true)}
                  >
                    Other
                  </span>
                  <span 
                    className="checkout-box-newDeposit-option"
                    onClick={() => setNewDeposit('')}
                  >
                    0%
                  </span>
                </>
                }
                { otherDeposit && 
                  <div className="form-group inputFieldWhite">
                    <input 
                    id="newDeposit" 
                    value={newDeposit} 
                    onFocus={ (e) => 
                      e.target.placeholder = 'Min 1% Max 100%'
                    }
                    onBlur={ (e) => 
                      e.target.placeholder = ''
                    }
                    onChange={(e) => (
                      validateNumber('newDeposit'),
                      setNewDeposit(
                        e.target.value < 1 
                        ? 
                          '' 
                        : 
                          e.target.value > 100 ? '' 
                        : 
                          e.target.value
                        )
                    )}/>
                    <label 
                    className={`input-label ` + (
                      newDeposit !== '' || 
                      typeof newDeposit == 'object' 
                      ? ' labelHover' 
                      : ''
                    )}
                    htmlFor="newDeposit">
                      Deposit %
                    </label>
                    <div onClick={() => (
                      setNewDeposit(''), 
                      setOtherDeposit(false))
                    }>
                      <SVG svg={'arrow-left'}></SVG>
                    </div>
                  </div>
                }
            </div>
            <Elements stripe={stripePromise}>
              <CheckoutForm 
                type={'payment'}
                billing={order}
                quote={quote}
                deposit={newDeposit}
              >
              </CheckoutForm>
            </Elements>
          </form>
        </div>





        <div className="checkout-box-summary">
          <div className="checkout-box-summary-title">
            Quote {quote.quote_name} for {quote.contact_name} created on {quote.quote_date}
          </div>
          <div className="checkout-box-summary-quote">
            { quote.quote_lines.length > 0 && quote.quote_lines.map((item, idx) => 
              <div className="form-estimate">
                  <div 
                  className="form-estimate-line"
                  >
                  <SVG svg={'checkmark-2'}></SVG>
                  <div>{item.quantity ? item.quantity : '0'}</div>
                  <div className="form-estimate-line-description">
                    {item.material
                      ? 
                      `${manageFormFields(item.material, 'name')} 
                      ${
                        item.model
                        ? ` / ${manageFormFields(item.model, 'name')}`
                        : ''
                      }`
                      : item.category
                      ? 
                      `${manageFormFields(item.category, 'name')} ${ item.description ? `/ ${item.description.substring(0, 30)}...` : ''}` 
                      : item.model
                      ? 
                      `Sink: ${manageFormFields(item.model, 'name')}
                      ${
                        item.color
                          ? ` / ${manageFormFields(item.color, 'name')}`
                          : ''
                      }`
                      : 
                      item.edgeType
                      ?
                      item.edgeType
                      :
                      item.cutoutType
                      ?
                      item.cutoutType
                      :
                      item.description
                    }
                  </div>
                  <div>
                  {item.price && item.quantity
                    ? 
                    manageEstimates('lineTotal', item.quantity, item.price) 
                    : 
                    `(No subtotal)`
                  }
                  </div>
                </div>
                <div className="form-estimate-line-label">
                  <span>
                  {item.typeForm !== 'miscellaneous' && item.category === ''
                    ? `[Category: ${item.typeForm}]`
                    : null
                  }
                  </span>
                  <span>
                  {item.category
                    ? `[Category: ${manageFormFields(item.category, 'name')}]`
                    : null
                  }
                  </span>
                  {!item.price ? `[no price]` : null}
                  {item.price && !item.edgeType ? `[${item.price} / each]` : null}
                  {item.price && item.edgeType ? `[${item.price} / linear ft]` : null}
                </div>
              </div>
            )
            }
            
            { quote.quote_lines.length > 0 &&
            <div className="form-estimate-line-total">
              <label>Subtotal</label>
              <span id="subtotal">${
                quote.quote_subtotal
              }</span>
            </div>
            }


            { quote.quote_lines.length > 0 &&
              <div className="form-estimate-line-total">
                <label>Taxable Discount</label>
                <span id="taxableDiscount">${
                  quote.quote_taxable_discount
                }</span>
              </div>
            }

            { quote.quote_lines.length > 0 &&
              <div className="form-estimate-line-total">
                <label>Taxable Total</label>
                <span id="taxableTotal">${
                  quote.quote_taxable_total
                }</span>
              </div>
            }

            { quote.quote_lines.length > 0 &&
              <div className="form-estimate-line-total">
                <label>Non-Taxable Subtotal</label>
                <span id="nonTaxableSubtotal">${
                  quote.quote_nontaxable_subtotal
                }</span>
              </div>
            }

            { quote.quote_lines.length > 0 &&
              <div className="form-estimate-line-total">
                <label>Non-Taxable Discount</label>
                <span id="nonTaxableSubtotal">${
                  quote.quote_nontaxable_discount
                }</span>
              </div>
            }

            { quote.quote_lines.length > 0 &&
              <div className="form-estimate-line-total">
                <label>Total</label>
                <span id="total">${
                  quote.quote_total
                }</span>
              </div>
            }

            { quote.quote_lines.length > 0 &&
              <div className="form-estimate-line-total">
                <label>Deposit</label>
                <span id="deposit">${
                  newDeposit 
                  ? 
                    ((quote.quote_balance * (newDeposit / 100)) + +quote.quote_deposit_total.replace('$', '')).toFixed(2)
                  : 
                    quote.quote_deposit_total
                }</span>
              </div>
            }

            { quote.quote_lines.length > 0 &&
              <div className="form-estimate-line-total">
                <label>Balance Due</label>
                <span id="balance">${
                  ( 
                    quote.quote_balance 
                    - 
                    (quote.quote_balance * (newDeposit / 100))
                  ).toFixed(2)
                }</span>
              </div>
            }

            

          </div>

          { quote.quote_lines.length > 0 && newDeposit &&
            <>
              <div 
                className="depositMessage" 
                style={{ color: '#fd7e3c'}}
              >
                Deposits are calculated from current balance due.
              </div>
              <div 
                className="form-estimate-line-total depositMessage" 
                style={{ color: '#fd7e3c'}}
              >
                Any new deposit will added to previous deposits made.
              </div>
            </>
          }

          { quote.quote_lines.length > 0 && quote.payment == 'complete' &&
            <div 
              className="depositMessage" 
              style={{ color: '#fd7e3c'}}
            >
              Your balance is paid off
            </div>
          }

        </div>




      </div>
    </div>
    : 
    <div className="home">
      <a className="logout" onClick={() => window.location.href = '/'}>This order no longer exists please request a new one. Click here!</a>
    </div>
    }
    { modal == 'payment_made' &&
    <div className="addFieldItems-modal">
      <div className="addFieldItems-modal-box">
        <div className="addFieldItems-modal-box-header">
          <span className="addFieldItems-modal-form-title">Payment</span>
          <div onClick={() => window.location.href = '/'}><SVG svg={'close'}></SVG></div>
        </div>
        <div className="addFieldItems-modal-message">
          Payment was made, we will contact you soon
        </div>
      </div>
    </div>
    }
    </>
  )
}

const mapStateToProps = (state) => {
  return {
    order: state.order
  }
}

const mapDispatchToProps = dispatch => {
  return {
    createMethod: (caseType, name, data) => dispatch({type: caseType, name: name, value: data}),
    resetMethod: (caseType) => dispatch({type: caseType}),
  }
}

Checkout.getInitialProps = async ({query}) => {

  let quote

  try {
    const responseQuote = await axios.post(`${API}/quotes/get-quote`, {id: query.id})
    quote = responseQuote.data
  } catch (error) {
    if(error) console.log(error)
  }

  return {
    quote: quote ? quote : null
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Checkout)
