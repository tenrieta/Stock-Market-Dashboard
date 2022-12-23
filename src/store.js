/* eslint-disable no-underscore-dangle */
import { applyMiddleware, compose, createStore } from "redux";
import thunk from "redux-thunk";
import rootReducer from "./reducers";

const store = createStore(
  rootReducer,
  compose(
    applyMiddleware(thunk), // Thunk is necessary for async action creators
    window.__REDUX_DEVTOOLS_EXTENSION__
      ? window.__REDUX_DEVTOOLS_EXTENSION__()
      : (f) => f // This is to make the Redux for Chrome extension work in an incognito window with disabled Redux extension
  )
);

export default store;
