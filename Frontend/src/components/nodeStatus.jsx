import React, { useState, useEffect } from "react";
import axios from "axios";

import { css } from "@emotion/core";
import { RingLoader } from "react-spinners";
import ReactEventSource from "react-eventsource";
const { CONSTANTS } = require("../Constants");

const override = css`
    display: block;
    margin: 0 auto;
    border-color: red;
`;

const NodeStatus = props => {
    // const eventStreamer = () => {
    //     console.log("fetch Task here");
    //     const eventsource = new EventSource('http://localhost:5000/demo');
    //     eventsource.onmessage = e => {
    //         console.log("e data ", e.data);
    //     };
    // };

    // useEffect(() => {
    //     console.log("fetch Task here");
    //     eventStreamer();
    //     // axios
    //     //     .get(`${CONSTANTS.NODE_STATUS}/demo`, {
    //     //         headers: {
    //     //             "Mime-Type": "text/plain",
    //     //             "Content-Type": "text/event-stream"
    //     //         }
    //     //     })
    //     //     .then(response => {
    //     //         console.log("Response taskdetails", response);
    //     //         //create option map to setDeafultoption
    //     //     })
    //     //     .catch(error => {
    //     //         console.log("Error in useEffect nameAdd", error);
    //     //         alert("Reload page");
    //     //     });
    // }, []);

    // const renderEvent = event => <div>{ event }</div>
    return (
        <div style={{ textAlign: "left" }}>
            {/* <ReactEventSource url="http://localhost:5000/demo">
        
              {events => events.map(renderEvent) }
            </ReactEventSource>
            Loader Comp */}
            <RingLoader
                css={override}
                sizeUnit={"px"}
                size={30}
                color={"#1edbed"}
                loading={true}
            />
        </div>
    );
};

export default NodeStatus;
