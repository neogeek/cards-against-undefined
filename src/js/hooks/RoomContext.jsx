import React, { createContext, useEffect, useState } from 'react';

import { withRouter } from 'react-router-dom';

import { Reconnecting } from '../views';

import { useWebSocketGameLobbyClient } from 'websocket-game-lobby-client-hooks';

export const RoomContext = createContext();

export const RoomWrapper = withRouter(({ history, children }) => {
    const {
        data,
        gameCode,
        playerId,
        connected,
        send
    } = useWebSocketGameLobbyClient({
        port: process.env.NODE_ENV === 'development' ? 5000 : undefined
    });

    useEffect(() => {
        if (data.game) {
            if (!data.game.started) {
                history.push(`/lobby`);
            } else if (
                data.turn.custom.playedCards.length ===
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
                player: data.player,
                turn: data.turn,
                gameCode,
                playerId,
                isSpectator: Boolean(data.spectator?.spectatorId),
                send
            }}
        >
            {connected ? children : <Reconnecting />}
        </RoomContext.Provider>
    );
});
