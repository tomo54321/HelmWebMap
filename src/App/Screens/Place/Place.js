import React from 'react';
import Spinner from '../../Components/Spinner/Spinner'
import Section from '../../Components/Section/Section'

import API from '../../../Configs/Axios';

import './Place.css';

import { withRouter } from 'react-router-dom';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { updateAlert } from '../../../Redux/Actions/AlertAction'
import { updateMap } from '../../../Redux/Actions/MapAction'
import { updatePlace, clearPlace } from '../../../Redux/Actions/PlaceAction'

const capitalizeFirstLetter = (string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
}



/**
 * Where all the place data is displayed
 */
class PlaceBody extends React.Component {

  MooringDetails() {
    const props = this.props;
    if (props.place.category.name !== "mooring") { return null; }
    return (
      <Section title="Details">
        <table className="table">
          <tbody>
            <tr>
              <th>Type</th>
              <td>{props.place.data.data.type}</td>
            </tr>
            <tr>
              <th>Allowed Mooring</th>
              <td>{props.place.data.data.how}</td>
            </tr>
            <tr>
              <th>Length</th>
              <td>{props.place.data.data.length} metres</td>
            </tr>
            <tr>
              <th>Approx # of boats</th>
              <td>{props.place.data.data.approx}</td>
            </tr>
            <tr>
              <th>Price</th>
              <td>&pound;{props.place.data.data.price.toFixed(2)}</td>
            </tr>
          </tbody>
        </table>
      </Section>
    )
  }

  NearbyMoorings() {
    const props = this.props;
    if (props.place.nearby_moorings === null || props.place.nearby_moorings.length < 1) { return null; }
    const moorings = props.place.nearby_moorings === null ? null : props.place.nearby_moorings.map((v, i) => {
      return (
        <button className="nearby-mooring-btn" key={i} onClick={() => { props.history.push("/place/" + v.id) }}>
          <span className="roundedBtn"><i className="material-icons">directions_boat</i></span>
          <span className="name">{v.name}</span>
          <span className="dist">{v.distance.toFixed(2)}mi</span>
        </button>
      )
    });
    return (
      <Section title="Nearby Moorings">
        <div className="flex flex-wrap">
          {moorings}
        </div>
      </Section>
    )
  }

  About() {
    if (this.props.place.data === null ||
      this.props.place.data.data === undefined || 
      this.props.place.data.data.about === undefined) { return null; }
    return (
      <Section title="About">
        {this.props.place.data.data.about}
      </Section>
    )
  }

  ContactDetails(){
    const props = this.props;
    if(props.place.phone_number === null && props.place.website_address === null ){ return null;}
    return(
        <Section title="Contact">
          <table>
            <tbody>
              {props.place.phone_number !== null ?
                <tr>
                  <th>Phone Number</th>
                  <td><a href={"tel:" + props.place.phone_number} title={"Call " + props.place.name}>{props.place.phone_number}</a></td>
                </tr>
                : null
              }
              {props.place.website_address !== null ?
                <tr>
                  <th>Website</th>
                  <td><a href={props.place.website_address} target="_blank" rel="noreferer">{props.place.website_address}</a></td>
                </tr>
                : null
              }
            </tbody>
          </table>
        </Section>
    )
  }

  render() {
    const props = this.props;

    return (
      <div className="pb">
        <span className="title">{props.place.name}</span>
        <span className="type">{capitalizeFirstLetter(props.place.category.name).replace("_", " ")}</span>
        <button type="button" className="btn btn-direction" onClick={() => { props.history.push("/directions?to=" + props.place.latitude + "," + props.place.longitude) }}>Get Directions</button>


        <Section title="Address">
          <p>
            {props.place.name}
            {props.place.road !== null ? ", " + props.place.road : null}
            {props.place.city !== null && props.place.city !== props.place.name ? ", " + props.place.city : null}
            {props.place.county !== null ? ", " + props.place.county : null}
            {props.place.postcode !== null ? ", " + props.place.postcode : null}
          </p>
        </Section>

        {this.ContactDetails()}

        {this.NearbyMoorings()}
        {this.MooringDetails()}
        {this.About()}

      </div>
    )

  }
}


class Place extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      place: {},
      placeId: props.match.params.id
    }
    this.mounted = false;
  }
  componentDidMount() {
    this.getPlace();
    this.mounted = true;
  }
  componentWillUnmount() {
    this.mounted = false;
    this.props.onUpdateMap({
      markers: []
    })
  }

  getPlace() {
    // It's either coords or a w3w address.
    if (this.state.placeId === "0") {
      this.getPointPlace();
      return;
    }

    API.get("/places/" + this.state.placeId)
      .then(res => {
        if (!this.mounted) { return }
        const data = res.data;
        this.setState({
          loading: false,
          place: data.payload
        }, () => {
          this.props.onUpdateMap({
            zoom: [16],
            centerCoordinate: [this.state.place.longitude, this.state.place.latitude],
            markers: [[this.state.place.longitude, this.state.place.latitude]]
          });
          this.props.onUpdatePlace({
            query: data.payload.name,
            id: data.payload.id,
            latitude: data.payload.latitude,
            longitude: data.payload.longitude
          })
        })
      })
      .catch(ex => {
        this.props.onOpenAlert({
          show: true,
          type: "error",
          message: ex.message
        })
        if (!this.mounted) { return }
        this.props.history.push("/");
      })
  }

  getPointPlace() {
    // No place set.
    if (window.place === undefined) {
      this.props.history.push("/");
      return;
    }
    let place = window.place;
    window.place = undefined;

    let fakeload = {
      id: 0,
      name: place.name,
      city: null,
      road: null,
      county: null,
      postcode: null,
      phone_number: null,
      website_address: null,
      wifi_access: 0,
      pet_friendly: 0,
      disabled_access: 0,
      latitude: place.latitude,
      longitude: place.longitude,
      nearby_moorings: [],
      category: {
        name: "point",
        icon_name: null
      },
      data: null
    };

    this.setState({
      loading: false,
      place: fakeload
    }, () => {
      this.props.onUpdateMap({
        zoom: [16],
        centerCoordinate: [place.longitude, place.latitude],
        markers: [[place.longitude, place.latitude]]
      });
      this.props.onUpdatePlace({
        id: 0,
        latitude: place.latitude,
        longitude: place.longitude
      })
    })

  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.match.params.id !== prevState.placeId) {
      return { placeId: nextProps.match.params.id }
    }

    return null
  }
  componentDidUpdate(prevProps, prevState) {
    if (prevProps.match.params.id !== this.props.match.params.id) {
      this.setState({
        loading: true,
        place: {}
      }, () => {
        this.getPlace();
      })
    }
  }

  render() {
    return (
      <div className="window place-view shadow-map-bottom">
        {this.state.loading ? <Spinner /> : <PlaceBody history={this.props.history} place={this.state.place} />
        }
      </div>
    )
  }

}

const mapStateToProps = (state) => ({});

const mapActionsToProps = (dispatch, props) => {
  return bindActionCreators({
    onOpenAlert: updateAlert,
    onUpdateMap: updateMap,
    onUpdatePlace: updatePlace,
    onClearPlace: clearPlace
  }, dispatch);
};

export default connect(mapStateToProps, mapActionsToProps)(withRouter(Place));
