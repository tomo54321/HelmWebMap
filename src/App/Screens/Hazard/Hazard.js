import React from 'react';
import Spinner from '../../Components/Spinner/Spinner'
import Section from '../../Components/Section/Section'

import API from '../../../Configs/Axios';

import './Hazard.css';

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
      <div className="window place-view shadow-map-bottom">
        {this.state.loading?<Spinner />: <HazardBody data={this.state.hazard} />
        }
      </div>
    )
  }

}

const HazardBody = (props) => (
  <div className="pb">
    <span className="title">{props.data.hazard_type.name} Report</span>
    <span className="type">{props.data.user.username}</span>

    <Section title="Details">
      <table>
        <tbody>
          <tr>
            <th>First spotted at</th>
            <td>{moment.utc(props.data.created_at).local().format("MMMM Do YYYY, h:mm a")}</td>
          </tr>
          <tr>
            <th>Last spotted</th>
            <td>{moment.utc(props.data.updated_at).local().format("MMMM Do YYYY, h:mm a")}</td>
          </tr>
        </tbody>
      </table>
    </Section>

  { props.data.comment ? <Section title="Comment">{props.data.comment}</Section> : null } 

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
