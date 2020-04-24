import React from 'react';

import { AppWrapper } from '../components';

import { RoomWrapper } from '../hooks';

import { GlobalStyles } from '../components/Global.styles';

export default ({ children }) => {
    return (
        <AppWrapper>
            <GlobalStyles />
            <RoomWrapper>{children}</RoomWrapper>
        </AppWrapper>
    );
};
