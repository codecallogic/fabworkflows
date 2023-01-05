import {useState, useEffect} from 'react'
import {useRouter} from 'next/router'
import {API} from '../config'
import axios from 'axios'
axios.defaults.withCredentials = true

const Login = ({redirectLoginURL}) => {
  const router = useRouter()
  const loadingColor = 'white'
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [forgot_password, setForgotPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  const login = async (e) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')
    try {
      const responseLogin = await axios.post(`${API}/auth/login`, {email, password})
      window.location.href = '/account'
      setLoading(false)
    } catch (error) {
      console.log(error.response)
      if(error) error.response ? setMessage(error.response.data) : setMessage(null)
      setLoading(false)
    }
  }

  const forgotPassword = async (e) => {
    e.preventDefault()

    try {
      const responsePassword = await axios.post(`${API}/auth/`)
    } catch (error) {
      
    }
  }
  
  return (
    <>
    <div className="login">
      <img src="/media/logo_2.png" alt="" className="login-logo" />
      <div className="login-title">Login</div>
      <form className="form" onSubmit={(e) => login(e)}>
        <div className="login-form">

          <div className="form-group inputFieldWhite">
            <input 
            id="email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)}/>
            <label 
            className={`input-label ` + (
              email !== '' || 
              typeof email == 'object' 
              ? ' labelHover' 
              : ''
            )}
            htmlFor="email">
              Email
            </label>
          </div>

          <div className="form-group inputFieldWhite">
            <input 
            id="password" 
            type="password"
            value={password} 
            onChange={(e) => setPassword(e.target.value)}/>
            <label 
            className={`input-label ` + (
              password !== '' || 
              typeof password == 'object' 
              ? ' labelHover' 
              : ''
            )}
            htmlFor="password">
              Password
            </label>
          </div>
        </div>

        {message &&  <div className="form-group-message">{message}</div>}

        <button type="submit" className="form-group-button">
          {!loading && <span>sign in</span>} 
          {loading && 
            <div className="loading">
              <span style={{backgroundColor: loadingColor}}></span>
              <span style={{backgroundColor: loadingColor}}></span>
              <span style={{backgroundColor: loadingColor}}></span>
          </div>
          }
        </button>

      </form>
      <span className="link-text">Don't have an account? <a className="link" onClick={() => window.location.href = `/signup`}>Sign up</a></span>
      <span className="link-forgotPassword">Forgot Password</span>
    </div>
    {/* <div className="forgotPassword-modal">
      <div className="forgotPassword-modal-box">
        <div className="forgotPassword-modal-box-header">
          <div onClick={() => (setLoginModal(false), clientSignUp('RESET'), setError(''), setMessage(''))}><SVG svg={'close'}></SVG></div>
        </div>
        <form className="forgotPassword-modal-form" onSubmit={(e) => forgotPassword(e)}>
          <span className="forgotPassword-modal-form-title">Forgot Password</span>
          <div className="form-group-single-textarea">
            <div className="form-group-single-textarea-field">
              <textarea id="forgot_password_email" rows="1" name="email" placeholder="(Enter email)" value={forgot_password} onChange={(e) => setForgotPassword(e.target.value)} onFocus={(e) => e.target.placeholder = ''} onBlur={(e) => e.target.placeholder = '(Enter email)'} wrap="off" onKeyDown={(e) => e.keyCode == 13 ? e.preventDefault() : null} required></textarea>
            </div>
          </div>
          <button type="submit" className="form-button w100">{!loading && <span>Reset Password</span>} {loading && <div className="loading"><span></span><span></span><span></span></div>}</button>
        </form>
      </div>
    </div> */}
    </>
  )
}

export default Login
