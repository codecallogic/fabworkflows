import axios from 'axios'
import {API} from '../../config'
import {useRouter} from 'next/router'
import {useState, useEffect} from 'react'
axios.defaults.withCredentials = true

const Activate = ({}) => {

  const router = useRouter()

  const [password, setPassword] = useState('')
  const [confirm_password, setConfirmPassword] = useState('')
  const [message, setMessage] = useState('')

  const activateAccount = (e) => {
    e.preventDefault()
  }
  
  return (
    <>
      <div className="activate">
        <form className="activate-form" onSubmit={(e) => activateAccount(e)}>
          <div className="form-title center">Activate account</div>
          <div className="form-group-single">
            <label htmlFor="password">Password</label>
            <input type="password" name="password"/>
          </div>
          <div className="form-group-single">
            <label htmlFor="password_confirm">Confirm Password</label>
            <input type="password" name="confirm_password"/>
          </div>
          <button type="submit" className="form-button">Activate</button>
        </form>
      </div>
    </>
  )
}

export default Activate
