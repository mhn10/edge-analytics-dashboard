import * as React from 'react';
import { PageHeader, PageWrapper } from '../components/Page';
import Select from 'react-select';



const options = [
	{ value: 'classification', label: 'Classification' },
	{ value: 'regression', label: 'Regression' },
  ]


const TypeAdd = (props) => {
	return (
		<PageWrapper>
			<section className="page-content">
				<PageHeader title={'Add Type fragment'} />
				<div>Type of computation to perform</div>
				<Select options={options} />
			</section>
		</PageWrapper>
	);
};

export default TypeAdd;
