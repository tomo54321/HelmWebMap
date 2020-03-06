import React from 'react';
import "./Speedometer.css";
import {connect} from 'react-redux'

class Speedometer extends React.Component{

    render(){
        if(this.props.user.location === null || this.props.user.location.speed === undefined){ return null; }
        const speed = this.props.user.location.speed * 2.237;
        if(speed < 0.5){ return null }
        return(
            <div className="speedo">
                <span className="fig">{speed.toFixed(2)}</span>
                <span className="unit">mph</span>
            </div>
        )
    }

}

const mapStateToProps = (state) => ({
    user:state.user
})

export default connect(mapStateToProps)(Speedometer);