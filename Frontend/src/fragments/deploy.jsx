import * as React from "react";
import { withRouter } from "react-router-dom";
import TaskContext from "../context/taskContext";
import styled from "styled-components";
import axios from "axios";

// import Button from "react-bootstrap/Button";

const Deploy = props => {
    const context = React.useContext(TaskContext);
    // const {} = context
    console.log("All context is ", context);

    const clickHandler = event => {
        console.log("Button Clicked");

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
                    {context.taskState.data}
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
                <Button
                    as="input"
                    type="submit"
                    value="Submit"
                    onClick={clickHandler}
                    //   style={{position:'inherit', right : '0'}}
                />
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
