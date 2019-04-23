import * as React from 'react';
import { useTransition, animated, config } from 'react-spring';

import styled from 'styled-components';

interface Iprops {
	children: React.ReactNode;
}

interface IpropsHeader {
	title: string;
}

export const PageWrapper: React.FunctionComponent<Iprops> = ({ children }): React.ReactElement<any> => {
	const transitions = useTransition(children, (item: any) => item, {
		// from: { transform: 'translate3d(0,-40px,0)' },
		// enter: { transform: 'translate3d(0,0px,0)' },
		// leave: { transform: 'translate3d(0,-40px,0)' }
		from: { opacity: 0 },
		enter: { opacity: 1 },
		leave: { opacity: 0 },
		config: config.wobbly
	});

	return (
		<PageContainer>
			{transitions.map(({ props, item, key }) => (
				<animated.div key={key} style={props}>
					{item}
				</animated.div>
			))}
		</PageContainer>
	);
};

export const PageHeader: React.FunctionComponent<IpropsHeader> = ({ title }): React.ReactElement<any> => (
	<HeaderTittleWrapper>{title}</HeaderTittleWrapper>
);

const HeaderTittleWrapper = styled.h1`
	color: #444444;
	font-weight: 300;
	font-size: 2rem;
	margin-top: 1rem;
	padding-top: 1rem;

`;

const PageContainer = styled.div`
	color: #444444;
	margin : 2.5rem;

`;
