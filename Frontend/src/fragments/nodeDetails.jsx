import React, { useEffect, useState } from "react";
import { withRouter } from "react-router-dom";
import DashboardContext from "../context/dashboardContext";
import styled from "styled-components";
import axios from "axios";
import ResponsivePieComponent from "../components/donut";
import { PageWrapper } from "../components/Page";
import { BodyWrapper } from "../pages/add";

import { useSpring, animated, config } from "react-spring";
// import Button from "react-bootstrap/Button";
const { CONSTANTS } = require("../Constants");

const NodeDetailsComponent = props => {
    const context = React.useContext(DashboardContext);
    // const {} = context
    console.log("All context is ", context, "ADDState is: ", context.addState);
    const animatedProps = useSpring({
        opacity: 1,
        marginRight: 0,
        config: config.default,
        from: { opacity: 0, marginRight: -200 }
    });

    const [nodeDetails, setNodeDetails] = useState({});
    const [memPie, setMemPie] = useState([]);
    const [cpuPie, setCpuPie] = useState([]);
    useEffect(() => {
        console.log("fetch Task here");
        axios
            .get(`${CONSTANTS.BACKEND_URL}/nodedetail`, {
                params: {
                    nodeId: context.dashboardState.value
                }
            })
            .then(response => {
                console.log("Response taskdetails", response.data);
                //create option map to setDeafultoption
                const { data } = response;
                console.log("TCL: data", data);

                setNodeDetails(data);
                setMemPie([
                    {
                        id: "memoryUtil",
                        label: "memory Utilized",
                        value: data.memory_used,
                        color: "hsl(6, 70%, 50%)"
                    },
                    {
                        id: "memoryFree",
                        label: "memory Free",
                        value: data.memory_available,
                        color: "hsl(7, 70%, 50%)"
                    }
                ]);

                setCpuPie([
                    {
                        id: "cpuUtil",
                        label: "CPU Utilized",
                        value: data.cpu_percent,
                        color: "hsl(35, 70%, 50%)"
                    },
                    {
                        id: "cpuFree",
                        label: "CPU Free",
                        value: 100 - data.cpu_percent,
                        color: "hsl(7, 70%, 50%)"
                    }
                ]);
            })
            .catch(error => {
                console.log("Error in useEffect nameAdd", error);
                alert("Reload page");
            });
    }, []);
    const closeHandler = () => {
        context.dispatch({ type: "changeState", value: false });
    };

    return (
        // <PageWrapper>
        //     <section className="page-content">
        <SubmitWrapper>
            {/* <section className="page-content"> */}
            {/* <PageHeader title={'Review All the Details'} /> */}
            <animated.div style={animatedProps}>
                <div>
                    <div
                        style={{
                            textAlign: "right",
                            color: "grey",
                            fontSize: "2rem"
                        }}
                        onClick={closeHandler}
                    >
                        X
                    </div>
                    <h3>{context.dashboardState.value}</h3>
                    {console.log("TCL: dashboardState", nodeDetails)}
                    <div>{nodeDetails.Architecture}</div>
                    <div>
                        <Meta>
                            {nodeDetails.IP}:{nodeDetails.Port}
                        </Meta>
                    </div>
                    <div>
                        <label>OS :</label>
                        <span
                            className="item-name"
                            style={{ margin: "1rem 0" }}
                        >
                            {nodeDetails.os}
                        </span>
                    </div>
                    <div>
                        <label>OS Version:</label>
                        <span
                            className="item-name"
                            style={{ margin: "1rem 0" }}
                        >
                          {nodeDetails.os_version}
                        </span>
                    </div>
                    <div>
                        <label>CPU core count:</label>
                        <span
                            className="item-name"
                            style={{ margin: "1rem 0" }}
                        >
                        {nodeDetails.cpu_count}
                        </span>
                    </div>
                
               
                    <div>
                        <label>Total Memory Available</label>
                        <span
                            className="item-name"
                            style={{ margin: "1rem 0" }}
                        >
                        {nodeDetails.total_memory}
                        </span>
                    </div>
         

                    <div style={{ height: 200 }}>
                        <ResponsivePieComponent data={memPie} />
                    </div>
                    <div style={{ height: 200 }}>
                        <ResponsivePieComponent data={cpuPie} />
                    </div>
                    {/* <div style={{ height: 400 }}>
                        <Flex>
                            <div className="chart">
                            <ResponsivePieComponent data={memPie} />
                            </div>
                          
                            <div className="chart">
                            <ResponsivePieComponent data={cpuPie} />
                            </div>

                          
                        </Flex>
                    </div> */}
                </div>
            </animated.div>
        </SubmitWrapper>
        //  </section>
        // </PageWrapper>
    );
};

export default withRouter(NodeDetailsComponent);

const SubmitWrapper = styled.div`
    background: white;
    border: 2px solid #f8f8f8;
    margin-top: 2rem;
    padding: 2rem;
    box-sizing: border-box;
    border-radius: 10px;
    color: #606060;
    /* font-size: 1.2rem; */
    text-align: center;

    h3 {
        /* font-weight: lighter; */
        color: #c3cde7;
        font-size: 2rem;
        text-align: center;
    }

    .item-name {
        font-size: 1rem;
        /* text-transform: uppercase; */
        color: #008fda;
        font-weight: lighter;
        text-align: center;
    }
`;

const Button = styled.button`
    background-color: transparent;
    background-repeat: no-repeat;
    padding: 2rem;
    margin: 1rem;
    border: 1px;
    overflow: hidden;
    outline: none;
    color: #2196f3;
    font-size: 1.5rem;
    cursor: pointer;
    float: right;
`;

const Meta = styled.div`
    padding: 0.2rem 1rem;
    background: #eff3fa;
    border-radius: 50px;
    color: #b2bddc;
    text-transform: uppercase;
    margin-bottom: 2rem;
    display: inline-block;
    font-weight: 400;
`;

const Flex = styled.div`
    display: flex;
    flex-wrap: wrap;
    height: 300;
    .chart {
        flex: 0 0 50%;

        padding: 10px;
    }
`;
