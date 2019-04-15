import * as React from 'react';
import { PageHeader, PageWrapper } from '../components/Page';
import Select from 'react-select';
import AddContext from "../context/addContext";



const options = [
	{ value: 'classification', label: 'Classification' },
	{ value: 'regression', label: 'Regression' },
  ]
  
const TypeAdd = (props) => {
	// const [type, setType] = React.useState("");
	const context = React.useContext(AddContext);

	const changeHandler = types => {
	  
	  const { value } = types;
	  console.log("Values, ", value );
	  context.dispatch({ type: "setType", value });
	  context.dispatch({ type: "changeState", value: 3 });
  
  };
	return (
		<PageWrapper>
			<section className="page-content">
				<PageHeader title={'Add Type'} />
				<div>Type of computation to perform</div>
				<Select onChange={changeHandler}  options={options} />
			</section>
		</PageWrapper>
	);
};

export default TypeAdd;


