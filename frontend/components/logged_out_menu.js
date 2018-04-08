import React, {Component} from "react";
import {Link} from 'react-router-dom';

export default class LoggedOutMenu extends Component{

   render(){
       return (
           <div className="collapse navbar-collapse" id="navbar-content">
               <ul className="navbar-nav mr-auto"/>
               <div className="row margin-right-0">
                   <Link to="/register" className="margin-right-5">
                        <button className="btn btn-outline-warning" type="submit">Register</button>
                    </Link>
                   <Link to="/login">
                        <button className="btn btn-outline-info" type="submit">Login</button>
                    </Link>
                </div>
           </div>
       )
   }
}