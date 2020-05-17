import React from 'react';

import { StyledPlayerList, StyledPlayerListItem } from './PlayerList.styles';

export const PlayerList = ({ players = [] }) => {
    return (
        <StyledPlayerList>
            {players.map(({ name }, index) => (
                <StyledPlayerListItem key={index} className={name && 'ready'}>
                    {name || 'Still thinking ...'}
                </StyledPlayerListItem>
            ))}
        </StyledPlayerList>
    );
};
