import React, { useContext, useState } from 'react';

import { RoomContext } from '../hooks';

import {
    Button,
    Input,
    JoinFooter,
    JoinHeader,
    PageWrapper
} from '../components';

export default () => {
    const { playerId, send } = useContext(RoomContext);

    const [gameCode, setGameCode] = useState('');

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
                    send('create', { playerId });
                }}
            >
                <Button type="submit">Create New Game</Button>
            </form>
            <form
                onSubmit={e => {
                    e.preventDefault();
                    send('join', { gameId: gameCode, playerId });
                }}
            >
                <Input
                    type="text"
                    placeholder="Code"
                    value={gameCode}
                    size="8"
                    maxLength="4"
                    autocorrect={false}
                    onChange={e => setGameCode(e.target.value.toUpperCase())}
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
