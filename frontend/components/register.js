import React, {Component} from 'react';
import $ from 'jquery';
import Cookies from 'js-cookie';
import Request from '../helpers/request';
import show_error from '../helpers/utils';

export default class Register extends Component {

    constructor() {
        super();
        this.request = new Request();
        this.make_post = this.make_post.bind(this);
        this.usercode_mask = this.usercode_mask.bind(this);
        this.cpf_mask = this.cpf_mask.bind(this);
        this.state = {admin_token: false, radio: true}
    }

    // noinspection JSMethodCanBeStatic
    usercode_mask() {
        // noinspection JSUnresolvedFunction
        $('#usercode').mask('00000')
    }

    // noinspection JSMethodCanBeStatic
    cpf_mask() {
        // noinspection JSUnresolvedFunction
        $('#cpf').mask('000.000.000-00', {reverse: true})
    }

    make_post(event) {
        event.preventDefault();
        let body = {name: $('#name').val(), username: $('#username').val(), usercode: $('#usercode').val(),
            email: $('#email').val(), cpf: $('#cpf').val(), password: $('#password').val(),
            admin_token: $('#admin_token').val(), situation: $('input[name=radio]:checked').val()};
        this.request.post('register', body).then((response) => {
            if (response.hasOwnProperty('alert')) {
                response.alert.map(alert => show_error(alert))
            }
            else {
                // noinspection JSUnresolvedFunction
                Cookies.set('token', response.token, {expires: 1});
                // noinspection JSUnresolvedFunction
                Cookies.set('username', response.username, {expires: 1});
                window.location.replace('/home')
            }
        }).catch((error) => {console.log(error); window.location.replace('/home')})
    }

    render() {
        let admin_input = null;
        let placeholder;
        if (this.state.radio) placeholder = 'Military Name';
        else placeholder = 'Username';
        if (this.state.admin_token) admin_input = (
            <div className="form-group">
                <input type="password" className="form-control" id="admin_token" placeholder="Admin Token"/>
            </div>
        );
        return (
            <form onSubmit={event => this.make_post(event)}>
                <div className="form-group">
                    <input type="text" className="form-control" id="name" placeholder="Name"/>
                </div>
                <div className="form-check form-check-inline margin-bottom-15">
                    <input className="form-check-input radio" type="radio" name="radio" id="ativa_radio"
                           value="ativa" checked={this.state.radio} onClick={() => this.setState({radio: true})}/> Ativa
                </div>
                <div className="form-check form-check-inline margin-bottom-15">
                    <input className="form-check-input radio" type="radio" name="radio" id="reserva_radio"
                           value="reserva" checked={!this.state.radio} onClick={() => this.setState({radio: false})}/> Reserva
                </div>
                <div className="form-group">
                    <input type="text" className="form-control" id="username" placeholder={placeholder}/>
                </div>
                <div className="form-group">
                    <input type="text" className="form-control" id="usercode" placeholder="Usercode"
                           onInput={this.usercode_mask}/>
                </div>
                <div className="form-group">
                    <input type="text" className="form-control" id="email" placeholder="Email"/>
                </div>
                <div className="form-group">
                    <input type="text" className="form-control" id="cpf" placeholder="CPF" onInput={this.cpf_mask}/>
                </div>
                <div className="form-group">
                    <input type="password" className="form-control" id="password" placeholder="Password"/>
                </div>
                <div className="form-check margin-bottom-15">
                    <input type="checkbox" className="form-check-input" id="admin"
                           onClick={() => this.setState({admin_token: !this.state.admin_token})}/> Register as admin
                </div>
                {admin_input}
                <button type="submit" className="btn btn-primary">Register</button>
            </form>
        )
    }
}