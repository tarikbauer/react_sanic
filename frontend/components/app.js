import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import Alert from 'react-s-alert';
import Request from "../helpers/request";

export default class App extends Component {

    constructor() {
        super();
        this.request = new Request();
        this.redirect = '/login';
    }

    componentWillMount() {
        this.request.post('is_authenticated', {}).then((response) => {
            if (response) {
                this.redirect = '/home';
            }
        }).catch((error) => console.log(error))
    }

    render() {
        return (
            <section>
                <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
                    <Link className="navbar-brand" to="/">Lab Project</Link>
                    <button className="navbar-toggler" type="button" data-toggle="collapse"
                            data-target="#navbar-content" aria-controls="navbarSupportedContent" aria-expanded="false"
                            aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"/>
                    </button>
                    <div className="collapse navbar-collapse" id="navbar-content">
                        <ul className="navbar-nav mr-auto"/>
                        <Link className="form-inline" to={this.redirect}>
                            <button className="btn btn-secondary" type="submit">Login</button>
                        </Link>
                        <Link className="form-inline" to="/register">
                            <button className="btn btn-secondary" type="submit">Register</button>
                        </Link>
                    </div>
                </nav>
                <div className="container-fluid">
                    <div className="default-component card-body">{this.props.children}</div>
                </div>
                <Alert stack={{limit: 3}} />
            </section>
        )
    }
}