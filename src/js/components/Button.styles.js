import styled from 'styled-components';

export const StyledButton = styled.button`
    margin: 0.25rem;
    padding: 0.5rem 0.6rem;
    line-height: 1;
    font-family: inherit;
    font-size: inherit;
    color: #fff;
    border: 2px solid #fff;
    border-radius: 0.25rem;
    background-color: #222;
    cursor: ${props => (props.disabled ? 'default' : 'pointer')};
    appearance: none;
    opacity: ${props => (props.disabled ? 0.6 : 1)};
`;
