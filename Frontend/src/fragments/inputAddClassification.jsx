import * as React from "react";
import AddContext from "../context/addContext";
import styled from "styled-components";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";

import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";

const InputAddClassification = props => {
  // const [type, setType] = React.useState("");
  //   const [model, setModel] = React.useState(undefined);
  //   const [requirement, setRequirement] = React.useState('');
  //   const [code, setCode] = React.useState('');
  //   const [data, setData] = React.useState('');
  //   const [input, setInput] = React.useState('');
  const context = React.useContext(AddContext);

  const modelHandler = files => {
    console.log("Types in changehandle", files[0]);
    const modelfile = files[0];
    //   setModel(files[0]);
    console.log("Model is ", modelfile);
    context.dispatch({ type: "setModel", modelfile });
  };
  const requirementHandler = files => {
    console.log("Types in changehandle", files[0]);
    const reqfile = files[0];
    // setRequirement(files[0]);
    console.log("requirement is ", reqfile);
    context.dispatch({ type: "setRequirement", reqfile });
  };
  const codeHandler = files => {
    console.log("Types in changehandle", files[0]);
    const codefile = files[0];
    // setCode(files[0]);
    console.log("Model is ", codefile);
    context.dispatch({ type: "setCode", codefile });
  };
  const dataHandler = files => {
    console.log("Types in changehandle", files[0]);
    const datafile = files[0];
    // setData(files[0]);
    console.log("Model is ", datafile);
    context.dispatch({ type: "setData", datafile });
  };
  const inputHandler = files => {
    console.log("Types in changehandle", files[0]);
    const inputfile = files[0];
    // setInput(files[0]);
    console.log("Model is ", inputfile);
    context.dispatch({ type: "setInput", inputfile });
  };

  const submitHandler = values => {
    console.log("Submit Handler for model");

    context.dispatch({ type: "changeState", value: 4 });
  };
  return (
    <FileWrapper>
      {/* <section className="page-content">
        <PageHeader title={"Add Files"} /> */}

      <Form onSubmit={e => submitHandler(e)}>
        <Form.Group controlId="formBasicFile" style={{ marginBottom: "2rem" }}>
          <Row className="justify-content-md-center">
            <Col>
              <Form.Label> Model File </Form.Label>
            </Col>
            <Col>
              <input
                name="model"
                label="upload model"
                type="file"
                onChange={e => modelHandler(e.target.files)}
              />
              <Form.Text className="text-muted">Upload a model file</Form.Text>
            </Col>
          </Row>
        </Form.Group>

        <Form.Group controlId="formBasicFile" style={{ marginBottom: "2rem" }}>
          <Row className="justify-content-md-center">
            <Col>
              <Form.Label> Requirement File </Form.Label>
            </Col>
            <Col>
              <input
                name="requirement"
                label="upload requirement"
                type="file"
                onChange={e => requirementHandler(e.target.files)}
              />
              <Form.Text className="text-muted">
                Upload a Requirement file
              </Form.Text>
            </Col>
          </Row>
        </Form.Group>

        <Form.Group controlId="formBasicFile" style={{ marginBottom: "2rem" }}>
          <Row className="justify-content-md-center">
            <Col>
              <Form.Label> Code File </Form.Label>
            </Col>
            <Col>
              <input
                name="code"
                label="upload code"
                type="file"
                onChange={e => codeHandler(e.target.files)}
              />
              <Form.Text className="text-muted">Upload a Code file</Form.Text>
            </Col>
          </Row>
        </Form.Group>

        <Form.Group controlId="formBasicFile" style={{ marginBottom: "2rem" }}>
          <Row className="justify-content-md-center">
            <Col>
              <Form.Label> Data File </Form.Label>
            </Col>
            <Col>
              <input
                name="data"
                label="upload data"
                type="file"
                onChange={e => dataHandler(e.target.files)}
                
              />
              <Form.Text className="text-muted">Upload a Data file</Form.Text>
            </Col>
          </Row>
        </Form.Group>

        <Form.Group controlId="formBasicFile">
          <Row className="justify-content-md-center">
            <Col>
              <Form.Label> Input File </Form.Label>
            </Col>
            <Col>
              <input
                name="input"
                label="upload input"
                type="file"
                onChange={e => inputHandler(e.target.files)}
              />
              <Form.Text className="text-muted">Upload a Input file</Form.Text>
            </Col>
          </Row>
        </Form.Group>

        <Button variant="primary" type="submit">
          Next
        </Button>
      </Form>
      {/* </section> */}
    </FileWrapper>
  );
};

export default InputAddClassification;

const FileWrapper = styled.div`
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
