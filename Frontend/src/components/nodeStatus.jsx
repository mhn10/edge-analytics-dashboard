import React, {useState, useEffect} from 'react'
import axios from "axios";

import { css } from '@emotion/core';
import { DotLoader } from 'react-spinners';
const { CONSTANTS } = require("../Constants");



const override = css`
    display: block;
    margin: 0 auto;
    border-color: red;
`;

const NodeStatus = props => {



    // useEffect(() => {
    //     console.log("fetch Task here");
    //     axios
    //         .get(`${CONSTANTS.NODE_STATUS}/updates/kaikai/task7`,{headers: {
    //             'Access-Control-Allow-Origin': '*',
    //             'Content-Type': 'application/json',
    //           }})
    //         .then(response => {
    //             console.log("Response taskdetails", response);
    //             //create option map to setDeafultoption
               
    //         })
    //         .catch(error => {
    //             console.log("Error in useEffect nameAdd", error);
    //             alert("Reload page");
    //         });
    // }, []);

    return (


        <div style={{textAlign:"left"}}>

            Loader Comp 
            <DotLoader
          css={override}
          sizeUnit={"px"}
          size={60}
          color={'#007bff'}
          loading={true}
        />
          </div>  
    )



}

export default NodeStatus;