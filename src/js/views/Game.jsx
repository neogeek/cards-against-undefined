import React, { useContext, useState } from 'react';

import { Button, CardFront, CardLayout, PageWrapper } from '../components';

import { RoomHeader } from './';

import { RoomContext } from '../hooks/RoomContext';

export default () => {
    const {
        data: {
            game: { gameId } = {},
            turn: { blackCard = [], dealerPlayerId } = {},
            player: { hand = [] } = {}
        } = {
            game,
            turn,
            player
        },
        playerId,
        isSpectator,
        send
    } = useContext(RoomContext);

    const [selectedCards, setSelectedCards] = useState([]);

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
                {!isSpectator && dealerPlayerId !== playerId && hand && (
                    <>
                        <CardLayout>
                            {hand.map(({ text, id }) => {
                                const selectedIndex = selectedCards.findIndex(
                                    card => card.id === id
                                );

                                return (
                                    <CardFront
                                        text={text}
                                        type="white"
                                        key={id}
                                        badgeNumber={
                                            selectedIndex > -1
                                                ? selectedIndex + 1
                                                : null
                                        }
                                        disabled={hand.length < 5}
                                        onClick={() => {
                                            const selectedCardIndex = selectedCards.findIndex(
                                                card => card.id === id
                                            );

                                            if (selectedCardIndex !== -1) {
                                                setSelectedCards(
                                                    selectedCards.filter(
                                                        card => card.id !== id
                                                    )
                                                );
                                            } else if (
                                                blackCard &&
                                                selectedCards.length <
                                                    blackCard.pick
                                            ) {
                                                setSelectedCards([
                                                    ...selectedCards,
                                                    {
                                                        text,
                                                        id
                                                    }
                                                ]);
                                            }
                                        }}
                                    />
                                );
                            })}
                        </CardLayout>
                        <div>
                            <Button
                                disabled={
                                    (blackCard &&
                                        selectedCards.length !==
                                            blackCard.pick) ||
                                    hand.length < 5
                                }
                                onClick={() => {
                                    send('play-cards', {
                                        gameId,
                                        playerId,
                                        playedCards: selectedCards
                                    });
                                    setSelectedCards([]);
                                }}
                            >
                                Play Selected Card(s)
                            </Button>
                        </div>
                    </>
                )}
            </PageWrapper>
        </>
    );
};
