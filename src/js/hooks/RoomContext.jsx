import React, { createContext, useEffect, useState } from 'react';

import { withRouter } from 'react-router-dom';

import { Reconnecting } from '../views';

import { useWebSocketGameLobbyClient } from 'websocket-game-lobby-client-hooks';

export const RoomContext = createContext();

export const RoomWrapper = withRouter(({ history, children }) => {
    const { data, connected, send } = useWebSocketGameLobbyClient();

    const [gameCode, setGameCode] = useState('');

    useEffect(() => {
        setGameCode(data.game?.gameCode || '');
        if (data.game) {
            if (!data.game.started) {
                history.push(`/lobby`);
            } else if (
                data.turn.playedCards.length ===
                data.game.players.length - 1
            ) {
                history.push(`/dealer-choice`);
            } else {
                history.push(`/game`);
            }
        } else {
            history.push(`/`);
        }
    }, [data]);

    return (
        <RoomContext.Provider
            value={{
                data,
                gameCode,
                playerId:
                    data?.player?.playerId || data?.spectator?.spectatorId,
                isSpectator: Boolean(data.spectator?.spectatorId),
                send
            }}
        >
            {connected ? children : <Reconnecting />}
        </RoomContext.Provider>
    );
});
