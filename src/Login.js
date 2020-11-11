import React from 'react';
import './Login.css'

function Login() {
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
                 <button className="button">Login</button>
            </form>
        </div>
    );
}

export default Login;