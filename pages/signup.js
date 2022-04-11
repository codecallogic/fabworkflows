import { useState, useEffect } from 'react'
import SVG from '../files/svgs'
import axios from 'axios'
import {API} from '../config'

const Signup = ({}) => {

  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')

  const reset = () => {
    setFirstName('')
    setLastName('')
    setEmail('')
    setPhoneNumber('')
  }

  const signup = async () => {
    setLoading(true)
    try {
      const responseSignup = await axios.post(`${API}/auth/register`, {firstName, lastName, email, phoneNumber})
      reset()
      setLoading(false)
      setMessage(`${responseSignup.data}, please activate account to continue.`)
    } catch (error) {
      if(error) error.response ? setError(error.response.data) : setError('')
      setLoading(false)
    }
  }
  
  return (
    <div className="signup">
      <div className="signup-banner">
        <div className="signup-banner-title">Free 30 day trial</div>
        <div className="signup-banner-subtitle">experience the benefits yourself</div>
      </div>
      <div className="signup-form-container">
        <form className="form" onSubmit={(e) => signup(e)}>
          <h3 className="signup-form-title">Create account</h3>
          <div className="form-group">
            <div className="form-group">
            <input 
              id="firstName" 
              value={firstName} 
              onChange={(e) => (setFirstName(e.target.value))}
              />
            <label 
              className={`input-label ` + (
              firstName
              ? ' labelHover' 
              : ''
            )}
            htmlFor="firstName">
              First Name
            </label>
            </div>
            <div className="form-group">
              <input 
                id="lastName" 
                value={lastName} 
                onChange={(e) => (setLastName(e.target.value))}
              />
              <label 
                className={`input-label ` + (
                lastName
                ? ' labelHover' 
                : ''
              )}
              htmlFor="lastName">
                Last Name
              </label>
            </div>
          </div>
          <div className="form-group">
            <input 
              id="email" 
              value={email} 
              onChange={(e) => (setEmail(e.target.value))}
            />
            <label 
              className={`input-label ` + (
              email
              ? ' labelHover' 
              : ''
            )}
            htmlFor="email">
              Email
            </label>
          </div>
          <div className="form-group">
            <input 
              id="phoneNumber" 
              value={phoneNumber} 
              onChange={(e) => (setPhoneNumber(e.target.value))}
            />
            <label 
              className={`input-label ` + (
              phoneNumber
              ? ' labelHover' 
              : ''
            )}
            htmlFor="phoneNumber">
              Phone Number
            </label>
          </div>
          {message &&  <div className="form-group-message">{message}</div>}
          <button 
            className="form-group-button"
            onClick={(e) => (e.preventDefault(), signup())}
          >
            {!loading && <span>Start free trial</span>} 
            {loading && <div className="loading"><span></span><span></span><span></span></div>}
          </button>
          <span className="link-text">Already have an account? <a className="link" onClick={() => window.location.href = '/login'}>Login</a></span>
        </form>
        <div className="signup-free_trial">
          <div className="signup-free_trial-title">Free trial includes</div>
          <div className="signup-free_trial-features">
            <div className="signup-free_trial-features-column">
              <div className="signup-free_trial-features-column-item">
                <SVG svg={'checkmark'}></SVG>
                <span>All features</span>
              </div>
              <div className="signup-free_trial-features-column-item">
                <SVG svg={'checkmark'}></SVG>
                <span>Unlimited users</span>
              </div>
              <div className="signup-free_trial-features-column-item">
                <SVG svg={'checkmark'}></SVG>
                <span>Tutorial videos</span>
              </div>
            </div>
            <div className="signup-free_trial-features-column">
              <div className="signup-free_trial-features-column-item">
                <SVG svg={'checkmark'}></SVG>
                <span>Free setup consultation</span>
              </div>
              <div className="signup-free_trial-features-column-item">
                <SVG svg={'checkmark'}></SVG>
                <span>Unlimited file storage</span>
              </div>
              <div className="signup-free_trial-features-column-item">
                <SVG svg={'checkmark'}></SVG>
                <span>No contract, cancel any time</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Signup
