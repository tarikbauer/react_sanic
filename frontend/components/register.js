import React, {Component} from 'react';
import Request from '../helpers/request'
import $ from 'jquery';
import Cookies from 'js-cookie'
import Alert from "react-s-alert";

export default class Register extends Component {

    constructor() {
        super();
        this.request = new Request();
        this.make_post = this.make_post.bind(this);
        this.cpf_mask = this.cpf_mask.bind(this)
    }

    show_alert(message) {
        Alert.error(message, {
            position: 'top',
            effect: 'stackslide',
        });
    }

    cpf_mask() {
        $('#cpf').mask('000.000.000-00', {reverse: true})
    }

    make_post(event) {
        event.preventDefault();
        let body = {cpf: $('#cpf').val(), password: $('#password').val(), username: $('#username').val(),
            email: $('#email').val()};
        this.request.post('register', body).then((response) => {
            if (response.hasOwnProperty('alert')) {
                this.show_alert(response.alert)
            }
            else {
                Cookies.set('token', response.token, {expires: 1});
                window.location.replace(response.redirect)
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
                    <input type="text" className="form-control" id="username" placeholder="Username"/>
                </div>
                <div className="form-group">
                    <input type="text" className="form-control" id="email" placeholder="Email"/>
                </div>
                <div className="form-group">
                    <input type="password" className="form-control" id="password" placeholder="Password"/>
                </div>
                <button type="submit" className="btn btn-primary">Register</button>
            </form>
        )
    }
}