import React, { createContext, useEffect, useState } from 'react';

import { withRouter } from 'react-router-dom';

import { v4 as uuid } from 'uuid';

import { useLocalStorage } from '@neogeek/common-react-hooks';

import { Reconnecting } from '../views';

import { connect, websocket, sendJSON } from '../utils/websocket';

export const RoomContext = createContext();

export const RoomWrapper = withRouter(({ history, children }) => {
    const [userId] = useLocalStorage('userId', uuid);
    const [roomId, setRoomId] = useLocalStorage('roomId');

    const [data, setData] = useState({});

    const [connected, setConnected] = useState(false);

    const handleConnect = () => setConnected(true);
    const handleDisconnect = () => setConnected(false);

    const handleMessage = message => setData(JSON.parse(message.data));

    useEffect(() => {
        if (data.room && data.room.roomId) {
            setRoomId(data.room.roomId);
        }

        if (!data.room || !data.room.roomId) {
            history.push(`/`);
        } else if (!data.room.started) {
            history.push(`/lobby`);
        } else if (
            data.turn.playedCards.length ===
            data.room.players.length - 1
        ) {
            history.push(`/dealer-choice`);
        } else {
            history.push(`/game`);
        }
    }, [data]);

    useEffect(() => {
        if (connected && roomId) {
            sendJSON({ type: 'update', userId, roomId });
        }
    }, [connected]);

    useEffect(() => {
        connect({ userId, roomId });

        websocket.addEventListener('open', handleConnect);
        websocket.addEventListener('message', handleMessage);
        websocket.addEventListener('close', handleDisconnect);
        return () => {
            websocket.removeEventListener('open', handleConnect);
            websocket.removeEventListener('message', handleMessage);
            websocket.removeEventListener('close', handleDisconnect);
        };
    }, []);

    return (
        <RoomContext.Provider value={{ connected, data, roomId, userId }}>
            {connected ? children : <Reconnecting />}
        </RoomContext.Provider>
    );
});
