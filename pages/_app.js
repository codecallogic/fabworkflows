import '../styles/app.css'
import {createStore} from 'redux'
import {Provider} from 'react-redux'
import {composeWithDevTools} from 'redux-devtools-extension'
import rootReducer from './../reducers/rootReducer'
import {GOOGLE_API2} from '../config'

const store = createStore(rootReducer, composeWithDevTools())

const googleMaps = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_API2}&libraries=places`

function MyApp({ Component, pageProps }) {
  return <>
    <title>Fabworkflow</title>
    <script src={googleMaps}></script>
    <script src="https://code.jquery.com/pep/0.4.3/pep.js"></script>
    <Provider store={store}><Component {...pageProps} /></Provider>
  </>
}

export default MyApp
