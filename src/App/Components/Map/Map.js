import React from 'react';
import ReactMapboxGl, {
  ScaleControl,
  ZoomControl,
  RotationControl,

  Layer,
  Feature
} from "react-mapbox-gl";

import {GeolocateControl} from 'mapbox-gl';

import './Map.css';

import {connect} from 'react-redux';

const Map = ReactMapboxGl({
  accessToken: "pk.eyJ1IjoidG9tbzU0MzIxIiwiYSI6ImNqeDduY3QxMTA4aWMzdG52OGU0eXZxbjMifQ.t_8wOAKqfPvBx3BPK1Yliw"
});

class MapContainer extends React.Component{

  constructor(props){
    super(props);
    this.onMapLoad = this.onMapLoad.bind(this);
    this.handleIncomingLocation = this.handleIncomingLocation.bind(this);
  }

  onMapLoad(map){

    let locator = new GeolocateControl({
      trackUserLocation:true,
    });
    locator.on("geolocate", this.handleIncomingLocation);
    map.addControl(locator);
  }

  handleIncomingLocation(data){
    this.props.onUpdateUser({
      location:data
    })
  }

  render(){

    const mapMarkers = this.props.map.markers.map((v, i)=>{
      return(
        <Feature key={"markers_"+i} coordinates={v} />
      )
    })

    return(
      <Map
      style="mapbox://styles/tomo54321/ck7g9h0g03g8j1ikij2wkb0du/draft"
      center={this.props.map.centerCoordinate}
      zoom={this.props.map.zoom}
      onStyleLoad={this.onMapLoad}
      >
        <ZoomControl className="mapZoomControl" />
        <RotationControl className="mapRotateControl" />
        <ScaleControl className="mapScale"/>
        {this.props.children}
        <Layer type="symbol" id="map_markers" layout={{ 'icon-image': "map-pin" }}>
          {mapMarkers}
        </Layer>

        <Layer
        type="line"
        layout={{ 'line-cap':'round', 'line-join':'round' }}
        paint={{ 'line-color' : '#3066BE', 'line-width' : 5 }}
        id="map_route_line">
          <Feature coordinates={this.props.map.routeLineCoords} />
        </Layer>
      </Map>
    )
  }
}

const mapStateToProps = (state) =>({
  map:state.mapSettings
});
export default connect(mapStateToProps)(MapContainer);
