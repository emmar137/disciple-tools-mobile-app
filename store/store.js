import { createStore, applyMiddleware } from 'redux';
import createSagaMiddleware from 'redux-saga';
import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

import reducer from './reducer';
/* eslint-disable */
import rootSaga from './sagas';
/* eslint-enable */

const persistConfig = {
  key: 'root',
  storage,
};
const persistedReducer = persistReducer(persistConfig, reducer);

const sagaMiddleware = createSagaMiddleware();
const store = createStore(
  persistedReducer,
  applyMiddleware(sagaMiddleware),
);
sagaMiddleware.run(rootSaga);

export default store;
