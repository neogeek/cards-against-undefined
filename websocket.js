const { WebSocketGameLobbyServer } = require('websocket-game-lobby');

const shuffle = require('shuffle-array');

const data = require('./data/');

const { removeArrayItem } = require('./utils');

const MAX_CARDS_IN_HAND = 5;

const websocket = ({ port, server }) => {
    const gameLobby = new WebSocketGameLobbyServer({
        port,
        server
    });

    gameLobby.addEventListener(
        'start',
        async ({ gameId, decks }, datastore) => {
            const { players } = await datastore.findGame(gameId);
            const { turnId } = await datastore.currentTurn(gameId);

            await datastore.editGame(gameId, game => {
                if (!decks) decks = [{ value: 'Base' }];

                game.custom.dealerPlayerId = players[0].playerId;
                game.custom.deck = {
                    blackCards: shuffle(
                        decks
                            .map(({ value }) => [...data[value].blackCards])
                            .flat()
                    ),
                    whiteCards: shuffle(
                        decks
                            .map(({ value }) => [...data[value].whiteCards])
                            .flat()
                    )
                };
                return game;
            });

            await datastore.editGame(gameId, async game => {
                for (let i = 0; i < players.length; i += 1) {
                    await datastore.editPlayer(
                        gameId,
                        players[i].playerId,
                        player => {
                            player.custom.hand = game.custom.deck.whiteCards.splice(
                                0,
                                MAX_CARDS_IN_HAND
                            );
                            player.custom.blackCards = [];
                            return player;
                        }
                    );
                }
                await datastore.editTurn(gameId, turnId, turn => {
                    turn.custom.blackCard = game.custom.deck.blackCards.shift();
                    turn.custom.playedCards = [];
                    turn.custom.winningCards = [];
                    turn.custom.dealerPlayerId = game.custom.dealerPlayerId;
                    return turn;
                });
                return game;
            });
        }
    );

    gameLobby.addEventListener(
        'update-name',
        async ({ gameId, playerId, name }, datastore) => {
            await datastore.editPlayer(gameId, playerId, player => {
                player.name = name;
                return player;
            });
        }
    );

    gameLobby.addEventListener(
        'play-cards',
        async ({ gameId, playerId, playedCards }, datastore) => {
            const { turnId } = await datastore.currentTurn(gameId);

            await datastore.editPlayer(gameId, playerId, player => {
                playedCards.map(({ id }) =>
                    removeArrayItem(player.custom.hand, card => card.id === id)
                );
                return player;
            });

            await datastore.editTurn(gameId, turnId, turn => {
                turn.custom.playedCards.push({
                    playerId,
                    whiteCards: playedCards
                });
                return turn;
            });
        }
    );
    gameLobby.addEventListener(
        'dealer-select',
        async ({ gameId, winningPlayerId, winningCards }, datastore) => {
            const {
                players,
                custom: { dealerPlayerId }
            } = await datastore.findGame(gameId);

            const previousPlayerIndex = players.findIndex(
                player => player.playerId === dealerPlayerId
            );

            const nextPlayerIndex =
                previousPlayerIndex + 1 < players.length
                    ? previousPlayerIndex + 1
                    : 0;

            await datastore.editGame(gameId, game => {
                game.custom.dealerPlayerId = players[nextPlayerIndex].playerId;
                return game;
            });
            await datastore.editPlayer(
                gameId,
                winningPlayerId,
                async player => {
                    player.custom.blackCards.push(
                        (await datastore.currentTurn(gameId)).blackCard
                    );
                    return player;
                }
            );
            await datastore.editTurn(
                gameId,
                (await datastore.currentTurn(gameId)).turnId,
                turn => {
                    turn.custom.winningCards = winningCards;
                    return turn;
                }
            );

            await datastore.endTurn(gameId);

            await datastore.editGame(gameId, async game => {
                await datastore.editTurn(
                    gameId,
                    (await datastore.currentTurn(gameId)).turnId,
                    async turn => {
                        turn.custom.blackCard = game.custom.deck.blackCards.shift();
                        turn.custom.playedCards = [];
                        turn.custom.winningCards = [];
                        turn.custom.dealerPlayerId =
                            players[nextPlayerIndex].playerId;
                        return turn;
                    }
                );

                for (let i = 0; i < players.length; i += 1) {
                    await datastore.editPlayer(
                        gameId,
                        players[i].playerId,
                        player => {
                            player.custom.hand = [
                                ...player.custom.hand,
                                ...game.custom.deck.whiteCards.splice(
                                    0,
                                    MAX_CARDS_IN_HAND -
                                        player.custom.hand.length
                                )
                            ];
                            return player;
                        }
                    );
                }
                return game;
            });
        }
    );
};

module.exports = websocket;
