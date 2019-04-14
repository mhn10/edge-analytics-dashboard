import * as React from "react";
import { PageHeader, PageWrapper } from "../components/Page";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import AddContext from "../context/addContext";

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
    <PageWrapper>
      <section className="page-content">
        <Form onSubmit={e => submitHandler(e)}>
          <Form.Group className="row">
            <Form.Label>Name of Task</Form.Label>
            <Form.Control    type="text" placeholder={taskName}   onChange={e => setName(e.target.value)} required="true" />
            <Form.Text className="text-muted">
              Must be unique identifier
            </Form.Text>
          </Form.Group>

          
          <Button variant="primary" type="submit">
            Submit
          </Button>
        </Form>
      </section>
    </PageWrapper>
  );
};

export default NamesAdd;
