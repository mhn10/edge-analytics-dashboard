import * as React from "react";
import styled from "styled-components";

const Cards = ({ props }) => {
  return (
    <Card>
      <CardContainer>
        <h4>
          <b>John Doe</b>
        </h4>
        <p>Architect & Engineer</p>
      </CardContainer>
    </Card>
  );
};

export default Cards;

const Card = styled.div`
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2);
  transition: 0.3s;
  &:hover {
    box-shadow: 0 8px 16px 0 rgba(0, 0, 0, 0.2);
  }
`;

const CardContainer = styled.div`
  padding: 2px 16px;
`;
