require('popper.js');
require('bootstrap/dist/js/bootstrap.min.js');
import React from 'react';
import ReactDOM from 'react-dom';
import {BrowserRouter, Route, Switch} from 'react-router-dom';
import App from '../components/app';
import Login from '../components/login';
import Home from '../components/home';

ReactDOM.render(<BrowserRouter>
                    <App>
                        <Switch>
                            <Route exact path="/" component={Home} />
                            <Route path="/login" component={Login} />
                        </Switch>
                    </App>
                </BrowserRouter>,
    document.getElementById('root'));
