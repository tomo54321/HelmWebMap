import React from 'react';

import {connect} from 'react-redux';
import { bindActionCreators } from 'redux';
import {updateAlert} from '../../../Redux/Actions/AlertAction'
import {updateMap} from '../../../Redux/Actions/MapAction'

import './Directions.css'

import Spinner from '../../Components/Spinner/Spinner'

import {withRouter} from 'react-router-dom';
import queryString from 'query-string';
import polyline from '@mapbox/polyline';
import API from '../../../Configs/Axios';
import axios from 'axios';

import SearchList from '../../Components/SearchList/SearchList'

const HourToTime = (decimalTime) => {
    decimalTime = decimalTime * 60 * 60;
    var hours = Math.floor((decimalTime / (60 * 60)));
    decimalTime = decimalTime - (hours * 60 * 60);
    var minutes = Math.floor((decimalTime / 60));
    decimalTime = decimalTime - (minutes * 60);
    var seconds = Math.round(decimalTime);
    if (minutes < 10) {
        minutes = "0" + minutes;
    }
    if (seconds < 10) {
        seconds = "0" + seconds;
    }
    if (hours === 0) {
        return minutes + "mins " + seconds + "s";
    } else {
        return hours + "hrs " + minutes + "mins";
    }
}

const DirectionOverview = (props) =>{
  return(
    <div className="route-details flex flex-between">
      <div className="col flex-shink">
        <span className="via">{props.data[ props.selectedRoute ].legs[0].summary}</span>
      </div>
      <div className="col">
        <span className="distance">{((props.data[ props.selectedRoute ].distance / 1000)/1.609).toFixed(2)} mi</span>
        <span className="duration">{HourToTime( ( (props.data[ props.selectedRoute ].distance / 1000) / 7.45) )}</span>
      </div>
    </div>
  )
}

class Directions extends React.Component{

  constructor(props){
    super(props);

    this.state={
      loading:false,
      fromq:"",
      toq:"",

      fromPlace:null,
      toPlace:null,

      searchFor:1,
      resultList:[],

      selectedRoute:0,
      directionData:null,

    }
    this.mounted=false;
    this.gettingDirections=false;
    this.onTextChange = this.onTextChange.bind(this);
    this.checkPossibleLocations = this.checkPossibleLocations.bind(this);
    this.onSearchClicked = this.onSearchClicked.bind(this);
    this.onResultClick = this.onResultClick.bind(this);
    this.doGetDirections = this.doGetDirections.bind(this);
    this.getPolyline = this.getPolyline.bind(this);
  }
  componentDidMount(){
    this.mounted=true;
    this.checkPossibleLocations();
  }
  componentWillUnmount(){
    this.mounted=false;
    this.props.onUpdateMap({
      markers:[],
      routeLineCoords:[]
    })
  }
  checkPossibleLocations(){
    const query = queryString.parse(this.props.location.search);
    if(this.props.place.id !== 0){
      this.setState({
        toq:this.props.place.query,
        toPlace:{lat:this.props.place.latitude, lng:this.props.place.longitude}
      })
      return;
    }

    if(query["from"] !== undefined){
      const coords = query["from"].split(",");
      if(isNaN(coords[0]) || isNaN(coords[1])){
        return;
      }
      this.setState({
        fromq:coords[0]+", "+coords[1],
        fromPlace:{lat:coords[0], lng:coords[1]}
      },()=>{
        this.doGetDirections();
      })
    }

    if(query["to"] !== undefined){
      const tocoords = query["to"].split(",");
      if(isNaN(tocoords[0]) || isNaN(tocoords[1])){
        return;
      }
      this.setState({
        toq:tocoords[0]+", "+tocoords[1],
        toPlace:{lat:tocoords[0], lng:tocoords[1]}
      },()=>{
        this.doGetDirections();
      })
    }

  }
  onTextChange(e){
    let placeValues = "";
    if(e.target.name==="fromq"){
      placeValues = "fromPlace"
    }else if(e.target.name==="toq"){
      placeValues = "toPlace"
    }

    this.setState({
      [e.target.name]:e.target.value,
      [placeValues]:null,
      directionData:null
    })
  }
  onSearchClicked(e, f){
    this.setState({
      loading:true,
      searchFor:f
    },()=>{
        if(!this.mounted){ return }
        API.get("places", {
          params:{
            query: f===1?this.state.fromq:this.state.toq
          }
        })
        .then(res=>{
          if(!this.mounted){ return }
          const data = res.data;
          this.setState({
            loading:false,
            resultList: data.payload
          })
        })
        .catch(ex=>{
          this.props.onOpenAlert({
            show:true,
            type:"error",
            message:ex.message
          })
        })


    })

    e.preventDefault();
  }
  onResultClick(v){
    if(this.state.searchFor===1){
      this.setState({
        fromq:v.name,
        fromPlace:{lat:v.latitude, lng:v.longitude},
        resultList:[]
      },()=>{
        this.doGetDirections()
      });
    }
    if(this.state.searchFor===2){
      this.setState({
        toq:v.name,
        toPlace:{lat:v.latitude, lng:v.longitude},
        resultList:[]
      },()=>{
        this.doGetDirections()
      });
    }
  }

