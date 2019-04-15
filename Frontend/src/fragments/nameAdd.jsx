import * as React from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import AddContext from "../context/addContext";
import styled from "styled-components";

const NamesAdd = props => {
 
  const context = React.useContext(AddContext);

  const [taskName, setName] = React.useState("");
//   console.log("present state", context.dispatch({type: "getName"}));

  const submitHandler = values => {
	  console.log("Values, ", taskName );
	  setName(taskName);
    context.dispatch({ type: "setName", taskName });
    context.dispatch({ type: "changeState", value: 2 });
  };
  return (
    <NameWrapper>

        <Form onSubmit={e => submitHandler(e)}>
          <Form.Group className="row">
            <Form.Label>Name of Task</Form.Label>
            <Form.Control    type="text" placeholder={taskName}   onChange={e => setName(e.target.value)} required="true" />
            <Form.Text className="text-muted">
              Must be unique identifier
            </Form.Text>
          </Form.Group>

          
          <Button variant="primary" type="submit">
            Next
          </Button>
        </Form>

    </ NameWrapper>
  );
};

export default NamesAdd;



const NameWrapper = styled.div`
  background: white;
  border: 2px solid #f8f8f8;
  margin-top: 2rem;
  padding: 2rem;
  box-sizing: border-box;
  border-radius: 10px;
  color: #606060;
  /* font-size: 1.2rem; */
  text-align: center;

  .item-name {
    font-size: 1rem;
    /* text-transform: uppercase; */
    color: #008fda;
    font-weight: lighter;
    text-align: center;
  }
`;
