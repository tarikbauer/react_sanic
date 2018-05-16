require('popper.js');
require('bootstrap/dist/js/bootstrap.min.js');
require('jquery-mask-plugin');
import React from 'react';
import ReactDOM from 'react-dom';
import {BrowserRouter, Route, Switch} from 'react-router-dom';
import App from '../components/app';
import Home from '../components/home';
import Login from '../components/login';
import Register from '../components/register';
import Main from '../components/main';

ReactDOM.render(<BrowserRouter>
                    <App>
                        <Switch>
                            <Route exact path="/" render={() => <Home text="Welcome Home"/>}/>
                            <Route exact path="/login" component={Login}/>
                            <Route exact path="/register" component={Register}/>
                            <Route exact path="/home" component={Main}/>
                            <Route render={() => <Home text="Page not found"/>}/>
                        </Switch>
                    </App>
                </BrowserRouter>,
    document.getElementById('root'));
