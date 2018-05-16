import React, {Component} from 'react';
import Request from '../helpers/request';
import AdminHome from './admin_home';
import UserHome from './user_home';

export default class Main extends Component {

    constructor() {
        super();
        this.state = {main: null};
        this.request = new Request();
    }

    componentWillMount() {
        this.request.post('is_admin', {}).then((response) => {
            if (response)
                this.setState({main: <AdminHome/>});
            else
                this.setState({main: <UserHome/>});
        }).catch((error) => {console.log(error); window.location.replace('/home')})
    }

    render() {
        return (<div>{this.state.main}</div>)
    }
}