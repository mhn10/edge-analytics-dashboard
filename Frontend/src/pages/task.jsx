import * as React from "react";
import { withRouter } from "react-router-dom";
import styled from "styled-components";
import LoginNavbar from "../components/Navbar/loginnavbar";

// import AddContext from "../context/addContext";
import { PageWrapper } from "../components/Page";
import MyTable from "../components/table";
import Deploy from "../fragments/deploy";

import TaskContext from "../context/taskContext";

const reducer = (state, action) => {
    const { type } = action;

    switch (type) {
        case "changeState":
            return { ...state, step: action.value };

        case "incrementState":
            return {
                ...state,
                step: state.step < 4 ? state.step + 1 : state.step
            };
        case "decrementState":
            return {
                ...state,
                step: state.step > 1 ? state.step - 1 : state.step
            };
        case "setUsername":
            return { ...state, username: action.email };
        case "setName":
            return { ...state, name: action.name };
        case "setModel":
            return { ...state, model: action.model };
        case "setTimeStamp":
            return { ...state, timeStamp: action.timeStamp };
        case "setRequirement":
            return { ...state, requirement: action.requirement };
        case "setData":
            return { ...state, data: action.data };
        case "setCode":
            return { ...state, code: action.code };
        case "setInput":
            return { ...state, input: action.input };
        case "setType":
            return { ...state, type: action.actionType };
        case "setNode":
            return { ...state, node: action.value };
        case "setWebcam":
            return { ...state, webcam: action.webcam };
        default:
            return state;
    }
};

const TaskPage = ({ props }) => {
    const [taskState, dispatch] = React.useReducer(reducer, {
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
        node : "none",
        webcam : "false",
        step: 1
    });
    const incrementState = () => {
        dispatch({ type: "incrementState" });
        console.log(taskState);
    };

    const decrementState = () => {
        dispatch({ type: "decrementState" });
        console.log(taskState);
    };

    return (
        <>
            <LoginNavbar />
            <BodyWrapper>
                <PageWrapper>
                    <section className="page-content">
                        <TaskContext.Provider value={{ taskState, dispatch }}>
                            <AddDetailsWrapper>
                                {taskState.step > 1 && (
                                    <Button
                                        label={"Previous Step"}
                                        onClick={decrementState}
                                    >
                                        Previous Step
                                    </Button>
                                )}
                                {taskState.step < 3 && taskState.step > 1 && (
                                    <Button
                                        className="next-step"
                                        label={"Next Step"}
                                        onClick={incrementState}
                                    >
                                        Next Step
                                    </Button>
                                )}

                                {taskState.step === 1 && <MyTable />}
                                {taskState.step === 2 && <Deploy />}

                            </AddDetailsWrapper>
                        </TaskContext.Provider>
                    </section>
                </PageWrapper>
            </BodyWrapper>
        </>
    );
};

export default withRouter(TaskPage);

const Button = styled.button`
    background-color: transparent;
    background-repeat: no-repeat;
    padding: 1rem;
    border: none;
    overflow: hidden;
    outline: none;
    color: #2196f3;
    font-size: 1.2rem;
    cursor: pointer;

    &.next-step {
        float: right;
    }
`;

const AddDetailsWrapper = styled.div`
    background: white;
    border: 2px solid #f8f8f8;
    margin-top: 2rem;
    margin-left: 2rem;
    padding: 2rem;
    box-sizing: border-box;
    border-radius: 10px;
    color: #606060;
`;

const BodyWrapper = styled.div`
    padding: 1rem;
    display: grid;
    margin-top: 70px;
    @media screen and (min-width: 992px) {
        margin-top: 0;
        .page-content {
            display: grid;
            grid-template-columns: 1fr minmax(63%, 1fr) 1fr;
        }

        .page-content > h1,
        .page-content > div {
            grid-column: 2/3;
        }
    }
`;
