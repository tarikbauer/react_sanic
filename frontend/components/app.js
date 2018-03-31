import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import Alert from 'react-s-alert';

export default class App extends Component {

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
                        <Link className="form-inline" to="/login">
                            <button className="btn btn-outline-success" type="submit">Login</button>
                        </Link>
                        <Link className="form-inline" to="/register">
                            <button className="btn btn-outline-info" type="submit">Register</button>
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