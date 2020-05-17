import React, { useContext, useState } from 'react';

import { RoomContext } from '../hooks';

import {
    Button,
    Form,
    Input,
    JoinFooter,
    JoinHeader,
    PageWrapper
} from '../components';

export default () => {
    const { send } = useContext(RoomContext);

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
            <Form
                onSubmit={e => {
                    e.preventDefault();
                    send('create');
                }}
            >
                <Button type="submit">Create New Game</Button>
            </Form>
            <Form
                onSubmit={e => {
                    e.preventDefault();
                    send('join', { gameCode });
                }}
            >
                <Input
                    type="text"
                    placeholder="Code"
                    value={gameCode}
                    size="8"
                    maxLength="4"
                    autocorrect={false}
                    required={true}
                    onChange={e => setGameCode(e.target.value.toUpperCase())}
                />
                <Button type="submit">Join Game</Button>
            </Form>
            <JoinFooter>
                <p>
                    A game by <a href="https://scottdoxey.com/">Scott Doxey</a>
                </p>
            </JoinFooter>
        </PageWrapper>
    );
};
