import * as React from "react";
import AddContext from "../context/addContext";
import styled from "styled-components";
import axios from "axios";

// import Button from "react-bootstrap/Button";

const SubmitAdd = props => {
  const context = React.useContext(AddContext);
  // const {} = context
  console.log("All context is ", context, "ADDState is: ", context.addState);

  const clickHandler = event => {
    console.log("Button Clicked");
    event.preventDefault();
    const formData = new FormData();
    const {name, type, username, requirement, data, input, code, model} = context.addState
    formData.append("taskname", name);
    formData.append("type", type);
    formData.append("username", username);
    formData.append("requirement", requirement);
    formData.append("data", data);
    formData.append("input", input);
    formData.append("code", code);
    formData.append("model", model);

    console.log("FormData before upload ", formData);
    axios.post(`http://localhost:3001/uploadfile`, formData, {
      headers: {
        "Content-Type": "multipart/form-data"
      }
    })
    .then(response => {
      console.log("data upload success", response);

    })
    .catch( error => {
      console.log("error", error);
    })




  };
  return (
    <SubmitWrapper>
      {/* <section className="page-content"> */}
      {/* <PageHeader title={'Review All the Details'} /> */}
      <div>
        <h3>TASK</h3>
        <label>Name :</label>
        <span className="item-name" style={{ margin: "1rem 0" }}>
          {context.addState.name}
        </span>
        <div />
        <label>Type of Task :</label>
        <span className="item-name" style={{ margin: "1rem 0" }}>
          {context.addState.type}
        </span>
        <div />
        <label>Model :</label>
        <span className="item-name" style={{ margin: "1rem 0" }}>
          {context.addState.model.name}
        </span>
        <div />
        <label>Input :</label>
        <span className="item-name" style={{ margin: "1rem 0" }}>
          {context.addState.input.name}
        </span>
        <div />
        <label>Data :</label>
        <span className="item-name" style={{ margin: "1rem 0" }}>
          {context.addState.data.name}
        </span>
        <div />
        <label>Code :</label>
        <span className="item-name" style={{ margin: "1rem 0" }}>
          {context.addState.code.name}
        </span>
        <div />
        <label>Requirement :</label>
        <span className="item-name" style={{ margin: "1rem 0" }}>
          {context.addState.requirement.name}
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
      {/* <div classname="item-name">Under Construction...</div> */}
      {/* </section> */}
    </SubmitWrapper>
  );
};

export default SubmitAdd;

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
  outline: none ;
  color: #2196f3;
  font-size: 1.5rem;
  cursor: pointer;
  float: right;

`;