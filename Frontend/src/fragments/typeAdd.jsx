import * as React from 'react';
import { PageHeader, PageWrapper } from '../components/Page';
import Select from 'react-select';
import AddContext from "../context/addContext";
import jwtDecode from "jwt-decode";



const options = [
	{ value: 'classification', label: 'Classification' },
	{ value: 'regression', label: 'Regression' },
  ]
  
const TypeAdd = (props) => {
	// const [type, setType] = React.useState("");
	const context = React.useContext(AddContext);

	const changeHandler = types => {
		const {email} = jwtDecode(localStorage.getItem('userToken'));
    console.log("Username decoded",email)
		context.dispatch({type: "setUsername", email})
		
	  const { value } = types;
	  console.log("Values, ", value );
	  context.dispatch({ type: "setType", value });
	  context.dispatch({ type: "changeState", value: 2 });
  
  };
	return (
		<PageWrapper>
			<section className="page-content">
				<PageHeader title={'Add Type'} />
				<div>Type of computation to perform</div>
			<Select onChange={changeHandler}  options={options} defaultValue={{value: context.addState.type, label: context.addState.type}}/>
			</section>
		</PageWrapper>
	);
};

export default TypeAdd;


