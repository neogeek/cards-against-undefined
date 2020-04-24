import { createGlobalStyle } from 'styled-components';

export const GlobalStyles = createGlobalStyle`
    html {
        box-sizing: border-box;
    }

    *,
    *:before,
    *:after {
        margin: 0;
        padding: 0;
        box-sizing: inherit;
    }

    body {
        font-family: -apple-system, BlinkMacSystemFont, 'Helvetica', 'Arial',
            sans-serif;
        font-size: 1.5rem;
        line-height: 1.2;
        color: #222;
        letter-spacing: 0.01;
    }

    a {
        color: #444;
    }
`;
