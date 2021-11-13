import axios from 'axios'
import {API} from '../../config'

const Checkout = ({}) => {
  const logout = async () => {
    // console.log('Hello')
    try {
      const responseSignOut = await axios.post(`${API}/auth/logout`)
      window.location.href = '/login'
    } catch (error) {
      console.log(error)
    }
  }
  
  return (
    <div className="home">
      Website is under development...
      {newUser ? <a onClick={logout} className="logout">Logout</a> : <a onClick={() => window.location.href = '/login'} className="logout">Login</a>}
    </div>
  )
}

Confirmation.getInitialProps = async ({query}) => {

}

export default Checkout
