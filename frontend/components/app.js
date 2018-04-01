import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import Alert from 'react-s-alert';
import Request from "../helpers/request";
import Cookies from "js-cookie";

export default class App extends Component {

    constructor() {
        super();
        console.log('will');
        this.request = new Request();
        this.state = {home_redirect: '/', username: ''};
        this.make_post = this.make_post.bind(this)
    }

    make_post(event) {
        event.preventDefault();
        this.request.post('logout', {}).then((response) => {
            Cookies.remove('token');
            window.location.replace(response.redirect)
        }).catch((error) => console.log(error))
    }

    componentWillMount() {
        console.log('will');
        this.request.post('is_authenticated', {}).then((response) => {
            if (response.length) {
                this.state = {home_redirect: '/home', username: response};
            }
            else {
                this.state = {home_redirect: '/', username: response};
            }
        }).catch((error) => console.log(error))
    }

    render() {
        let navbar_options;
        if (this.state.username.length) {
            navbar_options = (
                <form onSubmit={event => this.make_post(event)}>
                    <button type="submit" className="btn btn-outline-info">Logout</button>
                </form>
            )
        }
        else {
            navbar_options = (
                <div className="row">
                    <Link className="btn-margin" to="/login">
                        <button className="btn btn-outline-info" type="submit">Login</button>
                    </Link>
                    <Link to="/register">
                        <button className="btn btn-outline-warning" type="submit">Register</button>
                    </Link>
                </div>
            )
        }
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
                        {navbar_options}
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