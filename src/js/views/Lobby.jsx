import React, { useContext, useState } from 'react';

import { RoomContext } from '../hooks';

import { RoomHeader } from './';

import {
    Button,
    Form,
    Input,
    PlayerList,
    PageWrapper,
    Select
} from '../components';

const allDecks = [
    { value: 'Base', label: 'Base Set' },
    { value: 'CAHe1', label: 'The First Expansion' },
    { value: 'CAHe2', label: 'The Second Expansion' },
    { value: 'CAHe3', label: 'The Third Expansion' },
    { value: 'CAHe4', label: 'The Fourth Expansion' },
    { value: 'CAHe5', label: 'The Fifth Expansion' },
    { value: 'CAHe6', label: 'The Sixth Expansion' },
    { value: 'family', label: 'Family Edition (BETA)' }
];

export default () => {
    const { data, player, send } = useContext(RoomContext);

    const [name, setName] = useState(player?.name || '');
    const [decks, setDecks] = useState([allDecks[0]]);

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
                            placeholder="Nick's Name"
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
                    {player?.isAdmin && (
                        <>
                            <p>Select decks</p>
                            <Select
                                defaultValue={decks}
                                options={allDecks}
                                isMulti
                                onChange={options => setDecks(options)}
                            />
                        </>
                    )}

                    <p>Waiting on other players ...</p>
                    {player?.isAdmin && (
                        <Button
                            onClick={e => {
                                e.preventDefault();
                                send('start', { decks });
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
