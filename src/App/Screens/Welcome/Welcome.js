import React from 'react';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { updateAlert } from '../../../Redux/Actions/AlertAction'
import { updateMap } from '../../../Redux/Actions/MapAction'
import { withRouter, Link } from 'react-router-dom';
import Section from '../../Components/Section/Section'

class Welcome extends React.Component {
    constructor(props) {
        super(props);
        this.nearbyCategories = [
            {
                name: "Mooring",
                icon: "anchor",
                search: "mooring"
            },
            {
                name: "Shop",
                icon: "store",
                search: "supermarket"
            },
            {
                name: "Cafe",
                icon: "local_cafe",
                search: "cafe"
            },
            {
                name: "Restaurant",
                icon: "restaurant",
                search: "restaurant",
            },
        ];

        this.doSearch = this.doSearch.bind(this);

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

    renderRecentSearches() {
        let searches = window.localStorage.getItem("recent-searches");
        if (searches === null) {
            return (<Section title="Welcome">
                <p>Make your first search, give it a try by entering something above</p>
                <p>Did you know you can also search a What 3 Words address by starting your search with "///"</p>
            </Section>);
        }
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

    doSearch(item) {
        this.props.history.push("/search?q=" + item.search + "&nearby=true")
    }

    render() {
        const categories = this.nearbyCategories.map((v, i) => (
            <button key={"set_category_" + i} onClick={() => this.doSearch(v)} className="btn-round-icon nearby-category">
                <i className="material-icons">{v.icon}</i>
                <span className="label">{v.name}s</span>
            </button>
        ));
        return (
            <div className="screen-area">

                {this.props.map.zoom[0] > 12 ?
                    <Section title="Find Nearby">
                        <div className="d-flex justify-around py-1">
                            {categories}
                        </div>
                    </Section>
                    : null}
                {this.renderRecentSearches()}
                {this.userLocationView()}
            </div>
        )
    }
}

const mapStateToProps = (state) => ({
    userLocation: state.user.location,
    map: state.mapSettings
});

const mapActionsToProps = (dispatch, props) => {
    return bindActionCreators({
        onOpenAlert: updateAlert,
        onUpdateMap: updateMap,
    }, dispatch);
};

export default connect(mapStateToProps, mapActionsToProps)(withRouter(Welcome));