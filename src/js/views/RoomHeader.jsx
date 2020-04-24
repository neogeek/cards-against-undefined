import React, { useContext } from 'react';

import { useLocalStorage } from '@neogeek/common-react-hooks';

import { RoomContext } from '../hooks';

import { Button, RoomCode, RoomHeader, ScoreCard } from '../components';

import { sendJSON } from '../utils/websocket';

export default () => {
    const {
        data: { started, user: { blackCards = [] } = {} } = { user },
        roomId,
        userId
    } = useContext(RoomContext);

    const [_, setRoomId] = useLocalStorage('roomId');

    return (
        <RoomHeader>
            <RoomCode>{roomId}</RoomCode>
            {started && <ScoreCard>{blackCards.length}</ScoreCard>}
            <Button
                onClick={() => {
                    sendJSON({
                        type: 'leave',
                        roomId,
                        userId
                    });
                    setRoomId('');
                }}
            >
                Leave Game
            </Button>
        </RoomHeader>
    );
};
