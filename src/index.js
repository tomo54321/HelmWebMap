import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App/App';
import * as serviceWorker from './serviceWorker';

import {
  BrowserRouter as Router,
} from "react-router-dom";

import userReducer from './Redux/Reducers/UserReducer';
import placeReducer from './Redux/Reducers/PlaceReducer';
import alertReducer from './Redux/Reducers/AlertReducer';
import mapReducer from './Redux/Reducers/MapReducer';
import { combineReducers, createStore } from 'redux';
import { Provider } from 'react-redux';

const allReducers = combineReducers({
    user:userReducer,
    alert:alertReducer,
    place:placeReducer,
    mapSettings:mapReducer
})
const store = createStore(allReducers, {
    user: {name:"", accessToken:"", location:null},
    place: {query:"", id:0},
    alert:{ show:false },
    mapSettings: { zoom:[10], centerCoordinate:[1.605595, 52.596973], markers:[], routeLineCoords:[], hazards:[] }
})

const Application = () =>{
  return(
    <Router>
      <Provider store={store}>
        <App />
      </Provider>
    </Router>
  )
};

ReactDOM.render(<Application />, document.getElementById('app'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.register();
