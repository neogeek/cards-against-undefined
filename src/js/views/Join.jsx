import React, { useContext, useState } from 'react';

import { RoomContext } from '../hooks';

import {
    Button,
    Input,
    JoinFooter,
    JoinHeader,
    PageWrapper
} from '../components';

import { sendJSON } from '../utils/websocket';

export default () => {
    const { userId } = useContext(RoomContext);

    const [roomId, setRoomId] = useState('');

    return (
        <PageWrapper>
            <JoinHeader>
                <img src="/images/logo.svg" />
                <h1>Cards Against Undefined</h1>
                <p>
                    An undefined card game you play against friends, fiends and
                    foes
                </p>
            </JoinHeader>
            <form
                onSubmit={e => {
                    e.preventDefault();
                    sendJSON({ type: 'create', userId });
                }}
            >
                <Button type="submit">Create New Game</Button>
            </form>
            <form
                onSubmit={e => {
                    e.preventDefault();
                    sendJSON({ type: 'join', roomId, userId });
                }}
            >
                <Input
                    type="text"
                    placeholder="Room ID"
                    value={roomId}
                    size="8"
                    maxLength="4"
                    autoCorrect="false"
                    onChange={e => setRoomId(e.target.value.toUpperCase())}
                />
                <Button type="submit">Join Game</Button>
            </form>
            <JoinFooter>
                <p>
                    A game by <a href="https://scottdoxey.com/">Scott Doxey</a>
                </p>
            </JoinFooter>
        </PageWrapper>
    );
};
