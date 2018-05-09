import React, {Component} from 'react';
import $ from 'jquery';
import Cookies from 'js-cookie';
import Request from '../helpers/request';
import show_error from '../helpers/utils';

export default class Login extends Component {

    constructor() {
        super();
        this.request = new Request();
        this.make_post = this.make_post.bind(this);
        this.usercode_mask = this.usercode_mask.bind(this);
    }

    // noinspection JSMethodCanBeStatic
    usercode_mask() {
        // noinspection JSUnresolvedFunction
        $('#usercode').mask('00000')
    }

    make_post(event) {
        event.preventDefault();
        let body = {usercode: $('#usercode').val(), password: $('#password').val()};
        this.request.post('login', body).then((response) => {
            if (response.hasOwnProperty('alert')) {
                response.alert.map(alert => show_error(alert))
            }
            else {
                // noinspection JSUnresolvedFunction
                Cookies.set('token', response.token, {expires: 1});
                // noinspection JSUnresolvedFunction
                Cookies.set('name', response.name, {expires: 1});
                window.location.replace('/home')
            }
        }).catch((error) => {console.log(error); window.location.replace('/home')})
    }

    render() {
        return (
            <form onSubmit={event => this.make_post(event)}>
                <div className="form-group">
                    <input type="text" className="form-control" id="usercode" placeholder="Usercode"
                           onInput={this.usercode_mask}/>
                </div>
                <div className="form-group">
                    <input type="password" className="form-control" id="password" placeholder="Password"/>
                </div>
                <button type="submit" className="btn btn-primary">Login</button>
            </form>
        )
    }
}