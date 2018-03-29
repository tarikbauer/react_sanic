require('popper.js');
require('bootstrap/dist/js/bootstrap.min.js');
require('jquery-mask-plugin');
import React from 'react';
import ReactDOM from 'react-dom';
import {BrowserRouter, Route, Switch} from 'react-router-dom';
import App from '../components/app';
import Login from '../components/login';
import Home from '../components/home';
import Register from '../components/register';
import UserHome from '../components/user_home';

ReactDOM.render(<BrowserRouter>
                    <App>
                        <Switch>
                            <Route exact path="/" component={Home}/>
                            <Route path="/login" component={Login}/>
                            <Route path="/register" component={Register}/>
                            <Route path="/user_home" component={UserHome}/>
                        </Switch>
                    </App>
                </BrowserRouter>,
    document.getElementById('root'));
