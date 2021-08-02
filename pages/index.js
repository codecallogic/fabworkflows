import Head from 'next/head'
import Image from 'next/image'
import withUser from './withUser'
import axios from 'axios'
import {API} from '../config'

const Home = ({newUser}) => {

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
      {newUser && <a onClick={logout} className="logout">Logout</a>}
    </div>
  )
}

export default withUser(Home)
