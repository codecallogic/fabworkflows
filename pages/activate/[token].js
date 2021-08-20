import axios from 'axios'
import {API} from '../../config'
import {useRouter} from 'next/router'
import {useState, useEffect} from 'react'
axios.defaults.withCredentials = true

const Activate = ({}) => {

  const router = useRouter()

  const [password, setPassword] = useState('')
  const [confirm_password, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    password != confirm_password ? setMessage(`passwords don't match`) : setMessage('')
  }, [password, confirm_password])

  const activateAccount = async (e) => {
    e.preventDefault()
    let query = router.query
    setLoading(true)
    if(password === confirm_password){
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
        <form className="activate-form" onSubmit={(e) => activateAccount(e)}>
          <div className="form-title center">Activate account</div>
          <div className="form-group-single">
            <label htmlFor="password">Password</label>
            <input type="password" name="password" value={password} onChange={ (e) => setPassword(e.target.value)}/>
          </div>
          <div className="form-group-single">
            <label htmlFor="password_confirm">Confirm Password</label>
            <input type="password" name="confirm_password" value={confirm_password} onChange={ (e) => setConfirmPassword(e.target.value)}/>
          </div>
          <button type="submit" className="form-button w100">{!loading && <span>Activate Account</span>} {loading && <div className="loading"><span></span><span></span><span></span></div>}</button>
          {message &&  <div className="form-message">{message}</div>}
        </form>
      </div>
    </>
  )
}

export default Activate
