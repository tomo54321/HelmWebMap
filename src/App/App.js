import React from 'react';
import {connect} from 'react-redux';
import { bindActionCreators } from 'redux';
import {closeAlert} from '../Redux/Actions/AlertAction'
import {updateUser} from '../Redux/Actions/UserAction'

import Map from './Components/Map/Map'
import SearchBar from './Components/SearchBar/SearchBar'
import Alert from './Components/Alert/Alert'
import { Switch, Route } from "react-router-dom";

import SearchResults from './Screens/SearchResults/SearchResults'
import Place from './Screens/Place/Place'
import Directions from './Screens/Directions/Directions';
import Welcome from './Screens/Welcome/Welcome';
import Hazard from './Screens/Hazard/Hazard';

import MapPois from './Components/MapPois/MapPois';
import MapHazards from './Components/MapHazards/MapHazards';

import textLogo from '../Images/helmtext.png'

import './Styles/App.scss';

class App extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      sidebarOpen : false
    }
    this.onSidebarClick = this.onSidebarClick.bind(this);
  }
  onSidebarClick(e){
    if(!e.target.classList.contains("sidebar") && this.state.sidebarOpen){
      return;
    }

    this.setState(prevState => {
      return {sidebarOpen : !prevState.sidebarOpen}
    })
  }
  render(){
    return(
      <div className="container">
        <Map onUpdateUser={this.props.onUpdateUser}>

          {/* Map Points of interest, includes Moorings & Bridges */}
          <MapPois />

          {/* The Hazards Gotten from the server. */}
          <MapHazards />
        </Map>

        <div 
        
        onClick={this.onSidebarClick} 

        className={"sidebar" + (this.state.sidebarOpen ? " open" : "")}>

          <img src={textLogo} alt="Helm" className="logo" />

          <SearchBar />

          <Switch>
            <Route exact path="/">
              <Welcome />
            </Route>
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
