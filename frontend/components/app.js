import React, {Component} from 'react';
import {Link} from 'react-router-dom';

export default class App extends Component {
    render() {
        return (
            <section>
                <nav className="navbar navbar-dark bg-dark">
                    <Link className="navbar-brand" to="/">Lab Project</Link>
                </nav>
                <div className="container-fluid">
                    <div className="default-component card-body">{this.props.children}</div>
                </div>
            </section>
        )
    }
}