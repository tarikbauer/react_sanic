import React, {Component} from 'react';
import Cookies from 'js-cookie'
import Request from "../helpers/request";

export default class UserHome extends Component {

    constructor() {
        super();
        this.request = new Request();
        this.make_post = this.make_post.bind(this)
    }

    make_post(event) {
        event.preventDefault();
        this.request.post('logout', {}).then((response) => {
            Cookies.remove('username');
            Cookies.remove('token');
            window.location.replace(response.redirect)
        }).catch((error) => console.log(error))
    }

    render() {
        return (
            <div>
                <h1>Welcome {Cookies.get('username')}</h1>
                <form onSubmit={event => this.make_post(event)}>
                    <button type="submit" className="btn btn-info">Logout</button>
                </form>
            </div>
        )
    }
}