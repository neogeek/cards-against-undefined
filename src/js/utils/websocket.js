import qs from 'qs';

import ReconnectingWebSocket from 'reconnecting-websocket';

const url = `${window.location.protocol === 'https:' ? 'wss:' : 'ws:'}//${
    window.location.hostname
}:${process.env.NODE_ENV === 'development' ? 5000 : window.location.port}/`;

let websocket;

const connect = ({ userId, roomId }) => {
    websocket =
        websocket ||
        new ReconnectingWebSocket(
            `${url}?${qs.stringify({
                userId,
                roomId,
                ...qs.parse(window.location.search, { ignoreQueryPrefix: true })
            })}`
        );
};

const send = message => websocket.send(message);

const sendJSON = object => send(JSON.stringify(object));

export { connect, websocket, send, sendJSON, url };
