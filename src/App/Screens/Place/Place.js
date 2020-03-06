import React from 'react';
import queryString from 'query-string';
import Spinner from '../../Components/Spinner/Spinner'
import Section from '../../Components/Section/Section'

import API from '../../../Configs/Axios';

import './Place.css';

import {withRouter} from 'react-router-dom';

import {connect} from 'react-redux';
import { bindActionCreators } from 'redux';
import {updateAlert} from '../../../Redux/Actions/AlertAction'
import {updateMap} from '../../../Redux/Actions/MapAction'
import {updatePlace, clearPlace} from '../../../Redux/Actions/PlaceAction'

const capitalizeFirstLetter = (string) =>{
    return string.charAt(0).toUpperCase() + string.slice(1);
}

const PlaceBody = (props) =>{

    const moorings = props.place.nearby_moorings===null? null :props.place.nearby_moorings.map((v,i)=>{
      return(
        <button className="nearby-mooring-btn" key={i} onClick={()=>{props.history.push("/place/"+v.id)}}>
          <span className="roundedBtn"><i className="material-icons">directions_boat</i></span>
          <span className="name">{v.name}</span>
          <span className="dist">{v.distance.toFixed(2)}mi</span>
        </button>
      )
    });

  return(
    <div className="pb">
      <span className="title">{props.place.name}</span>
      <span className="type">{capitalizeFirstLetter(props.place.category.name).replace("_", " ")}</span>
      <button type="button" className="btn btn-direction" onClick={()=>{props.history.push("/directions?to="+props.place.latitude+","+props.place.longitude)}}>Get Directions</button>


      <Section title="Address">
        <p>
          {props.place.name}
          {props.place.road!==null?", "+props.place.road:null}
          {props.place.city!==null&&props.place.city!==props.place.name?", "+props.place.city:null}
          {props.place.county!==null?", "+props.place.county:null}
          {props.place.postcode!==null?", "+props.place.postcode:null}
        </p>
      </Section>

      {props.place.phone_number !== null || props.place.website_address !== null?
        <Section title="Contact">
          <table>
            <tbody>
              {props.place.phone_number !== null?
                <tr>
                  <th>Phone Number</th>
                  <td><a href={"tel:"+props.place.phone_number} title={"Call "+props.place.name}>{props.place.phone_number}</a></td>
                </tr>
                :null
              }
              {props.place.website_address !== null?
                <tr>
                  <th>Website</th>
                  <td><a href={props.place.website_address} target="_blank" rel="noreferer">{props.place.website_address}</a></td>
                </tr>
                :null
              }
            </tbody>
          </table>
        </Section>
      :null}

      {props.place.nearby_moorings!==null && props.place.nearby_moorings.length > 0 ?
        <Section title="Nearby Moorings">
          <div className="flex flex-wrap">
            {moorings}
          </div>
        </Section>
      :null}

      {props.place.category.name === "mooring"?
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
      :null}

    </div>
  )
};


class Place extends React.Component{

  constructor(props){
    super(props);
    this.state={
      loading:true,
      place:{},
      placeId:props.match.params.id
    }
    this.mounted=false;
  }
  componentDidMount(){
    this.getPlace();
    this.mounted = true;
  }
  componentWillUnmount(){
    this.mounted=false;
    this.props.onUpdateMap({
      markers:[]
    })
  }

  getPlace(){
    API.get("/places/"+this.state.placeId)
    .then(res=>{
      if(!this.mounted){ return }
      const data = res.data;
      this.setState({
        loading:false,
        place:data.payload
      },()=>{
        this.props.onUpdateMap({
          zoom:[16],
          centerCoordinate:[this.state.place.longitude, this.state.place.latitude],
          markers:[ [this.state.place.longitude, this.state.place.latitude] ]
        });
        this.props.onUpdatePlace({
          query:data.payload.name,
          id:data.payload.id,
          latitude:data.payload.latitude,
          longitude:data.payload.longitude
        })
      })
    })
    .catch(ex=>{
      this.props.onOpenAlert({
        show:true,
        type:"error",
        message:ex.message
      })
      if(!this.mounted){return}
      this.props.history.push("/");
    })
  }

  static getDerivedStateFromProps(nextProps, prevState){
    if(nextProps.match.params.id!==prevState.placeId){
      return { placeId:nextProps.match.params.id }
    }

    return null
  }
  componentDidUpdate(prevProps, prevState){
    if(prevProps.match.params.id !== this.props.match.params.id){
      this.setState({
        loading:true,
        place:{}
      },()=>{
        this.getPlace();
      })
    }
  }

  render(){
    return(
      <div className="window place-view shadow-map-bottom">
        {this.state.loading?<Spinner />: <PlaceBody history={this.props.history} place={this.state.place} />
        }
      </div>
    )
  }

}

const mapStateToProps = (state) =>({});

const mapActionsToProps = (dispatch, props) => {
    return bindActionCreators({
        onOpenAlert: updateAlert,
        onUpdateMap: updateMap,
        onUpdatePlace: updatePlace,
        onClearPlace: clearPlace
    }, dispatch);
};

export default connect(mapStateToProps, mapActionsToProps)(withRouter(Place));
