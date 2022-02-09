import {API} from '../../config'
import {useState} from 'react'
import {useStripe, useElements, CardElement, Elements} from '@stripe/react-stripe-js';
import axios from 'axios'

//// HELPERS
import { formFields } from '../../helpers/forms';
import { validateZipCode } from '../../helpers/validations';

const CheckoutForm = ({ type, billing, quote, deposit }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState('')
  const [loadingColor, setLoadingColor] = useState('white')

  const handleCardPayment = async (e) => {
    e.preventDefault()
    if(!stripe || !elements){
      // Stripe.js has not loaded yet. Make sure to disable
      // form submission until Stripe.js has loaded.
      return
    }

    if(quote.payment == 'complete') return setMessage('Balance has been paid')
    
    setLoading('payment')
    setMessage('')

    for(let i = 0; i < formFields[type].length; i++){
    
      if(formFields[type][i].includes('zip') && validateZipCode(billing[formFields[type][i]])) return (setMessage('Invalid zip code'))
  
      if(!billing[formFields[type][i]] || billing[formFields[type][i]].length < 1) return (setMessage(`${formFields[type][i].replace('_', ' ')} is required`))
  
    }

    const cardElement = elements.getElement(CardElement)

    const {error, paymentMethod} = await stripe.createPaymentMethod({
      type: 'card',
      card: cardElement,
      billing_details: {
        name: billing.name, 
        email: quote.email, 
        address: {
          line1: billing.address, 
          city: billing.city, 
          postal_code: billing.zip_code
        }
      }
    })

    if(error){
      console.log(error)

      if(error) error.code 
      ? 
        setMessage('Invalid information') 
      : 
      (
        setMessage('We are having trouble validating your card information'),
        setLoading('')
      )

    }else {
      try {
        
        let orderNumber = Math.floor(100000000 + Math.random() * 900000000)
        
        const responsePayment = await axios.post(`${API}/quotes/process-payment`, {
          'payment_method': paymentMethod.id, 
          'billing': billing,
          'order': orderNumber, 
          'quote': quote, 
          'deposit': deposit
        })

        console.log(responsePayment.data)
        
        const {
          client_secret, 
          status, 
        } = responsePayment.data

        // console.log(status)
        if(status === 'requires_payment_method'){
          try {

            const result = await stripe.confirmCardPayment(client_secret, {
              payment_method: {
                card: elements.getElement(CardElement),
                billing_details: {
                  name: billing.name, 
                  email: quote.email, 
                  address: {
                    line1: billing.address, 
                    city: billing.city, 
                    postal_code: billing.zip_code
                  }
                }
              },
              setup_future_usage: 'off_session'
            })

            if(result.error) setMessage(`${result.error.message}. For ${result.error.decline_code}`)
            
            setLoading('')
            setMessage('Payment was successful')

            setTimeout(() => {
              window.location.reload()
            }, 2000)

          } catch (error) {
            // console.log(error)
            setLoading('')
            if(error) setMessage('An error occurred while processing your card. Please try again later.')
          }
        }

      } catch (error) {
        // console.log(error.response)
        setLoading('')
        if(error) error.response ? setMessage(error.response.data) : setMessage('Error occurred submitting your information, please try again later')
      }
    }
  }
  
  return (
    <>
      <CardElement/>

      <button 
      className="form-group-button" 
      onClick={(e) => handleCardPayment(e)}
      >
        {loading !== 'payment' && 
          <span>Confirm Payment</span>
        } 
        {loading == 'payment' && 
        <div className="loading">
          <span style={{backgroundColor: loadingColor}}></span>
          <span style={{backgroundColor: loadingColor}}></span>
          <span style={{backgroundColor: loadingColor}}></span>
        </div>}
      </button>

      {message && 
      <span className="form-group-message">
        {message}
      </span>
      }
      
    </>
  )
}

export default CheckoutForm
