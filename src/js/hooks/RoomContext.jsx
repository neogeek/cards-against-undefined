import React, { createContext, useEffect, useState } from 'react';

import { useNavigate } from 'react-router-dom';

import { Reconnecting } from '../views';

import { useWebSocketGameLobbyClient } from 'websocket-game-lobby-client-hooks';

export const RoomContext = createContext({});

export const RoomWrapper = ({ children }) => {
    let navigate = useNavigate();

    const { data, gameCode, playerId, connected, send } =
        useWebSocketGameLobbyClient({
            port: process.env.NODE_ENV === 'development' ? 3030 : undefined
        });

    useEffect(() => {
        if (!data) {
            return;
        }
        if (data.game) {
            if (!data.game.started) {
                navigate(`/lobby`);
            } else if (
                data.turn.custom.playedCards.length ===
                data.game.players.length - 1
            ) {
                navigate(`/dealer-choice`);
            } else {
                navigate(`/game`);
            }
        } else {
            navigate(`/`);
        }
    }, [data]);

    return (
        <RoomContext.Provider
            value={{
                data: data || {},
                player: data?.player,
                turn: data?.turn,
                gameCode,
                playerId,
                isSpectator: Boolean(data?.spectator?.spectatorId),
                send
            }}
        >
            {connected ? children : <Reconnecting />}
        </RoomContext.Provider>
    );
};
