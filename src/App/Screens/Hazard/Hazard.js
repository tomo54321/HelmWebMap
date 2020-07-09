import React from 'react';
import Spinner from '../../Components/Spinner/Spinner'
import Section from '../../Components/Section/Section'

import API from '../../../Configs/Axios';

import {connect} from 'react-redux';
import { bindActionCreators } from 'redux';
import {updateAlert} from '../../../Redux/Actions/AlertAction'
import {updateMap} from '../../../Redux/Actions/MapAction'
import {withRouter} from 'react-router-dom';
import moment from 'moment';

class Hazard extends React.Component{

  constructor(props){
    super(props);
    this.state={
      loading:true,
      hazard:{},
      hazardId:props.match.params.id
    }
    this.mounted=false;
  }
  componentDidMount(){
    this.getHazard();
    this.mounted = true;
  }
  componentWillUnmount(){
    this.mounted=false;
  }

  getHazard(){
    API.get("/hazards/"+this.state.hazardId)
    .then(res=>{
      if(!this.mounted){ return }
      const data = res.data;
      this.setState({
        loading:false,
        hazard:data.payload
      }, () =>{

        this.props.onUpdateMap({
          zoom:[16],
          centerCoordinate:[this.state.hazard.lng, this.state.hazard.lat],
        });

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
    if(nextProps.match.params.id!==prevState.hazardId){
      return { hazardId:nextProps.match.params.id }
    }

    return null
  }
  componentDidUpdate(prevProps, prevState){
    if(prevProps.match.params.id !== this.props.match.params.id){
      this.setState({
        loading:true,
        hazard:{}
      },()=>{
        this.getHazard();
      })
    }
  }

  render(){
    return(
        this.state.loading?<Spinner />: <HazardBody data={this.state.hazard} />
        
    )
  }

}

const HazardBody = (props) => (
  <div className="screen-area">
    <span className="title py-1">{props.data.hazard_type.name}</span>

    <Section title="Reported By">
      {props.data.user.username}
    </Section>
    <Section title="Reported">
      {moment.utc(props.data.created_at).local().format("Do MMMM \\a\\t h:mma")}
    </Section>

    <Section title="Last Update">{moment.utc(props.data.updated_at).local().fromNow()}
    </Section>

    { props.data.comment ? <Section title="Comment">{props.data.comment}</Section> : <center><small className="muted">No further information was given</small></center> } 

  </div>
);

const mapStateToProps = (state) =>({});

const mapActionsToProps = (dispatch, props) => {
    return bindActionCreators({
        onOpenAlert: updateAlert,
        onUpdateMap: updateMap,
    }, dispatch);
};

export default connect(mapStateToProps, mapActionsToProps)(withRouter(Hazard));
