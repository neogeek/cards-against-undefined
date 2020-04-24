import styled from 'styled-components';

export const StyledButton = styled.button`
    margin: 0.25rem;
    padding: 0.5rem 0.75rem;
    font-family: inherit;
    font-size: inherit;
    color: #fff;
    background-color: #222;
    border: 2px solid #fff;
    border-radius: 0.25rem;
    cursor: ${props => (props.disabled ? 'default' : 'pointer')};
    appearance: none;
    opacity: ${props => (props.disabled ? 0.6 : 1)};
`;
