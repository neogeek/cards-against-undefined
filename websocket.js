const { WebSocketGameLobbyServer } = require('websocket-game-lobby');

const shuffle = require('shuffle-array');

const data = require('./data/');

const { removeArrayItem } = require('./utils');

const MAX_CARDS_IN_HAND = 5;

const setupGame = (game, decks) => {
    game.dealerPlayerId = null;

    if (!decks) decks = [{ value: 'Base' }];

    return Object.defineProperties(game, {
        deck: {
            value: {
                blackCards: shuffle(
                    decks.map(({ value }) => [...data[value].blackCards]).flat()
                ),
                whiteCards: shuffle(
                    decks.map(({ value }) => [...data[value].whiteCards]).flat()
                )
            }
        }
    });
};

const removePlayedCardsFromPlayer = (player, playedCards) => {
    playedCards.map(({ id }) =>
        removeArrayItem(player.hand, card => card.id === id)
    );
    return player;
};

const setupPlayersInGame = game => {
    game.players.map(player => {
        if (!player.hasOwnProperty('hand')) {
            player.hand = [];
        }
        if (!player.hasOwnProperty('blackCards')) {
            player.blackCards = [];
        }

        player.hand.push(
            ...game.deck.whiteCards.splice(
                0,
                MAX_CARDS_IN_HAND - player.hand.length
            )
        );
    });
    return game;
};

const setupCurrentTurn = (game, turn) => {
    if (!turn.hasOwnProperty('blackCard')) {
        turn.blackCard = game.deck.blackCards.splice(0, 1).find(val => val);
    }
    if (!turn.hasOwnProperty('playedCards')) {
        turn.playedCards = [];
    }
    if (!turn.hasOwnProperty('winningCards')) {
        turn.winningCards = [];
    }

    const previousPlayerIndex = game.players.findIndex(
        player => player.playerId === game.dealerPlayerId
    );

    const nextPlayerIndex =
        previousPlayerIndex + 1 < game.players.length
            ? previousPlayerIndex + 1
            : 0;

    turn.dealerPlayerId = game.players[nextPlayerIndex].playerId;
    game.dealerPlayerId = game.players[nextPlayerIndex].playerId;

    return turn;
};

const websocket = ({ port, server }) => {
    const gameLobby = new WebSocketGameLobbyServer({ port, server });

    gameLobby.addEventListener(
        'start',
        async ({ gameId, decks }, datastore) => {
            await datastore.editGame(gameId, game => setupGame(game, decks));
            await datastore.editGame(gameId, setupPlayersInGame);

            await datastore.editGame(gameId, async game => {
                setupCurrentTurn(game, await datastore.currentTurn(gameId));
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
            await datastore.editPlayer(gameId, playerId, player =>
                removePlayedCardsFromPlayer(player, playedCards)
            );

            await datastore.editTurn(
                gameId,
                (await datastore.currentTurn(gameId)).turnId,
                turn => {
                    turn.playedCards.push({
                        playerId,
                        whiteCards: playedCards
                    });
                    return turn;
                }
            );
        }
    );
    gameLobby.addEventListener(
        'dealer-select',
        async ({ gameId, winningPlayerId, winningCards }, datastore) => {
            await datastore.editGame(gameId, setupPlayersInGame);

            await datastore.editPlayer(
                gameId,
                winningPlayerId,
                async player => {
                    player.blackCards.push(
                        (await datastore.currentTurn(gameId)).blackCard
                    );
                    return player;
                }
            );

            await datastore.editTurn(
                gameId,
                (await datastore.currentTurn(gameId)).turnId,
                turn => {
                    turn.winningCards = winningCards;
                    return turn;
                }
            );

            await datastore.endTurn(gameId);

            await datastore.editTurn(
                gameId,
                (await datastore.currentTurn(gameId)).turnId,
                async turn =>
                    setupCurrentTurn(await datastore.findGame(gameId), turn)
            );
        }
    );
};

module.exports = websocket;
