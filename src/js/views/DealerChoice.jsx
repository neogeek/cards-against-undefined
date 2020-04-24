import React, { Fragment, useContext } from 'react';

import { Button, CardFront, CardLayout, PageWrapper } from '../components';

import { RoomHeader } from './';

import { RoomContext } from '../hooks';

import { websocket } from '../utils/websocket';

export default () => {
    const {
        data: { isDealer, turn: { blackCard = [], playedCards = [] } = {} } = {
            turn
        },
        roomId,
        userId
    } = useContext(RoomContext);

    return (
        <>
            <RoomHeader />
            <PageWrapper>
                <div>
                    {blackCard && (
                        <CardFront
                            text={blackCard.text}
                            type="black"
                            badgeNumber={
                                blackCard.pick > 1 ? blackCard.pick : null
                            }
                        />
                    )}
                </div>
                {playedCards &&
                    playedCards.map(
                        ({ userId: winningUserId, whiteCards }, index) => (
                            <Fragment key={index}>
                                <CardLayout>
                                    {whiteCards.map(({ text, id }) => (
                                        <CardFront
                                            text={text}
                                            key={id}
                                            type="white"
                                        />
                                    ))}
                                </CardLayout>

                                {isDealer && (
                                    <Button
                                        onClick={() => {
                                            websocket.send(
                                                JSON.stringify({
                                                    type: 'dealer-select',
                                                    roomId,
                                                    userId,
                                                    winningUserId,
                                                    winningCards: whiteCards
                                                })
                                            );
                                        }}
                                    >
                                        Select Card(s)
                                    </Button>
                                )}
                            </Fragment>
                        )
                    )}
            </PageWrapper>
        </>
    );
};
