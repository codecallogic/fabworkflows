import '../styles/app.css'
import {createStore} from 'redux'
import {Provider} from 'react-redux'
import {composeWithDevTools} from 'redux-devtools-extension'
import rootReducer from './../reducers/rootReducer'

const store = createStore(rootReducer, composeWithDevTools())

function MyApp({ Component, pageProps }) {
  return <>
    <title>Fabworkflow</title>
    <script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyBHrQuxZIoyHk51s2WxFcphYLP3PPPxT80&libraries=places"></script>
    <Provider store={store}><Component {...pageProps} /></Provider>
  </>
}

export default MyApp
