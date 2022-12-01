import axios from 'axios'
import {API} from '../../config'
import {useRouter} from 'next/router'
import {useState, useEffect} from 'react'
import SVG from '../../files/svgs'
axios.defaults.withCredentials = true

const Activate = ({}) => {

  const router = useRouter()

  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [displayPassword, setDisplayPassword] = useState(false)
  const [displayConfirmPassword, setDisplayConfirmPassword] = useState(false)

  useEffect(() => {
    password != confirmPassword ? setMessage(`passwords don't match`) : setMessage('')
  }, [password, confirmPassword])


  const togglePassword = (type) => {
    if(type == 'password'){
      displayPassword ? 
      (  document.getElementById('password').setAttribute("type", 'password'),
        setDisplayPassword(false)
      )
      :
      ( document.getElementById('password').setAttribute("type", 'text'),
        setDisplayPassword(true)
      )
    }

    if(type == 'confirmPassword'){
      displayConfirmPassword ? 
      (  document.getElementById('confirmPassword').setAttribute("type", 'password'),
        setDisplayConfirmPassword(false)
      )
      :
      ( document.getElementById('confirmPassword').setAttribute("type", 'text'),
        setDisplayConfirmPassword(true)
      )
    }
  }

  const activateAccount = async (e) => {
    let query = router.query
    setLoading(true)
    if(password === confirmPassword){
      try {
        const responseActivate = await axios.post(`${API}/auth/activate-account`, {query, password})
        setMessage('')
        setLoading(false)
        window.location.href = '/login'

      } catch (error) {
        console.log(error)
        setLoading(false)
        if(error.response.data.error) return setMessage(error.response.data.error.msg)
        if(error) return error.response ? setMessage(error.response.data) : setMessage('')
        
      }
    }
  }
  
  return (
    <>
      <div className="activate">
        <form className="activate-form">
          <div className="activate-form-title">Activate account</div>
          <div className="form-group">
            <input 
            id="password" 
            type="password"
            value={password} 
            onChange={(e) => (setMessage(''), setPassword(e.target.value))}
            onKeyUp={(e) => e.keyCode == 13 ? login() : null}
            />
            <label 
            className={`input-label ` + (
              password.length > 0
              ? ' labelHover' 
              : ''
            )}
            htmlFor="password">
              Password
            </label>
            <div 
            onClick={() => togglePassword('password')}>
              {displayPassword ? <SVG svg={'eye-closed'}></SVG> : <SVG svg={'eye'}></SVG>}
            </div>
          </div>
          <div className="form-group">
            <input 
            id="confirmPassword" 
            type="confirmPassword"
            value={confirmPassword} 
            onChange={(e) => (setMessage(''), setConfirmPassword(e.target.value))}
            onKeyUp={(e) => e.keyCode == 13 ? login() : null}
            />
            <label 
            className={`input-label ` + (
              confirmPassword.length > 0
              ? ' labelHover' 
              : ''
            )}
            htmlFor="confirmPassword">
              Confirm Password
            </label>
            <div 
            onClick={() => togglePassword('confirmPassword')}>
              {displayConfirmPassword ? <SVG svg={'eye-closed'}></SVG> : <SVG svg={'eye'}></SVG>}
            </div>
          </div>
          <button 
            className="form-group-button"
            onClick={(e) => (e.preventDefault(), activateAccount())}
          >
            {!loading && <span>Activate Account</span>} 
            {loading && <div className="loading"><span></span><span></span><span></span></div>}
          </button>
          {message &&  <div className="form-group-message">{message}</div>}
        </form>
      </div>
    </>
  )
}

export default Activate
