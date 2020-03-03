import React from 'react';
import ReactMapboxGl, {
  ScaleControl,
  ZoomControl,
  RotationControl
} from "react-mapbox-gl";

import './Map.css';

import {connect} from 'react-redux';

const Map = ReactMapboxGl({
  accessToken: "pk.eyJ1IjoidG9tcjIwMTgiLCJhIjoiY2p1dXgwNzh2MDl1MTQ0bXV3MWkwbGJxYyJ9.wwaKPOWhupTpGV7WO64yLA"
});

class MapContainer extends React.Component{
  render(){
    return(
      <Map
      style="mapbox://styles/mapbox/streets-v11"
      center={this.props.map.centerCoordinate}
      zoom={this.props.map.zoom}
      >
        <ZoomControl className="mapZoomControl" />
        <RotationControl className="mapRotateControl" />
        <ScaleControl className="mapScale"/>
        {this.props.children}
      </Map>
    )
  }
}

const mapStateToProps = (state) =>({
  map:state.mapSettings
});
export default connect(mapStateToProps)(MapContainer);
