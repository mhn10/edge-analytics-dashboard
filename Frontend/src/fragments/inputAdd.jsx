import * as React from "react";
import { PageHeader, PageWrapper } from "../components/Page";
import AddContext from "../context/addContext";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";

const InputAdd = props => {
  // const [type, setType] = React.useState("");
  const [model, setModel] = React.useState(null);
  const context = React.useContext(AddContext);

  const changeHandler = files => {
	  console.log("Types in changehandle", files[0])
	  setModel(files[0]);
	  console.log("Model is ", model)

    // context.dispatch({ type: "setInput", value });
    //context.dispatch({ type: "changeState", value: 3 });
  };
  const submitHandler = values => {
   console.log("Submit Handler for model");

    context.dispatch({ type: "setModel", model });
    //   context.dispatch({ type: "changeState", value: 2 });
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
            onChange={e => changeHandler(e.target.files)}
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
