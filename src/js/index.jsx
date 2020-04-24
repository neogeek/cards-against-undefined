import React from 'react';
import ReactDOM from 'react-dom';

import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { App, DealerChoice, Game, Join, Lobby } from './views';

ReactDOM.render(
    <Router>
        <App>
            <Switch>
                <Route exact path="/" component={Join} />
                <Route path="/lobby" component={Lobby} />
                <Route path="/game" component={Game} />
                <Route path="/dealer-choice" component={DealerChoice} />
            </Switch>
        </App>
    </Router>,
    document.querySelector('#root')
);
