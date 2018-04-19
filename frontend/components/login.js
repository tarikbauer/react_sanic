import React, {Component} from 'react';
import $ from 'jquery';
import Cookies from 'js-cookie';
import Request from '../helpers/request';
import show_alert from '../helpers/utils';

export default class Login extends Component {

    constructor() {
        super();
        this.request = new Request();
        this.make_post = this.make_post.bind(this);
        this.cpf_mask = this.cpf_mask.bind(this)
    }

    cpf_mask() {
        $('#cpf').mask('000.000.000-00', {reverse: true})
    }

    make_post(event) {
        event.preventDefault();
        let body = {cpf: $('#cpf').val(), password: $('#password').val()};
        this.request.post('login', body).then((response) => {
            if (response.hasOwnProperty('alert')) {
                response.alert.map(alert => show_alert(alert))
            }
            else {
                Cookies.set('token', response.token, {expires: 1});
                Cookies.set('username', response.username, {expires: 1});
                window.location.replace('/home')
            }
        }).catch((error) => console.log(error))
    }

    render() {
        return (
            <form onSubmit={event => this.make_post(event)}>
                <div className="form-group">
                    <input type="text" className="form-control" id="cpf" placeholder="CPF" onInput={this.cpf_mask}/>
                </div>
                <div className="form-group">
                    <input type="password" className="form-control" id="password" placeholder="Password"/>
                </div>
                <button type="submit" className="btn btn-primary">Login</button>
            </form>
        )
    }
}