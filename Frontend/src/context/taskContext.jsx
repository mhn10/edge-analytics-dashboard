import * as React from "react";

const taskContext = {
    username: "",

    name: "",
    type: "",
    requirement: "",
    data: "",
    input: "",
    result: "",
    code: "",
    model: "",
    timeStamp: "",
    node: "none",
    webcam : "false",

    step: 1,

    dispatch: action => action
};

export default React.createContext(taskContext);
