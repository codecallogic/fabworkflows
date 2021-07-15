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
      setMessage(responseSignup.data)
      window.location.href = '/login'
    } catch (error) {
      if(error) error.response ? setMessage(error.response.data) : setMessage('')
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
          <button type="submit" className="form-button-fit">Start free trial</button>
          <span className="link-text">Already have an account? <a className="link" onClick={() => window.location.href = '/login'}>Login</a></span>
          {loading ? <iframe src="https://giphy.com/embed/sSgvbe1m3n93G" width="30" height="30" frameBorder="0" className="giphy-loading" allowFullScreen></iframe> : null }
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
