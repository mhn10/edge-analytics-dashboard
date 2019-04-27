import React from "react";

import GoogleMapReact from 'google-map-react';


const MappingComponent = () =>{
    const defaultProps = {
        center: {
           
          lat:  30.232790,
          lng: -97.838463
        },
        zoom: 15
      };

    return (
        // Important! Always set the container height explicitly
        <div style={{ height: '350px', width: '70%', marginLeft:"auto", marginRight:"auto" }}>
          <GoogleMapReact
            bootstrapURLKeys={{ key: process.env.REACT_APP_GOOGLE_API_KEY }}
            defaultCenter={defaultProps.center}
            defaultZoom={defaultProps.zoom}
          >

          </GoogleMapReact>
        </div>
      );

}
export default MappingComponent;