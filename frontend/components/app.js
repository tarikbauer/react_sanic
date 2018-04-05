import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import Cookies from "js-cookie";
import Alert from 'react-s-alert';
import Request from "../helpers/request";
import UserLoggedIn from './logged_in_user';
import UserLoggedOut from './logged_out_user';

export default class App extends Component {

    constructor() {
        super();
        this.request = new Request();
        this.state = {home_redirect: '/', username: '', button: <UserLoggedOut/>};
    }

    componentWillMount() {
        this.request.post('is_authenticated', {}).then((response) => {
            if (response)
                this.setState({home_redirect: '/home', username: Cookies.get('username'), button: <UserLoggedIn/>});
            else
                this.setState({home_redirect: '/', username: '', button: <UserLoggedOut/>});
        }).catch((error) => console.log(error))
    }

    render() {
        return (
            <section>
                <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
                    <Link className="navbar-brand" to={this.state.home_redirect}>Lab Project</Link>
                    <button className="navbar-toggler" type="button" data-toggle="collapse"
                            data-target="#navbar-content" aria-controls="navbarSupportedContent" aria-expanded="false"
                            aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"/>
                    </button>
                    <div className="collapse navbar-collapse" id="navbar-content">
                        <ul className="navbar-nav mr-auto"/>
                        {this.state.button}
                    </div>
                </nav>
                <div className="container-fluid">
                    <div className="default-component card-body">{this.props.children}</div>
                </div>
                <Alert stack={{limit: 1}} timeout={4000} />
            </section>
        )
    }
}