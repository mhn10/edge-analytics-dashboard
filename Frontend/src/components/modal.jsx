import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useSpring, animated } from "react-spring";
import DashboardContext from "../context/dashboardContext";
import axios from "axios";
import ResponsivePieComponent from "../components/donut";
const { CONSTANTS } = require("../Constants");

const Modals = props => {
    const context = React.useContext(DashboardContext);
    const animatedProps = useSpring({ opacity: 1, from: { opacity: 0 } });

    const [nodeDetails, setNodeDetails] = useState({});
    const [memPie, setMemPie] = useState([]);
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
                setMemPie([{
                    "id" : "memoryUtil",
                    "label" : "memory Utilized",
                    "value" : data.memory_used,
                    "color": "hsl(6, 70%, 50%)"
                },
                {
                    "id" : "memoryFree",
                    "label" : "memory Free",
                    "value" : data.memory_available,
                    "color": "hsl(7, 70%, 50%)"
                }
            ])
            })
            .catch(error => {
                console.log("Error in useEffect nameAdd", error);
                alert("Reload page");
            });
    }, []);
    const closeHandler = () => {
        context.dispatch({ type: "changeState", value: false });
    };
    console.log("Modal page", context);

    return (
        <Modal style={animatedProps} onClick={closeHandler}>
          <DonutApp>


          <ResponsivePieComponent data={[{
                    "id" : "memoryUtil",
                    "label" : "memory Utilized",
                    "value" : nodeDetails.memory_used,
                    "color": "hsl(6, 70%, 50%)"
                },
                {
                    "id" : "memoryFree",
                    "label" : "memory Free",
                    "value" : nodeDetails.memory_available,
                    "color": "hsl(7, 70%, 50%)"
                }
            ]} />
            </DonutApp>
            <div className="modal-content">
                <div
                    style={{ textAlign: "right", color: "grey" }}
                    onClick={closeHandler}
                >
                    {" "}
                    X{" "}
                </div>
                {context.dashboardState.value}
                {console.log("TCL: dashboardState", nodeDetails.Aarchitecture)}
                <div>{nodeDetails.Aarchitecture}</div>

                <div>
                <Meta>
                {nodeDetails.IP}:{nodeDetails.Port}
                </Meta>
                </div>
                <div>{nodeDetails.OS}</div>
                <div>{nodeDetails.OS_Version}</div>
 
                <div>{nodeDetails.cpu_count}</div>
                <div>{nodeDetails.cpu_percent}</div>

                <div>{nodeDetails.memory_available}</div>
                <div>{nodeDetails.memory_used}</div>
                <div>{nodeDetails.total_memory}</div>
                asdf
{console.log("data to render", memPie)}
              
             
            </div>
        </Modal>
    );
};

export default Modals;

const Modal = styled(animated.div)`
    position: absolute;
    margin-top: 65px;
    left: 0;
    top: 0;
    /* width: 100%; */
    /* height: 100%; */

    /* transform: scale(1.0); */
    .modal-content {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background-color: white;
        box-shadow: 0px 30px 100px -10px rgba(0, 0, 0, 0.4);
        /* box-shadow: 0 8px 16px 0 rgba(0, 0, 0, 0.2); */
        /* transform: scale(0.9); */
        /* opacity: 0.6; */
        padding: 1rem 1.5rem;
        width: 24rem;
        border-radius: 0.5rem;
    }
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


const DonutApp = styled.div`
    position: fixed;
    top: 10px;
    right: 0;
    bottom: 0;
    left: 15%;
    height: 100%;
    width: 100%;
    z-index: 100;
`;