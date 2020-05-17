import styled from 'styled-components';

import vhCheck from 'vh-check';

vhCheck({
    cssVarName: 'browser-address-bar',
    updateOnTouch: false
});

export const StyledAppWrapper = styled.div`
    min-height: calc(100vh - var(--browser-address-bar, 0px));
    padding: 1rem;
    display: flex;
    flex-direction: column;
`;
