import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import Cookies from "js-cookie";
import Alert from 'react-s-alert';
import Request from "../helpers/request";
import LoggedInMenu from './logged_in_menu';
import LoggedOutMenu from './logged_out_menu';

export default class App extends Component {

    constructor() {
        super();
        this.state = {menu: null, loading: false};
        this.request = new Request();
    }

    componentWillMount() {
        this.setState({loading: true});
        this.change_menu().then(() => this.setState({loading: false}))
            .catch(error => {console.log(error); window.location.replace('/home')});
    }

    change_menu() {
        return new Promise((resolve, reject) => {
            this.request.post('is_authenticated', {}).then((response) => {
            if (response)
                { // noinspection JSUnresolvedFunction
                    this.setState({menu: <LoggedInMenu name={Cookies.get('name')}/>});
                }
            else
                this.setState({menu: <LoggedOutMenu/>});
        }).catch((error) => {console.log(error); window.location.replace('/home')})
                .then(response => resolve(response)).catch(error => reject(error))});
    }

    render() {
        // noinspection JSUnresolvedFunction
        Alert.closeAll();
        this.state.loading ? this.menu = null : this.menu = this.state.menu;
        return (
            <section>
                <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
                    <Link className="navbar-brand" to="/">Lab Project</Link>
                    <button className="navbar-toggler" type="button" data-toggle="collapse"
                            data-target="#navbar-content" aria-controls="navbarSupportedContent" aria-expanded="false"
                            aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"/>
                    </button>
                    {this.menu}
                </nav>
                <div className="container-fluid">
                    <div className="default-component card-body">{this.props.children}</div>
                </div>
                <Alert stack={{limit: 3}} timeout={3500}/>
            </section>
        )
    }
}