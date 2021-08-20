import { useState, useEffect } from 'react'
import SVG from '../files/svgs'
import axios from 'axios'
import {API} from '../config'

const Signup = ({}) => {

  const [first_name, setFirstName] = useState('')
  const [last_name, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [phone_number, setPhoneNumber] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('dfajsdifoj')
  const [message, setMessage] = useState('')

  const reset = () => {
    setFirstName('')
    setLastName('')
    setEmail('')
    setPhoneNumber('')
  }

  const signup = async (e) => {
    setLoading(true)
    e.preventDefault()
    try {
      const responseSignup = await axios.post(`${API}/auth/register`, {first_name, last_name, email, phone_number})
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
          <div className="form-title">Create an account</div>
          <div className="form-group-double">
            <div className="form-group-double-item">
              <label htmlFor="first_name">First Name</label>
              <input type="text" name={first_name} value={first_name} onChange={(e) => setFirstName(e.target.value)} required/>
            </div>
            <div className="form-group-double-item">
              <label htmlFor="last_name">Last Name</label>
              <input type="text" name={last_name} value={last_name} onChange={(e) => setLastName(e.target.value)} required/>
            </div>
          </div>
          <div className="form-group-single">
            <label htmlFor="email">Email</label>
            <input type="email" name={email} value={email} onChange={(e) => setEmail(e.target.value)} required/>
          </div>
          <div className="form-group-single">
            <label htmlFor="phone_number">Phone Number (optional)</label>
            <input type="tel" name={phone_number} value={phone_number} onChange={(e) => setPhoneNumber(e.target.value)}/>
          </div>
          <button type="submit" className="form-button-fit">{!loading && <span>Start free trial</span>} {loading && <div className="loading"><span></span><span></span><span></span></div>}</button>
          <span className="link-text">Already have an account? <a className="link" onClick={() => window.location.href = '/login'}>Login</a></span>
          {message &&  <div className="form-message">{message}</div>}
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
