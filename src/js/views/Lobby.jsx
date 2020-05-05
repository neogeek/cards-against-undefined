import React, { useContext } from 'react';

import { RoomContext } from '../hooks';

import { RoomHeader } from './';

import { Button, PageWrapper } from '../components';

export default () => {
    const { data, send } = useContext(RoomContext);

    return (
        <>
            <RoomHeader />
            <PageWrapper>
                <div>
                    <p>
                        Waiting for other players ...{' '}
                        {data?.game?.players.length || 0}
                    </p>
                    <Button
                        onClick={e => {
                            e.preventDefault();
                            send('start');
                        }}
                    >
                        Everyone is in →
                    </Button>
                </div>
            </PageWrapper>
        </>
    );
};
