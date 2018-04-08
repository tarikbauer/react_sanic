import React, {Component} from "react";
import {Link} from 'react-router-dom';
import Cookies from "js-cookie";
import Request from '../helpers/request';

export default class LoggedInMenu extends Component{

   constructor(){
       super();
       this.request = new Request();
       this.make_post = this.make_post.bind(this);
   }

    make_post(event) {
        event.preventDefault();
        this.request.post('logout', {}).then(() => {
            Cookies.remove('token');
            Cookies.remove('username');
            window.location.replace('/')
        }).catch((error) => console.log(error))
    }

   render(){
       return (
           <div className="collapse navbar-collapse" id="navbar-content">
               <Link className="navbar-brand navbar-center" to="/home">Welcome {this.props.username}</Link>
               <ul className="navbar-nav mr-auto"/>
               <a className="btn btn-outline-info" href="" onClick={event => this.make_post(event)}>
                   <i className="fa fa-sign-out"/> Logout
               </a>
           </div>
       )
   }
}