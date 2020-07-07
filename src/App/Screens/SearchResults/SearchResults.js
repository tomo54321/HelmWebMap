import React from 'react';
import queryString from 'query-string';
import Spinner from '../../Components/Spinner/Spinner'
import SearchList from '../../Components/SearchList/SearchList'

import API from '../../../Configs/Axios';

import {withRouter} from 'react-router-dom';

import {connect} from 'react-redux';
import { bindActionCreators } from 'redux';
import {updateAlert} from '../../../Redux/Actions/AlertAction'
import {updateMap} from '../../../Redux/Actions/MapAction'

class SearchResults extends React.Component{

  constructor(props){
    super(props);
    this.state={
      loading:true,
      query: "",
      results:[]
    }

    this.setQuery = this.setQuery.bind(this);
    this.getResults = this.getResults.bind(this);
    this.onResultClick = this.onResultClick.bind(this);
    this.mounted = false;
  }
  componentDidMount(){
    this.mounted = true;
    this.setQuery(()=>{
      this.getResults();
    })
  }
  componentWillUnmount(){
    this.mounted=false;
    this.props.onUpdateMap({
      markers:[]
    })
  }
  setQuery(cb){
    const query = queryString.parse(this.props.location.search);
    if(query.q === undefined || query.q === ""){

      this.props.history.push("/");

    }else{
      this.setState({
        query: query.q
      }, cb)
    }
  }
  getResults(){
    API.get("places", {
      params:{
        query: this.state.query
      }
    })
    .then(res=>{
      const data = res.data;
      this.setState({
        loading:false,
        results: data.payload
      })
      
      if(data.payload.length === 0){ return }

      if(data.payload.length === 1 && data.payload[0].name === this.state.query){
        this.onResultClick(data.payload[0]);
        return;
      }

      
      const mkrs = [];
      let totalLat = 0;
      let totalLng = 0;

      data.payload.forEach((v, i)=>{
        totalLat += v.latitude;
        totalLng += v.longitude;

        mkrs.push([v.longitude, v.latitude])
      })
      totalLat = totalLat / data.payload.length;
      totalLng = totalLng / data.payload.length;

      this.props.onUpdateMap({
        markers:mkrs,
        centerCoordinate: [totalLng, totalLat],
        zoom: [10]
      })

    })
    .catch(ex=>{
      this.props.onOpenAlert({
        show:true,
        type:"error",
        message:ex.message
      })
      this.props.history.push("/");
    })
  }

  onResultClick(v){
    this.props.onUpdateMap({
      zoom:[16],
      centerCoordinate:[v.longitude, v.latitude]
    });

    window.place = v;

    this.props.history.push("/place/"+v.id);
  }

  render(){
    return(
        this.state.loading?<Spinner />: <SearchList list={this.state.results} onResultClick={this.onResultClick}/>
    )
  }

}

const mapStateToProps = (state) =>({});

const mapActionsToProps = (dispatch, props) => {
    return bindActionCreators({
        onOpenAlert: updateAlert,
        onUpdateMap: updateMap
    }, dispatch);
};

export default connect(mapStateToProps, mapActionsToProps)(withRouter(SearchResults));
