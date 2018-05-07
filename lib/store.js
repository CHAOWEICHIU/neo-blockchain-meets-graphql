import rootReducer from './reducers'
import { createStore, applyMiddleware, compose } from 'redux'

const preloadedState = {}
const enhancers = compose(
  typeof window !== 'undefined' && process.env.NODE_ENV !== 'production'
    ? window.devToolsExtension && window.devToolsExtension()
    : f => f)

const createStoreWithMiddleware = applyMiddleware()(createStore)
export default initialState => createStoreWithMiddleware(rootReducer, preloadedState, enhancers)
