import '../styles/app.css'
import {createStore} from 'redux'
import {Provider} from 'react-redux'
import {composeWithDevTools} from 'redux-devtools-extension'
import rootReducer from './../reducers/rootReducer'

const store = createStore(rootReducer, composeWithDevTools())

function MyApp({ Component, pageProps }) {
  return <Provider store={store}><Component {...pageProps} /></Provider>
}

export default MyApp
