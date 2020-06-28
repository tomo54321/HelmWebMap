import React from 'react';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { updateAlert } from '../../../Redux/Actions/AlertAction'
import { updateMap } from '../../../Redux/Actions/MapAction'
import { withRouter } from 'react-router-dom';
import moment from 'moment'
import Section from '../../Components/Section/Section'

import './Welcome.css';

class Welcome extends React.Component {

    componentDidMount() {
        // console.log(this.props.userLocation);
    }
    userLocationView() {
        if (this.props.userLocation === null) { return null }
        return (
            <Section title="My Location">
                <p>{this.props.userLocation.coords.latitude}, {this.props.userLocation.coords.longitude}</p>
            </Section>
        )
    }
    render() {
        const now = moment();
        const tips = [
            "Try searching for your favourite place on the Norfolk Broads...",
            "Search a What 3 Words address '///canine.squish.factually'",
            "Click the locate me button to view your location"
        ];
        return (
            <div className="window welcome-window shadow-map-bottom">
                <h3>Good {now.format("a") === "pm" ? "Afternoon" : "Morning"}</h3>
                <p>Thanks for giving Helm a try! The application is currently in <b>beta</b> so please give us feedback.</p>
                <Section title="Get Started">
                    <p>{tips[Math.floor(Math.random() * tips.length)]}</p>
                </Section>

                {this.userLocationView()}
            </div>
        )
    }
}

const mapStateToProps = (state) => ({
    userLocation: state.user.location
});

const mapActionsToProps = (dispatch, props) => {
    return bindActionCreators({
        onOpenAlert: updateAlert,
        onUpdateMap: updateMap,
    }, dispatch);
};

export default connect(mapStateToProps, mapActionsToProps)(withRouter(Welcome));