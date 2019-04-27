import * as React from "react";

const dashboardContext = {
    username: "",
    value : "",

    show : false,

    dispatch: action => action
};

export default React.createContext(dashboardContext);