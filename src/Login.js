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

    const loginHandler = () => {
        if (!user) {
            db.getUser('0192319023103', (user) => {
                setUser(user);
                setRedirect('/dashboard')
            })
        }
    }

    if (redirect) return <Redirect push to={{ pathname: redirect, state: user }} />
    return (
        <div className="login-bg">
            <Form className='login-container' onSubmit={handleSubmit(loginHandler)}>
                <h2>Login</h2>
                <Form.Control type="text" name='username' placeholder='Username' className="textfield field" ref={register({ required: true })} /><br />
                <Form.Control type="password" name='password' placeholder='Password' className="textfield field" ref={register({ required: true })} /><br />
                <Button type="submit" className='submit'>Submit</Button>
            </Form>
        </div>
    );
}

export default Login;