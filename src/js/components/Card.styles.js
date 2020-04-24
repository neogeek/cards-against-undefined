import styled from 'styled-components';

export const StyledCard = styled.div`
    position: relative;
    margin: 0.25rem;
    font-weight: bold;
    padding: 1.5rem;
    flex-shrink: 0;
    display: inline-flex;
    flex-direction: column;
    justify-content: space-between;
    font-family: 'Helvetica Neue', sans-serif;
    color: ${props => props.textColor};
    width: 20rem;
    height: 25rem;
    border: 2px solid black;
    border-radius: 1rem;
    background-color: ${props => props.backgroundColor};
    -webkit-font-smoothing: antialiased;
    cursor: ${props => (props.onClick ? 'pointer' : 'default')};
    scroll-snap-align: start;
`;

export const StyledCardHeader = styled.h1`
    font-size: 3rem;
    font-weight: bold;
`;

export const StyledCardIndex = styled.span`
    position: absolute;
    padding: 0.2rem;
    top: -1rem;
    right: -1rem;
    color: white;
    font-size: 1.2rem;
    text-align: center;
    width: 2.25rem;
    height: 2.25rem;
    border: 2px solid white;
    border-radius: 50%;
    background-color: black;
    z-index: 1000;
`;

export const StyledCardText = styled.p`
    font-size: 1.5rem;
    font-weight: bold;
`;

export const StyledCardFooter = styled.div`
    font-size: 1.1rem;
`;

export const StyledCardFooterLogo = styled.img`
    margin-right: 0.5rem;
    vertical-align: middle;
`;
