import React, { useEffect, useState } from "react";
import { withRouter } from "react-router-dom";
import TaskContext from "../context/taskContext";
import styled from "styled-components";
import axios from "axios";
import jwtDecode from "jwt-decode";

import Select from "react-select";
import NodeStatus from "../components/nodeStatus";
const { CONSTANTS } = require("../Constants");

// import Button from "react-bootstrap/Button";

const Deploy = props => {
    const context = React.useContext(TaskContext);
    const [defaultOption, setDefaultOption] = useState([
        { label: "Any Node", value: "none" }
    ]);
    const [value, setValue] = useState("");
    const [loading, setLoading] = useState(false);
    // const {} = context
    console.log("All context is ", context);

    useEffect(() => {
        console.log("fetch Task here");

        axios
            .get(`${CONSTANTS.BACKEND_URL}/activenodes`)
            .then(response => {
                console.log("Response nodedetails", response.data);
                //create option map to setDeafultoption
                const { data } = response;
                const {Active} = data;
                let result = Active.map(task => createOption(task));
                console.log("TCL: result", result);
                // console.log("Default options", result);
                setDefaultOption([...defaultOption, ...result]);
            })
            .catch(error => {
                console.log("Error in useEffect nameAdd", error);
                alert("Data fetch failed, reload");
            });
    }, []);
const loadingHandler = () =>{
    setTimeout(setLoading(true),4000)

}
    const clickHandler = event => {
        console.log("Deploy Clicked", context.taskState);
        const { firstName } = jwtDecode(localStorage.getItem("userToken"));
		console.log("TCL: firstName", firstName)
        const {username, name, type, webcam,node} = context.taskState;
        const data = { 
            "userName" : firstName.toLowerCase(), 
            "name": name,
            "type": type,
            "isCamera" : webcam,
            "node" : node
        }
        console.log("data body ", data);
        axios.post(`${CONSTANTS.BACKEND_URL}/runtask`,data)
        .then( response => {
        console.log("TCL: response", response);
        
        setLoading(true);
        //declare as a function so that it doesnt invoke first
        setTimeout(() => {context.dispatch({type : "changeState", value : 1})}, 110000);

        })
        .catch(error => {
            
			console.log("TCL: error", error)
        })



    };
    const createOption = label => ({
        label: label.Name,
        value: label.Name
    });

    const changeHandler = types => {
        const { value } = types;
        console.log("Values, ", value);
        context.dispatch({ type: "setNode", value });
        console.log("Context set", context);
        //   context.dispatch({ type: "changeState", value: 2 });
    };

    return (
        <SubmitWrapper>
            {/* <section className="page-content"> */}
            {/* <PageHeader title={'Review All the Details'} /> */}
            <div>
                <h3>TASK</h3>
                <label>Name :</label>
                <span className="item-name" style={{ margin: "1rem 0" }}>
                    {context.taskState.name}
                </span>
                <div />
                <label>Type of Task :</label>
                <span className="item-name" style={{ margin: "1rem 0" }}>
                    {context.taskState.type}
                </span>
                <div />
                <label>Model :</label>
                <span className="item-name" style={{ margin: "1rem 0" }}>
                    {context.taskState.model}
                </span>
                <div />
                <label>Input :</label>
                <span className="item-name" style={{ margin: "1rem 0" }}>
                {context.taskState.input}
                    
                </span>
                <div />
                <label>Data :</label>
                <span className="item-name" style={{ margin: "1rem 0" }}>
                {context.taskState.data === "" && (<React.Fragment> <input type="checkbox" id="LiveData" name="LiveData" value="True" checked={true}/> <label for="LiveData">Live Data</label> </React.Fragment>)}
                {context.taskState.data !== "" && context.taskState.data}
                </span>
                <div />
                <label>Code :</label>
                <span className="item-name" style={{ margin: "1rem 0" }}>
                    {context.taskState.code}
                </span>
                <div />
                <label>Requirement :</label>
                <span className="item-name" style={{ margin: "1rem 0" }}>
                    {context.taskState.requirement}
                </span>
                <div />
                <div style={{textAlign:"left"}}>select node to perform compute
                <Select
                    options={defaultOption}
                    onChange={changeHandler}
                    defaultValue={{ value: "none", label: "Any Node" }}
                />
                </div>
   
                <Button
                    as="input"
                    type="submit"
                    value="Submit"
                    onClick={clickHandler}
                    //   style={{position:'inherit', right : '0'}}
                />
                {/* <Button
                    as="loadingtester"
                    type="submit"
                    value="Submit"
                    onClick={loadingHandler}
                    //   style={{position:'inherit', right : '0'}}
                /> */}
                <div style={{marginTop: "4px"}}> 
                    {" "}
                    {loading && <NodeStatus />}
                </div>

            </div>
        </SubmitWrapper>
    );
};

export default withRouter(Deploy);

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
