import React from 'react';
import API from '../../../Configs/Axios';
import { Layer, Feature } from 'react-mapbox-gl';
import {connect} from 'react-redux';
import { withRouter } from 'react-router-dom';

class MapHazards extends React.Component{
    constructor(props){
        super(props);

        this.mounted = false;
        this.hazardClicked = this.hazardClicked.bind(this);
    }
    componentDidMount(){
        this.mounted = true;
    }
    componentWillUnmount(){
        this.mounted = false;
    }

    hazardClicked(e){
        const hazardID = e.feature.properties.hazid;
        this.props.history.push("/hazard/"+hazardID);
    }

    render(){
        const hazards = this.props.map.hazards.map((v, i)=>{
            return(
              <Feature key={"marker_hazard_"+v.id} coordinates={[v.lng, v.lat]} properties={{hazid:v.id}} onClick={this.hazardClicked}/>
            )
          })

        return (
            <Layer type="symbol" id="area_hazards" layout={{ 'icon-image': "hazard-pin" }}>
                {hazards}
            </Layer>
        );
    }
}

export const hazardFetcher = (boundingBox = false) => {
    let options = {};
    if(boundingBox !== false){
        // Bottom Left of Screen
        options["lat1"] = boundingBox._sw.lat;
        options["lng1"] = boundingBox._sw.lng;

        // Top Right of Screen
        options["lat2"] = boundingBox._ne.lat;
        options["lng2"] = boundingBox._ne.lng;
    }
    return API.get("/hazards", {
        params: options
    });
};

const mapStateToProps = (state) =>({
    map:state.mapSettings
 });

export default connect(mapStateToProps)(withRouter(MapHazards));