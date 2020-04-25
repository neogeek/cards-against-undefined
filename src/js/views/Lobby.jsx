import React, { useContext } from 'react';

import { RoomContext } from '../hooks';

import { RoomHeader } from './';

import { Button, PageWrapper } from '../components';

import { sendJSON } from '../utils/websocket';

export default () => {
    const {
        data: { isAdmin, playerCount },
        roomId,
        userId
    } = useContext(RoomContext);

    return (
        <>
            <RoomHeader />
            <PageWrapper>
                <div>
                    <p>Waiting for other players ... {playerCount}</p>
                    {isAdmin && (
                        <Button
                            onClick={e => {
                                e.preventDefault();
                                sendJSON({ type: 'start', roomId, userId });
                            }}
                        >
                            Everyone is in →
                        </Button>
                    )}
                </div>
            </PageWrapper>
        </>
    );
};
