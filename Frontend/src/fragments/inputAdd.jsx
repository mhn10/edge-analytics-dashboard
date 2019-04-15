import * as React from "react";
import { PageHeader, PageWrapper } from "../components/Page";
import AddContext from "../context/addContext";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";

const InputAdd = props => {
  // const [type, setType] = React.useState("");
//   const [model, setModel] = React.useState(undefined);
//   const [requirement, setRequirement] = React.useState('');
//   const [code, setCode] = React.useState('');
//   const [data, setData] = React.useState('');
//   const [input, setInput] = React.useState('');
  const context = React.useContext(AddContext);

  const modelHandler = files => {
	  console.log("Types in changehandle", files[0])
	  const modelfile = files[0]
	//   setModel(files[0]);
	  console.log("Model is ", modelfile);
	  context.dispatch({ type: "setModel", modelfile});

  };
  const requirementHandler = files => {
	console.log("Types in changehandle", files[0])
	const reqfile = files[0]
	// setRequirement(files[0]);
	console.log("requirement is ", reqfile)
	context.dispatch({ type: "setRequirement", reqfile});

};
const codeHandler = files => {
	console.log("Types in changehandle", files[0])
	const codefile = files[0]
	// setCode(files[0]);
	console.log("Model is ", codefile)
	context.dispatch({ type: "setCode", codefile });


};
const dataHandler = files => {
	console.log("Types in changehandle", files[0])
	const datafile = files[0]
	// setData(files[0]);
	console.log("Model is ", datafile)
	context.dispatch({ type: "setData", datafile });


};
const inputHandler = files => {
	console.log("Types in changehandle", files[0])
	const inputfile = files[0]
	// setInput(files[0]);
	console.log("Model is ", inputfile)
	context.dispatch({ type: "setInput", inputfile });


};

  const submitHandler = values => {
   console.log("Submit Handler for model" );

    
      context.dispatch({ type: "changeState", value: 4 });
  };
  return (
    <PageWrapper>
      <section className="page-content">
        <PageHeader title={"Add Files"} />
        <div>Input Files</div>

        <Form onSubmit={e => submitHandler(e)}>
          <input
            name="model"
            label="upload model"
            type="file"
            onChange={e => modelHandler(e.target.files)}
          />
		   <input
            name="requirement"
            label="upload requirement"
            type="file"
            onChange={e => requirementHandler(e.target.files)}
          />
		   <input
            name="code"
            label="upload code"
            type="file"
            onChange={e => codeHandler(e.target.files)}
          />
		   <input
            name="data"
            label="upload data"
            type="file"
            onChange={e => dataHandler(e.target.files)}
          />
		   <input
            name="input"
            label="upload input"
            type="file"
            onChange={e => inputHandler(e.target.files)}
          />
          <Button variant="primary" type="submit">
            Submit
          </Button>
        </Form>
      </section>
    </PageWrapper>
  );
};

export default InputAdd;