  getPolyline(legs){
    let coords = [];
        legs.map((item, key) => {

            item.steps.map((v, i) => {
                let c = polyline.decode(v.geometry);

                c.map((v, i) => {
                    coords = [...coords, [v[1], v[0]]];
                })
            })

        })
    return coords;
  }

  doGetDirections(){
    if(this.state.fromPlace!==null&&this.state.toPlace!==null&&this.gettingDirections===false){
      this.gettingDirections=true;
      this.setState({
        loading:true,
      },()=>{

        const url = "https://route.helmapp.net/route/v1/driving/";
        let coords = this.state.fromPlace.lng+","+this.state.fromPlace.lat+";";
        coords += this.state.toPlace.lng+","+this.state.toPlace.lat;
        const params = "?overview=false&alternatives=true&steps=true&hints=;";
        const access = url + coords + params;

        this.props.history.push("/directions?from="+this.state.fromPlace.lat+","+this.state.fromPlace.lng+"&to="+this.state.toPlace.lat+","+this.state.toPlace.lng);

        axios.get(access)
        .then(res=>{
          const data = res.data;
          this.gettingDirections=false;

          const routeLine = this.getPolyline( data.routes[0].legs );

          this.props.onUpdateMap({
            markers:[ [this.state.fromPlace.lng, this.state.fromPlace.lat], [this.state.toPlace.lng, this.state.toPlace.lat] ],

            zoom:[10.5],
            centerCoordinate:[ ((parseFloat(this.state.fromPlace.lng) + parseFloat(this.state.toPlace.lng)) / 2) ,((parseFloat(this.state.fromPlace.lat) + parseFloat(this.state.toPlace.lat)) / 2)],

            routeLineCoords: routeLine
          })

          this.setState({
            loading:false,
            directionData:data.routes
          })

        })
        .catch(ex=>{
            this.gettingDirections=false;
            this.props.onOpenAlert({
              show:true,
              type:"error",
              message:ex.message
            })
        })

      })
    }
  }

  render(){
    return(
      <div className="window directions-overview shadow-map-bottom">

        <div className="flex space-between px-4 py-2">
          <span className="title">Directions</span>
          <button className="close-button" onClick={()=>{this.props.history.push("/")}}><i className="material-icons">close</i></button>
        </div>

        {this.state.loading ?<Spinner /> :
        <>
          <form method="GET" className="flex search-form mt-2" onSubmit={(e)=>{this.onSearchClicked(e, 1)}}>
            <input type="text" className="search-bar" name="fromq" autoComplete="off" onChange={this.onTextChange} placeholder="Where From?" value={this.state.fromq}/>
            <button className="search-button"><i className="material-icons">search</i></button>
          </form>

          <form method="GET" className="flex search-form mt-2" onSubmit={(e)=>{this.onSearchClicked(e, 2)}}>
            <input type="text" className="search-bar" name="toq" autoComplete="off" onChange={this.onTextChange} placeholder="Where To?" value={this.state.toq}/>
            <button className="search-button"><i className="material-icons">search</i></button>
          </form>
        </>}
        {this.state.loading===false&&this.state.resultList.length > 0?<div className="search-results-list"> <SearchList list={this.state.resultList} onResultClick={this.onResultClick}/> </div>:null}
        {this.state.loading===false&&this.state.directionData!==null?<DirectionOverview selectedRoute={this.state.selectedRoute} data={this.state.directionData}/>:null}

      </div>
    )
  }

}
const mapStateToProps = (state) =>({
  place:state.place
});
const mapActionsToProps = (dispatch, props) => {
    return bindActionCreators({
        onOpenAlert: updateAlert,
        onUpdateMap: updateMap
    }, dispatch);
};

export default connect(mapStateToProps, mapActionsToProps)(withRouter(Directions));
