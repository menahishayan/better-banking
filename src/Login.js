import React, { useState } from 'react';
import { Redirect } from 'react-router';
import './Login.css'
import DB from './DB'

const db = new DB()

function Login() {
    const [redirect, setRedirect] = useState();
    const [user, setUser] = useState();

    const loginHandler = () => {
        if(!user) {
            db.getUser('0192319023103', (user) => {
                setUser(user);
                setRedirect('/dashboard')
            })
        }
    }

    if (redirect) return <Redirect push to={{ pathname: redirect, state: user }} />
    return (
        <div>
            <h1 className="login">Login</h1>
            <form action="signin.html" method="post">
                <div className="username">
                     <input id="username" type="Username" required placeholder="Username"></input>
                 </div>
                 <div className="password">
                     <input id="password" type="Password" required placeholder="Password"></input>
                 </div>
                 <button className="button" onClick={loginHandler}>Login</button>
            </form>
        </div>
    );
}

export default Login;