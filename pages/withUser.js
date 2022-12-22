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
      let account = null
      let newToken = null

      if(user){account = user.split('=')[1]}
      if(token){newToken = token.split('=')[1]}

      if(newToken !== null){

        // console.log('ADSFLKASJFOSDIJF')
        
        try {
          const responseUser = await axios.get(`${API}/auth/user`, {
            headers: {
                Authorization: `Bearer ${newToken}`,
                contentType: `application/json`
            }
          })
          account = responseUser.data
        } catch (error) {
          account = null
          console.log(error) 
        }
      }

      if(!account){
        context.res.writeHead(302, {
          Location: '/login'
        });
        context.res.end();
      }else{
        return {
            ...(Page.getInitialProps ? await Page.getInitialProps(context) : {}),
            account
        }
      }
    }

    return WithAuthUser
}

export default withUser