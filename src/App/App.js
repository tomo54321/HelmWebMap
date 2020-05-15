import React from 'react';
import {connect} from 'react-redux';
import { bindActionCreators } from 'redux';
import {closeAlert} from '../Redux/Actions/AlertAction'
import {updateUser} from '../Redux/Actions/UserAction'

import Map from './Components/Map/Map'
import SearchBar from './Components/SearchBar/SearchBar'
import Alert from './Components/Alert/Alert'
import Speedometer from './Components/Speedometer/Speedometer';
import { Switch, Route } from "react-router-dom";

import SearchResults from './Screens/SearchResults/SearchResults.js'
import Place from './Screens/Place/Place.js'
import Directions from './Screens/Directions/Directions.js';

import MapPois from './Components/MapPois/MapPois';
import MapHazards from './Components/MapHazards/MapHazards'

import './App.css';
import Hazard from './Screens/Hazard/Hazard';

class App extends React.Component{

  render(){
    return(
      <div className="container">
        <Map onUpdateUser={this.props.onUpdateUser}>

          {/* Map Points of interest, includes Moorings & Bridges */}
          <MapPois />

          {/* The Hazards Gotten from the server. */}
          <MapHazards />
        </Map>


        <Speedometer />
        <div className="viewer">
          <SearchBar />
          <Switch>
            <Route exact path="/search">
              <SearchResults />
            </Route>
            <Route exact path="/place/:id">
              <Place />
            </Route>
            <Route exact path="/hazard/:id">
              <Hazard />
            </Route>
            <Route exact path="/directions">
              <Directions />
            </Route>
          </Switch>
        </div>

        <Alert {...this.props.alert} onClose={this.props.onCloseAlert}/>

      </div>
    )
  }

}

const mapStateToProps = (state) =>({
    user: state.user,
    alert: state.alert
});

const mapActionsToProps = (dispatch, props) => {
    return bindActionCreators({
        onCloseAlert: closeAlert,
        onUpdateUser: updateUser
    }, dispatch);
};

export default connect(mapStateToProps, mapActionsToProps)(App);
