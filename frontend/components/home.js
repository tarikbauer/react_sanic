import React, {Component} from 'react';
import {Link} from 'react-router-dom';

export default class Home extends Component {
    render() {
        return (
            <Link className="btn btn-primary" to="/login">LOGIN</Link>
        )
    }
}