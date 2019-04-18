import * as React from "react";
import { withRouter } from "react-router-dom";
import styled from "styled-components";

import AddContext from "../context/addContext";
import { PageWrapper } from "../components/Page";
import Navbar from "../components/Navbar/navbar";
import NamesAdd from "../fragments/nameAdd";
import InputAddRegression from "../fragments/inputAddRegression";
import InputAddClassification from "../fragments/inputAddClassification";

import TypeAdd from "../fragments/typeAdd";
import SubmitAdd from "../fragments/submitAdd";
import Wizard from "../fragments/wizard";
import Cards from "../components/card";

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

        case "setName":
            console.log("name: ", action.values);
            return { ...state, name: action.values };

        // case "getName":
        // 	return  {name: state.name} ;

        case "setUsername":
            return { ...state, username: action.value };

        case "setRequirement":
            return { ...state, requirement: action.reqfile };

        case "setType":
            return { ...state, type: action.value };

        case "setModel":
            return { ...state, model: action.modelfile };

        case "setData":
            return { ...state, data: action.datafile };

        case "setInput":
            return { ...state, input: action.inputfile };

        case "setResult":
            return { ...state, result: action.value };

        case "setCode":
            return { ...state, code: action.codefile };

        default:
            return state;
    }
};

const AddPage = ({ props }) => {
    const [addState, dispatch] = React.useReducer(reducer, {
        name: "",
        username: "",
        type: "",
        requirement: "",
        data: "",
        input: "",
        result: "",
        code: "",
        model: "",
        step: 1
    });
    const incrementState = () => {
        dispatch({ type: "incrementState" });
        console.log(addState);
    };

    const decrementState = () => {
        dispatch({ type: "decrementState" });
        console.log(addState);
    };

    return (
        <>
            <Navbar />
            <BodyWrapper>
                <PageWrapper>
                    <section className="page-content">
                        <AddContext.Provider value={{ addState, dispatch }}>
                            {
                                <AddDetailsWrapper>
                                    {addState.step > 1 && (
                                        <Button
                                            label={"Previous Step"}
                                            onClick={decrementState}
                                        >
                                            Previous Step
                                        </Button>
                                    )}
                                    {addState.step < 4 && addState.step > 1 && (
                                        <Button
                                            className="next-step"
                                            label={"Next Step"}
                                            onClick={incrementState}
                                        >
                                            Next Step
                                        </Button>
                                    )}
                                    <Wizard />
                                    {addState.step === 1 && <NamesAdd />}
                                    {addState.step === 2 && <TypeAdd />}
                                    {addState.step === 3 &&
                                        addState.type === "classification" && (
                                            <InputAddClassification />
                                        )}
                                    {addState.step === 3 &&
                                        addState.type === "regression" && (
                                            <InputAddRegression />
                                        )}
                                    {addState.step === 4 && <SubmitAdd />}
                                    {/* <Cards /> */}
                                </AddDetailsWrapper>
                            }
                        </AddContext.Provider>
                    </section>
                </PageWrapper>
            </BodyWrapper>
        </>
    );
};

export default withRouter(AddPage);

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
