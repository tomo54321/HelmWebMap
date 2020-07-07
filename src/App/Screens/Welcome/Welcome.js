import React from 'react';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { updateAlert } from '../../../Redux/Actions/AlertAction'
import { updateMap } from '../../../Redux/Actions/MapAction'
import { withRouter, Link } from 'react-router-dom';
import Section from '../../Components/Section/Section'

class Welcome extends React.Component {
    constructor(props){
        super(props);
        this.nearbyCategories = [
            {
                name: "Mooring",
                icon: "anchor",
            },
            {
                name: "Shop",
                icon: "store",
            },
            {
                name: "Cafe",
                icon: "local_cafe",
            },
            {
                name: "Restaurant",
                icon: "restaurant",
            },
        ];

    }
    userLocationView() {
        if (this.props.userLocation === null) { return null }
        return (
            <Section title="Your Location">
                <p>Latitude: {this.props.userLocation.coords.latitude.toFixed(4)}</p>
                <p>Longitude: {this.props.userLocation.coords.longitude.toFixed(4)}</p>
            </Section>
        )
    }

    renderRecentSearches(){
        let searches = window.localStorage.getItem("recent-searches");
        if(searches === null){ return null; }
        searches = JSON.parse(searches);

        const items = searches.slice(0).reverse().map((v, i) => (
            <li key={"recent_search_" + i}><Link to={"/search?q=" + encodeURI(v)}>{v}</Link></li>
        ));

        return (
            <Section title="Recent Searches">
                <ul className="link-list">{items}</ul>
            </Section>
        )

    }

    render() {
        const categories = this.nearbyCategories.map((v, i) => (
            <button key={"set_category_"+i} className="btn-round-icon nearby-category">
                <i className="material-icons">{v.icon}</i>
                <span className="label">{v.name}s</span>
            </button>
        ));
        return (
            <div className="screen-area">
                <Section title="Find Nearby">
                    <div className="d-flex justify-around py-1">
                        {categories}
                    </div>
                </Section>
                {this.renderRecentSearches()}
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