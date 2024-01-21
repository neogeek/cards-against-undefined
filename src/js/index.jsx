import React from 'react';
import ReactDOM from 'react-dom';

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { App, DealerChoice, Game, Join, Lobby } from './views';

ReactDOM.render(
    <Router>
        <App>
            <Routes>
                <Route path="/" element={<Join />} />
                <Route path="/lobby" element={<Lobby />} />
                <Route path="/game" element={<Game />} />
                <Route path="/dealer-choice" element={<DealerChoice />} />
            </Routes>
        </App>
    </Router>,
    document.querySelector('#root')
);
