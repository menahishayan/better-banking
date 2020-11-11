import React from 'react';
import { Button } from 'react-bootstrap';

function Login() {
    return (
        <div>
            <h1>Login</h1>
            <from action="signin.html" method="post">
                <div>
                     <input id="username" type="Username" required placeholder="Username"></input>
                 </div>
                 <div>
                     <input id="password" type="Password" required placeholder="Password"></input>
                 </div>
                 <button>Login</button>
            </from>
            
        </div>
    );
}

export default Login;