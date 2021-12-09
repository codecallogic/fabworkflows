import {useState} from 'react'
import {useStripe, useElements, CardElement, Elements} from '@stripe/react-stripe-js';
import axios from 'axios'
import {API} from '../../config'
import SVGs from '../../files/svgs'

const CARD_ELEMENT_OPTIONS = {
  style: {
    base: {
      color: "#32325d",
      fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
      fontSmoothing: "antialiased",
      fontSize: "16px",
      "::placeholder": {
        color: "#aab7c4"
      },
      padding: '20px !important'
    },
    invalid: {
      color: "#fa755a",
      iconColor: "#fa755a",
    },
  },
};

const CheckoutForm = ({email, name, address, city, state, zip_code, country, balance, quote, setmodal, deposit}) => {
  const stripe = useStripe();
  const elements = useElements();
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState('')

  const handleCardPayment = async (e) => {
    e.preventDefault()
    if(!stripe || !elements){
      // Stripe.js has not loaded yet. Make sure to disable
      // form submission until Stripe.js has loaded.
      return
    }
    setLoading('payment')
    setMessage('')

    if(!name){setMessage('Cardholder field is empty'); setLoading(false); return}
    if(!address){setMessage('Address field is empty'); setLoading(false); return}
    if(!city){setMessage('City field is empty'); setLoading(false); return}
    if(!state){setMessage('State field is empty'); setLoading(false); return}
    if(!zip_code){setMessage('Zip code field is empty'); setLoading(false); return}
    if(!/^\d{5}(-\d{4})?$/.test(zip_code)){setLoading(''); setMessage('Zip code is invalid'); return }

    const cardElement = elements.getElement(CardElement)

    const {error, paymentMethod} = await stripe.createPaymentMethod({
      type: 'card',
      card: cardElement,
      billing_details: {name: name, email: email, address: {line1: address, city: city, postal_code: zip_code}}
    })

    if(error){
      console.log(error)
      if(error) error.code ? setMessage('Invalid information') : setMessage('We are having trouble validating your card information')
      setLoading('')
    }else {
      try {
        
        let orderNumber = Math.floor(100000000 + Math.random() * 900000000)
        // console.log(paymentMethod)
        const responsePayment = await axios.post(`${API}/transaction/process-payment`, {'payment_method': paymentMethod.id, 'email': email, 'cardholder': name, 'address': address, 'city': city, 'state': state, 'zip_code': zip_code, 'country': country, 'order': orderNumber, 'quote': quote, 'deposit': deposit})
        // console.log(responsePayment.data)
        
        const {client_secret, status, payment_id, order} = responsePayment.data
        // console.log(status)
        if(status === 'requires_payment_method'){
          try {
            const result = await stripe.confirmCardPayment(client_secret, {
              payment_method: {
                card: elements.getElement(CardElement),
                billing_details: {name: name, email: email, address: {line1: address, city: city, postal_code: zip_code}}
              },
              setup_future_usage: 'off_session'
            })
            if(result.error) setMessage(`${result.error.message}. For ${result.error.decline_code}`)
            // console.log(result)
            setLoading('')
            setmodal('payment_made')
          } catch (error) {
            console.log(error)
            setLoading('')
            if(error) setMessage('An error occurred while processing your card. Please try again LATER.')
          }
        }
      } catch (error) {
        // console.log(error.response)
        if(error) error.response ? setMessage(error.response.data) : setMessage('An error occurred submitting your information, please try again later')
        setLoading('')
      }
    }
  }
  
  return (
    <>
      <CardElement options={CARD_ELEMENT_OPTIONS}/>
      <button className="form-button w100" onClick={(e) => handleCardPayment(e)}>{loading !== 'payment' && <span>Confirm Order</span>} {loading == 'payment' && <div className="loading"><span></span><span></span><span></span></div>}</button>
      {message && <span className="form-messageIcon"><SVGs svg={'error'}></SVGs>{message}</span>}
    </>
  )
}

export default CheckoutForm
