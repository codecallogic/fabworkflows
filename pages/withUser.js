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

      let locations
      try {
        const responseLocations = await axios.get(`${API}/inventory/locations`)
        locations = responseLocations.data
      } catch (error) {
        console.log(error)
      }

      let brands
      try {
        const responseBrands = await axios.get(`${API}/inventory/brands`)
        brands = responseBrands.data
      } catch (error) {
        console.log(error)
      }

      let models
      try {
        const responseModels = await axios.get(`${API}/inventory/models`)
        models = responseModels.data
      } catch (error) {
        console.log(error)
      }

      let categories
      try {
        const responseCategories = await axios.get(`${API}/inventory/categories`)
        categories = responseCategories.data
      } catch (error) {
        console.log(error)
      }

      let priceList
      try {
        const responsePriceList = await axios.get(`${API}/transaction/get-price-list`)
        priceList = responsePriceList.data
      } catch (error) {
        console.log(error)
      }

      let addressList
      try {
        const responseAddressList = await axios.get(`${API}/transaction/get-address-list`)
        addressList = responseAddressList.data
      } catch (error) {
        console.log(error)
      }


      let misc_categories
      try {
        const responseMiscCategories = await axios.get(`${API}/transaction/get-categories-list`)
        misc_categories = responseMiscCategories.data
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
            suppliers,
            locations,
            brands,
            models,
            categories,
            priceList,
            addressList,
            misc_categories
        }
      }
    }

    return WithAuthUser
}

export default withUser