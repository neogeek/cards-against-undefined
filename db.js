const shuffle = require('shuffle-array');

const deck = require('./data/base');

const { generateRandomString } = require('./utils');

const rooms = [];

const MAX_CARDS_IN_HAND = 5;

const LETTERS_IN_ROOM_ID = 4;

const createUniqueRoomId = () => {
    let roomId = generateRandomString(LETTERS_IN_ROOM_ID);

    while (rooms.find(room => room.roomId === roomId)) {
        roomId = generateRandomString(LETTERS_IN_ROOM_ID);
    }

    return roomId;
};

const createRoom = userId => {
    const room = {
        roomId: createUniqueRoomId(),
        started: false,
        players: [],
        spectators: [],
        deck: {
            blackCards: shuffle([...deck.blackCards]),
            whiteCards: shuffle([...deck.whiteCards])
        },
        turns: []
    };

    room.turns.push({
        dealerUserId: userId,
        blackCard: room.deck.blackCards
            .splice(0, MAX_CARDS_IN_HAND)
            .find(val => val),
        playedCards: [],
        winningCards: []
    });

    rooms.push(room);

    return room;
};

const findRoom = (roomId = createUniqueRoomId()) =>
    rooms.find(room => room.roomId === roomId);

const findUser = (room, userId) => {
    if (!room) {
        return null;
    }

    let user = [...room.players, ...room.spectators].find(
        user => user.userId === userId
    );

    if (!user && userId) {
        if (room.started) {
            user = { userId };
            room.spectators.push(user);
        } else {
            user = {
                userId,
                hand: room.deck.whiteCards.splice(0, MAX_CARDS_IN_HAND),
                blackCards: []
            };
            room.players.push(user);
        }
    }

    return user;
};

const findTurn = room => {
    if (!room) {
        return null;
    }

    let turn = room.turns.find(
        turn =>
            turn.playedCards.length < room.players.length - 1 ||
            turn.winningCards.length < turn.blackCard.pick
    );

    if (!turn) {
        const previousUserIndex = room.players.findIndex(
            user =>
                user.userId === room.turns[room.turns.length - 1].dealerUserId
        );

        let nextUser = room.players[previousUserIndex + 1];

        if (!nextUser) {
            nextUser = room.players[0];
        }

        turn = {
            dealerUserId: nextUser.userId,
            blackCard: room.deck.blackCards
                .splice(0, MAX_CARDS_IN_HAND)
                .find(val => val),
            playedCards: [],
            winningCards: []
        };

        room.players.map(player =>
            player.hand.push(
                ...room.deck.whiteCards.splice(
                    0,
                    MAX_CARDS_IN_HAND - player.hand.length
                )
            )
        );

        room.turns.push(turn);
    }

    return turn;
};

module.exports = {
    createRoom,
    findRoom,
    findUser,
    findTurn
};
