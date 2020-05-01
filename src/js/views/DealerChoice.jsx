import React, { Fragment, useContext } from 'react';

import { Button, CardFront, CardLayout, PageWrapper } from '../components';

import { RoomHeader } from './';

import { RoomContext } from '../hooks';

export default () => {
    const {
        data: {
            game: { gameId } = {},
            turn: { blackCard = {}, playedCards = [], dealerPlayerId } = {}
        } = {
            game,
            turn
        },
        playerId,
        send
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
                        ({ playerId: winningPlayerId, whiteCards }, index) => (
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

                                {dealerPlayerId === playerId && (
                                    <Button
                                        onClick={() => {
                                            send('dealer-select', {
                                                type: 'dealer-select',
                                                gameId,
                                                playerId,
                                                winningPlayerId,
                                                winningCards: whiteCards
                                            });
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
