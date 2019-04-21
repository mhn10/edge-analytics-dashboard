import { useState, useEffect } from "react";
import styled from "styled-components";

import React from 'react';

const MyTable = () => {

    const [players,setPlayers ]=  useState([

        {
          id: 10,
          firstName: "Earvin",
          lastName: "Johnson",
          college: "Michigan State",
          team: "LA Lakers",
          stats: {
            height: "6-9",
            weight: "215 lbs",
            position: "Shooting Guard"
          }
        },
        {
          id: 20,
          firstName: "Michael",
          lastName: "Jordan",
          college: "Michigan State",
          team: "Chicago Bulls",
          stats: {
            height: "6-6",
            weight: "195 lbs",
            position: "Small Forward"
          }
        },
        {
          id: 30,
          firstName: "Lebron",
          lastName: "James",
          college: "NA",
          team: "LA Lakers",
          stats: {
            height: "6-8",
            weight: "250 lbs",
            position: "Shooting Guard"
          }
        }
      ]);
    
    const [expandedRows, setExpandedRows] = useState([]);
 

  const handleExpand = (player) =>{
    let newExpandedRows = [...expandedRows];
    let idxFound = newExpandedRows.findIndex((id)=>{
        return id === player.id;
    });

    if(idxFound > -1){
        console.log("Collapsing " + player.firstName + " " + idxFound);
        newExpandedRows.splice(idxFound, 1);
    }
    else{
      console.log("Expanding " + player.firstName);
      newExpandedRows.push(player.id);
    }

    console.log("Expanded rows");
    console.log(newExpandedRows);
setExpandedRows([...newExpandedRows])
    // this.setState({expandedRows: [...newExpandedRows]});
  }

  const isExpanded = (player)=>{
    const idx = expandedRows.find(
      (id)=>{
        return id === player.id;
      }
    );

    return idx > -1;
  }

  const expandAll=(players)=>{
    console.log("ExapndedRows: " + expandedRows.length);
    console.log("Players:      " + players.length);
    if(expandedRows.length === players.length){

      let newExpandedRows = [];
      setExpandedRows([...newExpandedRows])

      console.log("Collapsing all...");
    }
    else{
      let newExpandedRows = players.map(
        player => player.id
      );
      setExpandedRows([...newExpandedRows])
      console.log("Expanding all...");
      console.log("Expanded rows " + newExpandedRows.length)
    }
  }

  const getRows = (player)=>{
    
    let rows = [];
    
    const firstRow = (
      <tr onClick={()=>handleExpand(player)}>
        <td >
        <button>
        {isExpanded(player) ? "-" : "+"}
        </button>
        </td>
        <td>{player.firstName}</td>
        <td>{player.lastName}</td>
        <td>{player.team}</td>
      </tr>
    )

    rows.push(firstRow);

    if(isExpanded(player)){
      const detailRow = (
          <tr className="player-details">
            <td colspan="4" className="player-details">
              <br/>
              <div className="attribute">
                <div className="attribute-name">Height: </div>
                <div className="attribute-value">{player.stats.height}</div>
              </div>
              <br/>
              <div className="attribute">
                <div className="attribute-name">Weight: </div>
                <div className="attribute-value">{player.stats.weight}</div>
              </div>
              <br/>
              <div className="attribute">
                <div class="attribute-name">College: </div>
                <div className="attribute-value">{player.college}</div>
              </div>
              <br/>
            </td>
          </tr>
        );
      rows.push(detailRow);
    }

    return rows;
  }

  const getPlayerTable = (players)=>{

    const playerRows = players.map((player)=>{
      return getRows(player);
    });

    return (
      <table className="my-table">
        <tr>
          <th onClick={()=>expandAll(players)}>
            <button >
             {players.length === expandedRows.length ? "-" : "+"} 
            </button>
        </th>
          <th>Firstname</th>
          <th>Lastname</th> 
          <th>Team</th>
        </tr>
        {playerRows}
      </table>
    );
  }

   return ( 
     <div>
       {getPlayerTable(players)}
     </div>
     ); 
  
}

export default MyTable;