import * as React from "react";

const taskContext = {
    username: "",
    classification: [{
        name: "",
        requirement: "",
        data: "",
        input: "",
        result: "",
        code: "",
        model: "",
        timeStamp:""
    }],
    regression : [{
        name: "",
        requirement: "",
        data: "",
        input: "",
        result: "",
        code: "",
        timeStamp:""
    }],
    step: 1,

    dispatch: action => action
};

export default React.createContext(taskContext);
