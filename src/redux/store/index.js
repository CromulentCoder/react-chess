import reducers from '../reducers';
import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';

function configureStore(initialState = {}) {
    return createStore(reducers, initialState, applyMiddleware(thunk));
}

const store = configureStore();
export default store