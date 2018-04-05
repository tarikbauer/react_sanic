import React, {Component} from "react";
import Cookies from "js-cookie";
import Request from '../helpers/request';

export default class UserLoggedIn extends Component{

   constructor(){
       super();
       this.request = new Request();
       this.make_post = this.make_post.bind(this);
   }

    make_post(event) {
        event.preventDefault();
        this.request.post('logout', {}).then((response) => {
            Cookies.remove('token');
            Cookies.remove('username');
            window.location.replace(response.redirect)
        }).catch((error) => console.log(error))
    }

   render(){
       return (
           <div className="btn-group">
               <button type="button" className="btn btn-outline-light custom-login dropdown-toggle"
                       data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                   <i className="fa fa-user"/> {Cookies.get('username')}
               </button>
               <div className="dropdown-menu dropdown-menu-left">
                   <a className="dropdown-item" href="" onClick={event => this.make_post(event)}>
                       <i className="fa fa-sign-out"/> Logout
                   </a>
               </div>
           </div>
       )
   }
}