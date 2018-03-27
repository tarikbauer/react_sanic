import React, {Component} from 'react';
import Request from '../helpers/request'
import $ from 'jquery';

export default class Login extends Component {
    constructor() {
        super();
        this.request = new Request();
        this.make_post = this.make_post.bind(this)
    }

    make_post(event) {
        event.preventDefault();
        let body = {email: $('#email').val(), password: $('#password').val()};
        this.request.post('login', body).then((response) => {
                window.location.replace('/')
            }).catch((error) => console.log(error))
    }

    render() {
        return (
            <form onSubmit={this.make_post}>
                <div className="form-group">
                    <label htmlFor="email">Email address</label>
                    <input type="email" className="form-control" id="email" placeholder="Enter email" />
                        <small id="emailHelp" className="form-text text-muted">
                            We'll never share your email with anyone else.
                        </small>
                </div>
                <div className="form-group">
                    <label htmlFor="password">Password</label>
                    <input type="password" className="form-control" id="password" placeholder="Password" />
                </div>
                <div className="form-check">
                    <input type="checkbox" className="form-check-input" id="checkbox"/>
                        <label className="form-check-label" htmlFor="checkbox">Check me out</label>
                </div>
                <button type="submit" className="btn btn-primary">Submit</button>
            </form>
        )
    }
}