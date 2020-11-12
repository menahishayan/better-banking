import React, { useState } from 'react';
import { Redirect } from 'react-router';
import { Button } from 'react-bootstrap';
import './Login.css'
import DB from './DB'

const db = new DB()

function Login() {
    const [redirect, setRedirect] = useState();
    const [user, setUser] = useState();

    const loginHandler = (testPerson) => {
        if(!user) {
            let id = '';
            
            switch(testPerson) {
                case 'Shayan': id = '0192319023103'; break;
                case 'Nishank': id = '6292656562225'; break;
                case 'Revathi': id = '2141448714878'; break;
                default: id = '';
            }
            db.getUser(id, (user) => {
                setUser(user);
                setRedirect('/dashboard')
            })
        }
    }

    if (redirect) return <Redirect push to={{ pathname: redirect, state: user }} />
    return (
        <div>
            <h1 className="login">Login</h1>
                <div className="username">
                     <input id="username" type="Username"  placeholder="Username"></input>
                 </div>
                 <div className="password">
                     <input id="password" type="Password"  placeholder="Password"></input>
                 </div>
                 <Button className="button" onClick={() => loginHandler('Shayan')}>Shayan</Button>
                 <Button className="button" onClick={() => loginHandler('Nishank')}>Nishank</Button>
                 <Button className="button" onClick={() => loginHandler('Revathi')}>Revathi</Button>
        </div>
    );
}

export default Login;