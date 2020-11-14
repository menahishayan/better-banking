import React, { useState } from 'react';
import { Redirect } from 'react-router';
import { useForm } from "react-hook-form";
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Spinner from 'react-bootstrap/Spinner';
import './Login.css';
import DB from './DB';

const db = new DB()

function Login() {
    const [redirect, setRedirect] = useState();
    const [user, setUser] = useState();
    const [error, setError] = useState();
    const [loading, setLoading] = useState(true);
    const { register, handleSubmit } = useForm()

    const loginHandler = (d) => {
        setLoading(true)
        db.login(d.email, d.password, (error) => {
            setError(error.message)
            setLoading(false)
        })
    }

    db.loginFetch((user) => {
        if (user) {
            setUser(user);
            setRedirect('/dashboard')
        } else {
            setLoading(false)
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
                <Button type="submit" className='submit'>
                    {loading ? <Spinner
                        as="span"
                        animation="border"
                        role="status"
                        size="sm"
                    />: 'Login'}
                </Button>
                <br /><br />
                {error ? <p className="login-alert">{error}</p> : <br />}
            </Form>
        </div>
    );
}

export default Login;