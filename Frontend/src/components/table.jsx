import { useState, useEffect } from "react";
import styled from "styled-components";
import Moment from 'react-moment';
import React from "react";

const MyTable = () => {
    useEffect(async () => {
        console.log("fetch data here");
        //setData();
    }, []);
    const [files] = useState([
        {
            name: "ttt",
            requirement: "req",
            code: "code",
            data: "data",
            input: "i/p",
            result: "result output",
            timeStamp: {
                date: "2019-04-21T06:33:04.382Z"
            }
        },
        {
            name: "sss",
            timeStamp: {
                date: "2019-04-21T07:58:51.715Z"
            },
            requirement: "requirements12.txt",
            code: "code123.py",
            model: "Constants.txt",
            data: "fileapi.json",
            input: "adminer.php",
            result: "2nd result"
        }
    ]);

    const [expandedRows, setExpandedRows] = useState([]);
const [buttonToggle, setButtonToggle] = useState(false);
    const handleExpand = (file, key) => {
        console.log(
            "Handle Exapnd ",
            file,
            " -- Key-- ",
            key,
            "File.name is ",
            file.name
        );
        let newExpandedRows = [...expandedRows];
        let idxFound = newExpandedRows.findIndex(name => {
            return name === file.name;
        });
        console.log("IDXfound, ", idxFound);
        if (idxFound > -1) {
            console.log("Collapsing " + file.name + " " + idxFound);
            newExpandedRows.splice(idxFound, 1);
        } else {
            console.log("Expanding " + file.name);
            newExpandedRows.push(file.name);
        }

        console.log("Expanded rows");
        console.log(newExpandedRows);
        setExpandedRows([...newExpandedRows]);
    };

    const isExpanded = (file, key) => {
        const idx = expandedRows.find(name => {
            return name === file.name;
        });

        return idx;
    };

    const expandAll = files => {
        console.log("ExapndedRows: " + expandedRows.length);
        console.log("Players:      " + files.length);
        if (expandedRows.length === files.length) {
            let newExpandedRows = [];
            setExpandedRows([]);

            console.log("Collapsing all...");
        } else {
            let newExpandedRows = files.map(file => file.name);
            setExpandedRows([...newExpandedRows]);
            console.log("Expanding all...");
            console.log("Expanded rows " + newExpandedRows.length);
        }
    };

    const getRows = (file, key) => {
        let rows = [];

        const firstRow = (
            <tr onClick={() => handleExpand(file, key)}>
                <td>
                    <Button>{isExpanded(file, key) ? "-" : "+"}</Button>
                </td>
                <td>{file.name}</td>
                <td><Moment>{file.timeStamp.date}</Moment></td>
                <td>{file.data}</td>
                <td></td>
            </tr>
        );

        rows.push(firstRow);

        if (isExpanded(file, key)) {
            const detailRow = (
                <tr className="player-details">
                    <td colspan="4" className="player-details">
                        <br />
                        <div className="attribute">
                            <div className="attribute-name">Requirement: </div>
                            <div className="attribute-value">{file.requirement}</div>
                        </div>
                        <br />
                        <div className="attribute">
                            <div className="attribute-name">code: </div>
                            <div className="attribute-value">{file.code}</div>
                        </div>
                        <br />
                        <div className="attribute">
                            <div class="attribute-name">Input: </div>
                            <div className="attribute-value">{file.input}</div>
                        </div>
                        <br />
                        {/* <div className="attribute">
                            <div class="attribute-name">Output: </div>
                            <div className="attribute-value">{file.result}</div>
                        </div>
                        <br /> */}
                    </td>
                </tr>
            );
            rows.push(detailRow);
        }

        return rows;
    };

    const getFileData = files => {
        const playerRows = files.map((file, key) => {
            console.log("playerwors : Player: ", file, "Key", key);
            return getRows(file, key);
        });

        return (
            <table className="my-table">
                <tr>
                    <th onClick={() => expandAll(files)}>
                        <RoundButton status={buttonToggle} onClick={() => setButtonToggle(!buttonToggle)}>
                            {files.length === expandedRows.length ? "-" : "+"}
                        </RoundButton>
                    </th>
                    <th>Task Name</th>
                    <th>Uploaded</th>
                    <th>Data</th>
                    <th>Deploy</th>
                </tr>
                {playerRows}
            </table>
        );
    };

    return <div>{getFileData(files)}</div>;
};

export default MyTable;



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


const RoundButton = styled.button`
    background: ${(props) =>
			props.status === true ? '#c5d8d3':'#2196F3' };
    text-align: center;
    width: 35px;
    height: 35px;
    border-radius: 100%;
    border: 2px solid #f8f8f8;

    display: inline-flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    font-size: 0.5rem;
    color: #ffffff;
    font-weight: lighter;
    text-decoration: none;
    overflow: hidden;
    cursor: pointer;
    transition-duration: 0.4s;
    position: relative;

    &:hover {
        box-shadow: 0 8px 16px 0 rgba(0, 0, 0, 0.2);
    }
    &::after {
        content: "";
        background: #6effff;
        display: block;
        position: absolute;
        padding-top: 300%;
        padding-left: 350%;
        margin-left: -20px !important;
        margin-top: -120%;
        opacity: 0;
        transition: all 0.8s;
    }

    &:active:after {
        padding: 0;
        margin: 0;
        opacity: 1;
        transition: 0s;
    }

    @media screen and (min-width: 992px) {
        width: 40px;
        height: 40px;
        font-size: 1rem;
        font-weight: normal;
    }
`;
