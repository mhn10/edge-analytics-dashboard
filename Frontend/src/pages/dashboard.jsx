import * as React from "react";
import { withRouter } from "react-router-dom";
import styled from "styled-components";
import LoginNavbar from "../components/Navbar/loginnavbar";

import Cards from "../components/card";

const Dashboard = ({ props }) => {
    return (
        <>
            <LoginNavbar />
            <Wrapper>

            <GridContainer>
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
            </GridContainer>
            </Wrapper>

        </>
    );
};

export default withRouter(Dashboard);

const Wrapper = styled.div`
    display : grid;
    margin-left:15rem;
    margin-right:15rem;
    background-color: #fff;
    color: #444;
    margin-top: 10px;
    border-radius: 18px;
`;

const GridContainer = styled.div`
    padding: 1rem;
    display: grid;
   
    margin: 1rem;
    grid-template-columns: repeat(5, 1fr);
    grid-template-rows: repeat(5, 1fr);
    justify-content: center;
    grid-gap: 15px;

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
