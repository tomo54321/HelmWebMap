import React from 'react';
import ReactMapboxGl, {
  ScaleControl,
  ZoomControl,
  RotationControl,

  Layer,
  Feature,
} from "react-mapbox-gl";

import { GeolocateControl } from 'mapbox-gl';

import './Map.css';

import { connect } from 'react-redux';
import { hazardFetcher } from '../MapHazards/MapHazards';
import { bindActionCreators } from 'redux';
import { updateHazards, updateMap } from '../../../Redux/Actions/MapAction';

const Map = ReactMapboxGl({
  accessToken: "pk.eyJ1IjoidG9tbzU0MzIxIiwiYSI6ImNqeDduY3QxMTA4aWMzdG52OGU0eXZxbjMifQ.t_8wOAKqfPvBx3BPK1Yliw"
});

class MapContainer extends React.Component {

  constructor(props) {
    super(props);
    this.onMapLoad = this.onMapLoad.bind(this);
    this.handleIncomingLocation = this.handleIncomingLocation.bind(this);
    this.onHazardsNeedUpdating = this.onHazardsNeedUpdating.bind(this);
    this.onZoomEnd = this.onZoomEnd.bind(this);
  }

  componentDidMount() {
    // Load initial 20 hazards.
    hazardFetcher().then(res => {
      this.props.onUpdateHazards(res.data.payload);
    });

  }

  onMapLoad(map) {

    let locator = new GeolocateControl({
      trackUserLocation: true,
    });
    locator.on("geolocate", this.handleIncomingLocation);
    map.addControl(locator);
  }

  onZoomEnd(_, e){
    this.onHazardsNeedUpdating(_, e);

    this.props.onUpdateMap({
      zoom: [e.target.getZoom()]
    })
  }

  handleIncomingLocation(data) {
    this.props.onUpdateUser({
      location: data
    })
  }

  onHazardsNeedUpdating(_, event) {

    // Update state center coord
    const {lat, lng} = event.target.getCenter();

    this.props.onUpdateMap({
      centerCoordinate: [lng, lat]
    })

    // Load hazards in viewport
    hazardFetcher(event.target.getBounds()).then(res => {
      this.props.onUpdateHazards(res.data.payload);
    });

  }


  render() {

    const mapMarkers = this.props.map.markers.map((v, i) => {
      return (
        <Feature key={"markers_" + i} coordinates={v} />
      )
    })

    return (
      // eslint-disable-next-line
      <Map style={"mapbox://styles/tomo54321/ck7g9h0g03g8j1ikij2wkb0du"}
        center={this.props.map.centerCoordinate}
        zoom={this.props.map.zoom}
        onStyleLoad={this.onMapLoad}
        onDragEnd={this.onHazardsNeedUpdating}
        onZoomEnd={this.onZoomEnd}
      >
        <ZoomControl className="mapZoomControl" />
        <RotationControl className="mapRotateControl" />
        <ScaleControl className="mapScale" />

        {this.props.children}
        <Layer type="symbol" id="map_markers" layout={{ 'icon-image': "map-pin" }}>
          {mapMarkers}
        </Layer>

        <Layer
          type="line"
          layout={{ 'line-cap': 'round', 'line-join': 'round' }}
          paint={{ 'line-color': '#3066BE', 'line-width': 5 }}
          id="map_route_line">
          <Feature coordinates={this.props.map.routeLineCoords} />
        </Layer>
      </Map>
    )
  }
}

const mapStateToProps = (state) => ({
  map: state.mapSettings
});
const mapActionsToProps = (dispatch, props) => {
  return bindActionCreators({
    onUpdateHazards: updateHazards,
    onUpdateMap: updateMap
  }, dispatch);
};
export default connect(mapStateToProps, mapActionsToProps)(MapContainer);
