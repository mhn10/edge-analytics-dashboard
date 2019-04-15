import * as React from 'react';
import styled from 'styled-components';
import checkMark from '../assets/icons-stepWizard-checkmark.svg';
import AddContext from "../context/addContext";

import bluecircle from '../assets/Blue_circle_logo.svg';
import greycircle from '../assets/Grey_circle_logo.svg';

const Wizard= ({ createState }) => {
	const context = React.useContext(AddContext);


	return (
		<WizzardWrapper>

			<ProgressBar>
				<ProgressBarList completed={ context.addState.step > 1 ? true : false} present={context.addState.step === 1 ? true : false}>
					Task Name
				</ProgressBarList>
				<ProgressBarList completed={context.addState.step > 2 ? true : false} present={context.addState.step === 2 ? true : false}>
					Type
				</ProgressBarList>
				<ProgressBarList completed={context.addState.step > 3 ? true : false} present={context.addState.step === 3 ? true : false}>
					Files
				</ProgressBarList>
				<ProgressBarList completed={false} present={context.addState.step === 4 ? true : false}>
					Confirmation
				</ProgressBarList>
			</ProgressBar>
		</WizzardWrapper>
	);
};

export default Wizard;


const WizzardWrapper = styled.div`
	margin: .75rem 2rem 0 2rem;
	padding: 0.7rem 1rem;
`;

const ProgressBar = styled.ul`
	counter-reset: step;
	width: 100%;
	margin-left: -2rem;
	display: inline-block;
`;
const ProgressBarList = styled.li`
	list-style-type: none;
	float: left;
	width: 25%;
	position: relative;
	text-align: center;
	color: #afafb1;

	@media screen and (max-width: 992px) {
		font-size: 0.7rem;
	}

	&::before {
		content: url(${(props) =>
			props.completed === true ? checkMark : props.present === true ? bluecircle : greycircle});
		width: 25px;
		height: 25px;
		border-radius: 50%;
		display: block;
		text-align: center;
		margin: 0 auto 10px auto;
		background-color: #efefef;
		box-shadow: 0px 0px 0px 7px #efefef;
		position: relative;
		z-index: 2;
	}

	&::after {
		content: "";
		border: 5px solid #efefef;
		position: absolute;
		/* width:100%; */
		width: 88%;
		height: 3px;
		background-color: ${(props) => props.present === true ? '#2196F3' : props.completed === true ? '#2196F3' : '#efefef'};
		transition: background-color 0.5s ease-in;
		top: 8px;
		left: -50%;
		/* right: -25px; */
		/* margin left not required */
		margin-left: 13px;
	}

	&:first-child:after {
		content: none;
	}
`;
