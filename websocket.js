const WebSocketEventWrapper = require('@neogeek/websocket-event-wrapper');

const qs = require('qs');

const { removeArrayItem } = require('./utils');

const { createRoom, findRoom, findUser, findTurn } = require('./db');

const sendClientUpdate = ({ roomId, userId }) => {
    const room = findRoom(roomId);
    const user = findUser(room, userId);
    const turn = findTurn(room);

    if (user && turn) {
        return {
            roomId: room.roomId,
            started: room.started,
            playerCount: room.players.length,
            dealerSelect: turn.playedCards.length === room.players.length - 1,
            isDealer:
                room.players.findIndex(
                    player => player.userId === user.userId
                ) === room.dealerIndex,
            user,
            turn
        };
    }

    return {};
};

const broadcastRoomUpdate = (roomId, wss) => {
    wss.broadcast(sendClientUpdate, client => client.roomId === roomId);
};

const websocket = ({ port, server }) => {
    const wss = new WebSocketEventWrapper({
        port,
        server,
        onConnect: (_, request) => {
            sendClientUpdate(
                qs.parse(request.url.replace(/^\//, ''), {
                    ignoreQueryPrefix: true
                })
            );
        }
    });

    wss.addListener(({ roomId, userId, type, ...rest }, client) => {
        switch (type) {
            case 'create':
                {
                    const room = createRoom();
                    const user = findUser(room, userId);

                    client.userId = user.userId;
                    client.roomId = room.roomId;

                    broadcastRoomUpdate(room.roomId, wss);
                }
                break;
            case 'join':
            case 'update':
                {
                    const room = findRoom(roomId);
                    const user = findUser(room, userId);

                    if (!room || !user) {
                        client.roomId = '';

                        wss.send({}, client);

                        break;
                    }

                    client.userId = user.userId;
                    client.roomId = room.roomId;

                    broadcastRoomUpdate(room.roomId, wss);
                }
                break;

            case 'start':
                {
                    const room = findRoom(roomId);

                    room.started = true;

                    broadcastRoomUpdate(room.roomId, wss);
                }
                break;

            case 'play-cards':
                {
                    const room = findRoom(roomId);
                    const user = findUser(room, userId);
                    const turn = findTurn(room);

                    rest.playedCards.map(({ id }) =>
                        removeArrayItem(user.hand, card => card.id === id)
                    );

                    turn.playedCards.push({
                        userId,
                        whiteCards: rest.playedCards
                    });

                    broadcastRoomUpdate(room.roomId, wss);
                }
                break;

            case 'dealer-select':
                {
                    const room = findRoom(roomId);
                    const turn = findTurn(room);
                    const winningUser = findUser(room, rest.winningUserId);

                    turn.winningCards = rest.winningCards;

                    winningUser.blackCards.push(turn.blackCard);

                    broadcastRoomUpdate(room.roomId, wss);
                }
                break;

            case 'leave':
                {
                    const room = findRoom(roomId);

                    removeArrayItem(
                        room.players,
                        user => user.userId === userId
                    );

                    client.roomId = '';

                    wss.send({}, client);

                    broadcastRoomUpdate(room.roomId, wss);
                }
                break;
            default:
                console.error('Invalid message type.');
                break;
        }
    });
};

module.exports = websocket;
