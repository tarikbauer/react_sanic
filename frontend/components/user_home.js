import React, {Component} from 'react';
import Cookies from 'js-cookie'
import $ from "jquery";
import Request from "../helpers/request";

export default class UserHome extends Component {

    constructor() {
        super();
        this.request = new Request();
        this.make_post = this.make_post.bind(this)
    }

    make_post(event) {
        event.preventDefault();
        let body = {cpf: $('#cpf').val(), password: $('#password').val()};
        this.request.post('logout', body).then((response) => {
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
                    <button type="submit" className="btn btn-primary">Logout</button>
                </form>
            </div>
        )
    }
}