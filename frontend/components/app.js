import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import Alert from 'react-s-alert';
import Request from "../helpers/request";

export default class App extends Component {

    constructor() {
        super();
        this.request = new Request();
        this.state = {
            first_name: 'Login', first_redirect: '/login',
            second_name: 'Register', second_redirect: '/register'};
    }

    componentWillMount() {
        this.request.post('is_authenticated', {}).then((response) => {
            if (response) {
                this.setState({
                    first_name: 'Home', first_redirect: '/home',
                    second_name: 'Logout', second_redirect: '/home'}
                    );
            }
            else {
                this.setState({
                    first_name: 'Login', first_redirect: '/login',
                    second_name: 'Register', second_redirect: '/register'}
                    );
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
                        <Link className="form-inline" to={this.state.first_redirect}>
                            <button className="btn btn-secondary" type="submit">{this.state.first_name}</button>
                        </Link>
                        <Link className="form-inline" to={this.state.second_redirect}>
                            <button className="btn btn-secondary" type="submit">{this.state.second_name}</button>
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