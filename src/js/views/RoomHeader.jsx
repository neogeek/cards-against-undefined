import React, { useContext } from 'react';

import { useLocalStorage } from '@neogeek/common-react-hooks';

import { RoomContext } from '../hooks';

import { Button, RoomCode, RoomHeader, ScoreCard } from '../components';

export default () => {
    const {
        data: {
            game: { started = false } = {},
            player: { blackCards = [] } = {}
        } = {
            game,
            player
        },
        gameCode,
        playerId,
        send
    } = useContext(RoomContext);

    const [, setGameCode] = useLocalStorage('gameCode');

    return (
        <RoomHeader>
            <RoomCode>{gameCode}</RoomCode>
            {started && <ScoreCard>{blackCards.length}</ScoreCard>}
            <Button
                onClick={() => {
                    send('leave', {
                        gameId: gameCode,
                        playerId
                    });
                    setGameCode('');
                }}
            >
                Leave Game
            </Button>
        </RoomHeader>
    );
};
