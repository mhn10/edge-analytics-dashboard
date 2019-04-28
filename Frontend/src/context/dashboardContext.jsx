import * as React from "react";

const dashboardContext = {
    username: "",
    value: "",

    lat: "",
    lng: "",

    show: false,

    dispatch: action => action
};

export default React.createContext(dashboardContext);
