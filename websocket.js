const { WebSocketGameLobbyServer } = require('websocket-game-lobby');

const shuffle = require('shuffle-array');

const deck = require('./data/base');

const { removeArrayItem } = require('./utils');

const MAX_CARDS_IN_HAND = 5;

const setupGame = game => {
    game.dealerPlayerId = null;

    return Object.defineProperties(game, {
        deck: {
            value: {
                blackCards: shuffle([...deck.blackCards]),
                whiteCards: shuffle([...deck.whiteCards])
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

    gameLobby.addEventListener('start', ({ gameId }, datastore) => {
        datastore.editGame(gameId, setupGame);
        datastore.editGame(gameId, setupPlayersInGame);

        datastore.editGame(gameId, game => {
            setupCurrentTurn(game, datastore.currentTurn(gameId));
        });
    });
    gameLobby.addEventListener(
        'play-cards',
        ({ gameId, playerId, playedCards }, datastore) => {
            datastore.editPlayer(gameId, playerId, player =>
                removePlayedCardsFromPlayer(player, playedCards)
            );

            datastore.editTurn(
                gameId,
                datastore.currentTurn(gameId).turnId,
                turn => {
                    turn.playedCards.push({
                        playerId,
                        whiteCards: playedCards
                    });
                }
            );
        }
    );
    gameLobby.addEventListener(
        'dealer-select',
        ({ gameId, winningPlayerId, winningCards }, datastore) => {
            datastore.editGame(gameId, setupPlayersInGame);

            datastore.editPlayer(gameId, winningPlayerId, player => {
                player.blackCards.push(datastore.currentTurn(gameId).blackCard);
            });

            datastore.editTurn(
                gameId,
                datastore.currentTurn(gameId).turnId,
                turn => {
                    turn.winningCards = winningCards;
                }
            );

            datastore.endTurn(gameId);

            datastore.editTurn(
                gameId,
                datastore.currentTurn(gameId).turnId,
                turn => setupCurrentTurn(datastore.findGame(gameId), turn)
            );
        }
    );
};

module.exports = websocket;
