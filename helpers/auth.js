import axios from 'axios';
import { API } from '../config'

export const getUser = (req) => {
  if(!req.headers.cookie){
    return undefined
  }

  let user = req.headers.cookie

  if(!user){
      return undefined
  }

  const array = new Array(user.split(';'))

  const newArray = array[0].map( (i) => {
    return i.trim()
  })

  let parsedUser = newArray.find( a => a.includes("user"))

  return parsedUser
}

export const getToken = (req) => {
  if(!req.headers.cookie){
    return undefined
  }

  let token = req.headers.cookie

  if(!token){
      return undefined
  }

  const array = new Array(token.split(';'))

  const newArray = array[0].map( (i) => {
    return i.trim()
  })

  let parsedToken = newArray.find( a => a.includes("accessToken"))

  return parsedToken
}

export const logoutAdmin = async () => {
  
  try {
    const response = await axios.post(`${API}/auth/logout`)
    window.location.reload()
  } catch (error) {
    console.log(error)
  }
  
}