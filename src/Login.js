import React, { useState } from 'react';
import { Redirect } from 'react-router';
import { useForm } from "react-hook-form";
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button'
import './Login.css';
import DB from './DB';

const db = new DB()

function Login() {
    const [redirect, setRedirect] = useState();
    const [user, setUser] = useState();
    const { register, handleSubmit } = useForm()

    const loginHandler = (d) => {
        if (!user) {
            db.login(d.email, d.password, (user) => {
                if (user) {
                    setUser(user);
                    setRedirect('/dashboard')
                }
                else alert("login error")
            })
        }
    }

    db.loginFetch((user) => {
        if (user) {
            setUser(user);
            setRedirect('/dashboard')
        }
    })

    if (redirect) return <Redirect push to={{ pathname: redirect, state: user }} />
    return (
        <div className="login-bg">
            <h1 className="title">Better Banking</h1>
            <Form className='login-container' onSubmit={handleSubmit(loginHandler)}>
                <h2>Login</h2>
                <br />
                <Form.Control type="email" name='email' placeholder='Email' className="textfield field" ref={register({ required: true })} />
                <Form.Control type="password" name='password' placeholder='Password' className="textfield field" ref={register({ required: true })} />
                <Button type="submit" className='submit'>Submit</Button>
                <br /><br /><br />
            </Form>
        </div>
    );
}

export default Login;