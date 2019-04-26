import * as React from "react";
import { withRouter } from "react-router-dom";
import styled from "styled-components";
// import LoginNavbar from "../components/Navbar/loginnavbar";
import Navbar from "../components/Navbar/navbar";

import Cards from "../components/card";

const Dashboard = ({ props }) => {
    return (
        <>
            {/* <LoginNavbar /> */}
			<Navbar/>
            <Wrapper>
                {/* <GridContainer> */}

                {/* <section className="page-content"> */}
                <Cards />
                <Cards />
                <Cards />
                <Cards />
                <Cards />
                <Cards />
                <Cards />
                <Cards />
                <Cards />
                <Cards />
                {/* </section> */}

                {/* </GridContainer> */}
            </Wrapper>
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
    margin-top: 10px;
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
    }
    @media only screen and (min-width: 1400px) {
        padding-left: 3rem;
        padding-right: 3rem;
        margin-left: 20%;
        margin-right: 20%;
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
