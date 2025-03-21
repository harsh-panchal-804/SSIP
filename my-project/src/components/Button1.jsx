import React from 'react';
import styled from 'styled-components';

const Button1 = ({ text }) => {
  return (
    <StyledWrapper>
      <button className="button" data-text="Awesome">
        <span className="actual-text">{text}</span>
        <span aria-hidden="true" className="hover-text">{text}</span>
      </button>
    </StyledWrapper>
  );
};

const StyledWrapper = styled.div`
  /* === removing default button style === */
  .button {
    margin: 0;
    height: auto;
    background: transparent;
    padding: 0;
    border: none;
    cursor: pointer;
  }

  /* button styling */
  .button {
    --border-right: 2px;
    --animation-color: #443627;
    --fs-size: 1rem;
    letter-spacing: 3px;
    text-decoration: none;
    font-size: var(--fs-size);
    font-family: "Arial";
    position: relative;
    text-transform: uppercase;
    color: black; /* Default text color */
  }

  /* Default visible text */
  .actual-text {
    color: black;  /* Normal text color before hover */
    -webkit-text-stroke: none; /* Remove text stroke */
    position: relative;
    z-index: 1;
  }

  /* Hover effect text */
  .hover-text {
    position: absolute;
    box-sizing: border-box;
    content: attr(data-text);
    color: var(--animation-color);
    width: 0%;
    inset: 0;
    border-right: var(--border-right) solid var(--animation-color);
    overflow: hidden;
    transition: 0.5s;
    -webkit-text-stroke: 0.5px var(--animation-color);
  }

  /* Hover Effect */
  .button:hover .hover-text {
    width: 100%;
    filter: drop-shadow(0 0 23px var(--animation-color));
  }
`;

export default Button1;
