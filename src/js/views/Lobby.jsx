import React, { useContext, useEffect, useState } from 'react';

import { RoomContext } from '../hooks';

import { RoomHeader } from './';

import { Button, Form, Input, PlayerList, PageWrapper } from '../components';

export default () => {
    const { data, player, send } = useContext(RoomContext);

    const [name, setName] = useState(player?.name || '');

    if (player && !player.name) {
        return (
            <>
                <RoomHeader />
                <PageWrapper>
                    <Form
                        onSubmit={e => {
                            e.preventDefault();
                            send('update-name', { name });
                        }}
                    >
                        <Input
                            value={name}
                            onChange={e => setName(e.target.value)}
                            require={true}
                        />
                        <Button type="submit">Set Name</Button>
                    </Form>
                </PageWrapper>
            </>
        );
    }

    return (
        <>
            <RoomHeader />
            <PageWrapper>
                <div>
                    <p>Waiting on other players ...</p>
                    {player && (
                        <Button
                            onClick={e => {
                                e.preventDefault();
                                send('start');
                            }}
                            disabled={
                                data?.game?.players.filter(
                                    player => !player.name
                                ).length
                            }
                        >
                            Everyone is in →
                        </Button>
                    )}
                    <PlayerList players={data?.game?.players}></PlayerList>
                </div>
            </PageWrapper>
        </>
    );
};
