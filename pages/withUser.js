import {API} from '../config'
import axios from 'axios'
import {getUser, getToken} from '../helpers/auth'
import absoluteURL from 'next-absolute-url'
import Cookies from 'cookies'
axios.defaults.withCredentials = true

const withUser = Page => {
    const WithAuthUser = props => <Page {...props} />
    WithAuthUser.getInitialProps = async (context)  => {
      const cookies = new Cookies(context.req, context.res)
      const { origin } = absoluteURL(context.req)
      const id = context.query.id
      if(id) cookies.set('inventoryURL', `${origin}/inventory/${id}`)

      const user = getUser(context.req)
      const token = getToken(context.req)
      let newUser = null
      let newToken = null

      if(user){newUser = user.split('=')[1]}
      if(token){newToken = token.split('=')[1]}

      if(newToken !== null){
        try {
          const responseUser = await axios.get(`${API}/auth/user`, {
            headers: {
                Authorization: `Bearer ${newToken}`,
                contentType: `application/json`
            }
          })
          newUser = responseUser.data
        } catch (error) {
          newUser = null
          console.log(error) 
        }
      }

      let materials
      try {
        const responseMaterials = await axios.get(`${API}/inventory/materials`)
        materials = responseMaterials.data
      } catch (error) {
        console.log(error)
      }

      let colors
      try {
        const responseColors = await axios.get(`${API}/inventory/colors`)
        colors = responseColors.data
      } catch (error) {
        console.log(error)
      }

      let suppliers
      try {
        const responseColors = await axios.get(`${API}/inventory/suppliers`)
        suppliers = responseColors.data
      } catch (error) {
        console.log(error)
      }

      if(!newUser){
        context.res.writeHead(302, {
          Location: '/login'
        });
        context.res.end();
      }else{
        return {
            ...(Page.getInitialProps ? await Page.getInitialProps(context) : {}),
            newUser,
            materials,
            colors,
            suppliers
        }
      }
    }

    return WithAuthUser
}

export default withUser