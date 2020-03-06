import React from 'react';
import {connect} from 'react-redux';
import { bindActionCreators } from 'redux';
import {closeAlert} from '../Redux/Actions/AlertAction'

import Map from './Components/Map/Map'
import SearchBar from './Components/SearchBar/SearchBar'
import Alert from './Components/Alert/Alert'
import { Switch, Route } from "react-router-dom";

import SearchResults from './Screens/SearchResults/SearchResults.js'
import Place from './Screens/Place/Place.js'
import Directions from './Screens/Directions/Directions.js'

import './App.css';

class App extends React.Component{

  render(){
    return(
      <div className="container">
        <Map />
        <div className="viewer">
          <SearchBar />
          <Switch>
            <Route exact path="/search">
              <SearchResults />
            </Route>
            <Route exact path="/place/:id">
              <Place />
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
        onCloseAlert: closeAlert
    }, dispatch);
};

export default connect(mapStateToProps, mapActionsToProps)(App);
