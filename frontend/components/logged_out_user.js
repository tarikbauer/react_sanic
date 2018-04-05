import React, {Component} from "react";
import {Link} from 'react-router-dom';

export default class UserLoggedOut extends Component{

   render(){
       return (
           <div className="row">
                <Link className="btn-margin" to="/login">
                    <button className="btn btn-outline-info" type="submit">Login</button>
                </Link>
                <Link to="/register">
                    <button className="btn btn-outline-warning" type="submit">Register</button>
                </Link>
            </div>
       )
   }
}