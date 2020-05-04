import React, { createContext, useEffect, useState } from 'react';

import { withRouter } from 'react-router-dom';

import { useLocalStorage } from '@neogeek/common-react-hooks';

import { Reconnecting } from '../views';

import { WebSocketGameLobbyClient } from 'websocket-game-lobby';

export const RoomContext = createContext();

export const RoomWrapper = withRouter(({ history, children }) => {
    const [gameLobby, setGameLobby] = useState();

    const [playerId, setPlayerId] = useLocalStorage('playerId');
    const [gameCode, setGameCode] = useLocalStorage('gameCode');

    const [data, setData] = useState({});

    const [connected, setConnected] = useState(false);

    const handleConnect = () => setConnected(true);
    const handleDisconnect = () => setConnected(false);

    const handleMessage = message => {
        setData(JSON.parse(message.data));
    };

    useEffect(() => {
        setGameLobby(
            new WebSocketGameLobbyClient({
                port: process.env.NODE_ENV === 'development' ? 5000 : null,
                gameId: gameCode,
                playerId
            })
        );
    }, []);

    useEffect(() => {
        if (data.game) {
            setGameCode(data?.game?.gameCode || '');
            setPlayerId(
                data?.player?.playerId || data?.spectator?.spectatorId || ''
            );
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

    useEffect(() => {
        gameLobby?.addEventListener('open', handleConnect);
        gameLobby?.addEventListener('message', handleMessage);
        gameLobby?.addEventListener('close', handleDisconnect);

        return () => {
            gameLobby?.removeEventListener('open', handleConnect);
            gameLobby?.removeEventListener('message', handleMessage);
            gameLobby?.removeEventListener('close', handleDisconnect);
        };
    }, [gameLobby]);

    return (
        <RoomContext.Provider
            value={{
                data,
                gameCode,
                playerId,
                send: (type, data) => gameLobby?.send(type, data)
            }}
        >
            {connected ? children : <Reconnecting />}
        </RoomContext.Provider>
    );
});
