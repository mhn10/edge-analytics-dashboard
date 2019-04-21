import * as React from "react";
import { withRouter } from "react-router-dom";
import styled from "styled-components";
import LoginNavbar from "../components/Navbar/loginnavbar";

// import AddContext from "../context/addContext";
import { PageWrapper } from "../components/Page";
import NamesAdd from "../fragments/nameAdd";
import MyTable from "../components/table";

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



        default:
            return state;
    }
};

const TaskPage = ({ props }) => {
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
            <LoginNavbar />
            <BodyWrapper>
                <PageWrapper>
                    <section className="page-content">
                    <AddDetailsWrapper>
<MyTable />
 </AddDetailsWrapper>
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
