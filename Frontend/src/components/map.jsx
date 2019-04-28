import React from "react";

import GoogleMapReact from "google-map-react";
import DashboardContext from "../context/dashboardContext";
import styled from "styled-components";

const MapPin = () => {
    return <GreatPlaceStyle>X</GreatPlaceStyle>;
};

const MappingComponent = () => {
    const context = React.useContext(DashboardContext);
    console.log("context is ", context);
    const defaultProps = {
        lat: context.dashboardState.lat,
        lng: context.dashboardState.lng
    };
    console.log("TCL: MappingComponent -> defaultprops", defaultProps);

    return (
        // Important! Always set the container height explicitly
        <div
            style={{
                height: "350px",
                width: "70%",
                marginLeft: "auto",
                marginRight: "auto"
            }}
        >
            <GoogleMapReact
                bootstrapURLKeys={{ key: process.env.REACT_APP_GOOGLE_API_KEY }}
                center={defaultProps}
                defaultZoom={15}
            >
                <MapPin />
            </GoogleMapReact>
        </div>
    );
};
export default MappingComponent;

const GreatPlaceStyle = styled.div`
    position: absolute;
    width: 30px;
    height: 30px;

    border: 3px solid grey;
    border-radius: 40px;
    background-color: white;
    text-align: center;
    color: #3f51b5;
    font-size: 0.6rem;
    font-weight: bold;
    padding: 4;
`;
