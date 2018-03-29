import React, {Component} from 'react';
import Cookies from 'js-cookie'

export default class UserHome extends Component {
    render() {
        return (
            <h1>Welcome {Cookies.get('username')}</h1>
        )
    }
}