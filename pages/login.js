import {useState, useEffect} from 'react'
import {useRouter} from 'next/router'
import {API} from '../config'
import axios from 'axios'
axios.defaults.withCredentials = true

const Login = ({}) => {

  const router = useRouter()

  const [email, setEmail] = useState('j.fabricio.au@gmail.com')
  const [password, setPassword] = useState('Testemail1!')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  const login = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const responseLogin = await axios.post(`${API}/auth/login`, {email, password})
      setLoading(false)
      window.location.href = '/'
    } catch (error) {
      console.log(error.response)
      if(error) error.response ? setMessage(error.response.data) : setMessage(null)
      setLoading(false)
    }
  }
  
  return (
    <div className="login">
      <div className="login-logo">Fabworkflows</div>
      <div className="login-title">Login</div>
      <form className="form" onSubmit={(e) => login(e)}>
        <div className="form-group-single">
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}/>
        </div>
        <div className="form-group-single">
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}/>
        </div>
        <button type="submit" className="form-button">sign in</button>
        {loading ? <iframe src="https://giphy.com/embed/sSgvbe1m3n93G" width="30" height="30" frameBorder="0" className="giphy-loading" allowFullScreen></iframe> : null }
        {message &&  <div className="form-message">{message}</div>}
      </form>
      <span>Don't have an account? <a className="link" onClick={() => window.location.href = `/signup`}>Sign up</a></span>
    </div>
  )
}

export default Login
