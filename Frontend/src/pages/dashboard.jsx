import React, { useState, useEffect } from "react";
import { withRouter } from "react-router-dom";
import styled from "styled-components";
// import LoginNavbar from "../components/Navbar/loginnavbar";
import Navbar from "../components/Navbar/navbar";
import axios from "axios";

import Cards from "../components/card";
import Modals from "../components/modal";
import NodeDetailsComponent from "../fragments/nodeDetails";

import DashboardContext from "../context/dashboardContext";

const { CONSTANTS } = require("../Constants");

const reducer = (state, action) => {
    const { type } = action;

    switch (type) {
        case "changeState":
            return { ...state, show: action.value };

        case "toggleState":
            return {
                ...state,
                step: state.show ? false : true
            };

        case "setValue":
            return { ...state, value: action.NodeValue };
        case "setLatitude":
            return { ...state, lat: action.latitude };
        case "setLongitude":
            return { ...state, lng: action.longitude };

        case "setUsername":
            return { ...state, username: action.email };

        default:
            return state;
    }
};

const Dashboard = ({ props }) => {
    const [nodes, setNodes] = React.useState([{IP: "73.92.205.40", Name: "Jetson2", Port: 7946},{IP: "74.93.105.30", Name: "Jetson3", Port: 7946},{IP: "190.92.150.32", Name: "Jetson4", Port: 7946},{IP: "73.92.205.22", Name: "Jetson5", Port: 7946}]);
    const [dashboardState, dispatch] = React.useReducer(reducer, {
        username: "",
        value: "",
        lat: "",
        lng: "",

        show: false
    });

    useEffect(() => {
        console.log("fetch data here");

        axios
            .get(`${CONSTANTS.BACKEND_URL}/activenodes`)
            .then(response => {
                console.log("Response node details", response.data.Active);
                const {Active} = response.data;
				console.log("TCL: Dashboard -> Active", Active)
                Array.prototype.push.apply(Active,nodes); 
                //create option map to setDeafultoption
                setNodes(Active);
            })
            .catch(error => {
                console.log("Error in useEffect nameAdd", error);
                alert("No Data available, reload");
            });
    }, []);

    const nodeCards = nodes.map((node, key) => {
        console.log("Node details : Nodekey: ", node, "Key", key);
        return (
            <Cards
                IP={node.IP}
                Value={node.Name}
                Name={node.Name}
                Port={node.Port}
            />
        );
    });

    return (
        <>
            {/* <LoginNavbar /> */}
            <DashboardContext.Provider value={{ dashboardState, dispatch }}>
                <Navbar />

                {/* <GridContainer> */}
                <Wrapper>
                    {/* <section className="page-content"> */}
                    {dashboardState.show === false && nodeCards}
                </Wrapper>
                {/* </section> */}
                {dashboardState.show === true && <NodeDetailsComponent />}

                {/* </GridContainer> */}
            </DashboardContext.Provider>
        </>
    );
};

export default withRouter(Dashboard);

const Wrapper = styled.div`
    box-sizing: border-box;
    padding: 1rem;
    margin-left: 2rem;
    margin-right: 2rem;
    background-color: #fff;
    color: #444;
    margin-top: 50px;
    border-radius: 18px;

    /* Grid styles */
    display: grid;
    align-items: center;
    justify-content: center;
    justify-items: center;

    grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));

    grid-gap: 1rem;
    @media only screen and (min-width: 900px) {
        grid-template-columns: repeat(3, minmax(240px, 1fr));
        padding-left: 3rem;
        padding-right: 3rem;
        margin-left: 10%;
        margin-right: 10%;
        margin-top: 60px;
    }
    @media only screen and (min-width: 1400px) {
        padding-left: 3rem;
        padding-right: 3rem;
        margin-left: 20%;
        margin-right: 20%;
        margin-top: 70px;
    }
`;

const Element = styled.div`
    grid-template-columns: repeat(4, 1fr);

    grid-template-rows: repeat(2, 300px);
`;

const GridContainer = styled.div`
    padding: 1rem;
    display: grid;

    margin: 1rem;
    /* grid-template-columns: repeat(5, 1fr);
    grid-template-rows: repeat(5, 1fr); */

    grid-template-columns: repeat(3, 1fr);
    grid-template-rows: repeat(3, 1fr);
    justify-content: center;
    grid-gap: 1rem;

    /* grid-column: 2/4; */
    /* .page-content {
        display: grid;
        grid-column: 2/3;
    } */

    /* @media screen and (min-width: 992px) {
        margin-top: 0;
        grid-template-columns: repeat(5, 1fr);
        grid-template-rows: repeat(5, 200px);
        .page-content {
            display: grid;
            grid-column: 2/4;
        }
    } */
`;
