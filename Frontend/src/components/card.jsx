import * as React from "react";
import styled from "styled-components";
import { useSpring, animated } from 'react-spring'
import DashboardContext from "../context/dashboardContext";

const calc = (x, y) => [(y - window.innerHeight / 2) / 20, -(x - window.innerWidth / 2) / 20, 1.1]
const trans = (x, y, s) => `perspective(600px) rotateX(${x}deg) rotateY(${y}deg) scale(${s})`

const Cards = ( props ) => {
  const context = React.useContext(DashboardContext);

  const [animProps, set] = useSpring(() => ({ xys: [0, 0, 1], config: { mass: 5, tension: 350, friction: 40} }))
const clickHandler = (NodeValue) =>{
console.log("Node value is ",NodeValue)
context.dispatch({ type: "setValue", NodeValue });
context.dispatch({ type: "changeState", value: true });


}
  
  return (

    <Card  onMouseMove={({ clientX: x, clientY: y }) => set({ xys: calc(x, y) })}
    onMouseLeave={() => set({ xys: [0, 0, 1] })}
    style={{ transform: animProps.xys.interpolate(trans) }}
   >
      <CardContainer  onClick={() => clickHandler(props.Value)}>
        <h7>
          <b style={{ wordWrap:"break-word"}}>{props.Name}</b>
        </h7>
        {/* <div/> give location herev */}
      <Meta> {props.IP}:{props.Port} </Meta>
{/* 
        <p></p>
        <p></p> */}

      </CardContainer>
    </Card>
  );
};

export default Cards;

const Card = styled(animated.div)`
 width: 25ch;
  height: 25ch;
  background: rgba(248, 248, 248, 0.4);
  border-radius: 10px;
  box-shadow: 0px 10px 30px -5px rgba(0, 0, 0, 0.3);
  transition: box-shadow 0.5s;
  will-change: transform;
  border: 2px solid white;
 
  &:hover {
    box-shadow: 0px 30px 100px -10px rgba(0, 0, 0, 0.4);
    /* box-shadow: 0 8px 16px 0 rgba(0, 0, 0, 0.2); */
  }
`;

const CardContainer = styled.div`
  padding: 2px 16px;
  text-align:center;
  justify-content:center;
  padding-top:3rem;
`;


const Meta = styled.div`
	padding: 0.4rem 1rem;
	background: #eff3fa;
	border-radius: 50px;
	color: #b2bddc;
	text-transform: uppercase;
	margin-bottom: 2rem;
  margin-top:2rem;
	display: inline-block;
	font-weight: 400;
`;


