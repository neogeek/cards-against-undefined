import React, { useContext, useEffect, useState } from 'react';

import { RoomContext } from '../hooks';

import { RoomHeader } from './';

import { Button, Input, PageWrapper } from '../components';

export default () => {
    const { data, player, send } = useContext(RoomContext);

    const [name, setName] = useState(player?.name || '');

    if (player && !player.name) {
        return (
            <>
                <RoomHeader />
                <PageWrapper>
                    <form>
                        <Input
                            value={name}
                            onChange={e => setName(e.target.value)}
                            require={true}
                        />
                        <Button
                            type="submit"
                            onClick={() => send('update-name', { name })}
                        >
                            Set Name
                        </Button>
                    </form>
                </PageWrapper>
            </>
        );
    }

    return (
        <>
            <RoomHeader />
            <PageWrapper>
                <div>
                    <p>
                        Waiting for other players ...{' '}
                        {data?.game?.players.length || 0}
                    </p>
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
                </div>
                <div>
                    <ul>
                        {data?.game?.players
                            .filter(player => player.name)
                            .map(player => (
                                <li key={player.playerId}>{player.name}</li>
                            ))}
                    </ul>
                </div>
            </PageWrapper>
        </>
    );
};
