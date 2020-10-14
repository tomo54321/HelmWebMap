import React from 'react';
import { withRouter } from 'react-router-dom';
import {baseURL} from '../../../Configs/Axios';

import {

    Layer,
    Source,
} from "react-mapbox-gl";


const poi_markers = {
    source:
    {
        "type": "geojson",
        "data": baseURL + "places/poi"
    },
    layout: {
        "icon-image": ["concat", ["get", "icon"], "-15"],
        "text-field": ["get", "title"],
        "text-font": ["DIN Pro Regular"],
        "text-offset": [0, 0.6],
        "text-anchor": "top",
        "text-size": 12,
        "text-max-width": 7
    }
};

class MapPois extends React.Component {

    constructor(props){
        super(props);

        this.onCorePOIPressed = this.onCorePOIPressed.bind(this);
    }

    onCorePOIPressed(e) {
        var bbox = [
            [e.point.x - 5, e.point.y - 5],
            [e.point.x + 5, e.point.y + 5]
        ];
        var features = e.target.queryRenderedFeatures(bbox, {
            layers: ['important_sailing_pois_layer']
        });

        if(features[0].properties.place_id === undefined){ return; }
        this.props.history.push("/place/"+features[0].properties.place_id);
    }

    render() {
        return (
            <>
                <Source id="important_sailing_pois" geoJsonSource={poi_markers.source} />
                <Layer
                    id="important_sailing_pois_layer"
                    type="symbol"
                    layout={poi_markers.layout}
                    sourceId="important_sailing_pois"
                    minZoom={12}
                    onClick={this.onCorePOIPressed}
                />
            </>
        )
    }

}

export default withRouter(MapPois);
