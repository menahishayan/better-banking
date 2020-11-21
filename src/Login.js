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
    const [signUp, setsignUp] = useState(false);
    const [login, setlogin] = useState("Login");
    const [loading, setLoading] = useState(false);
    const { register, handleSubmit, getValues } = useForm()

    const loginHandler = (d) => {
        setLoading(true)
        if (signUp) {
            db.createUser(d.email,d.password,(user) => {
                console.log(user);
                // setUser(user)
                // setRedirect('/profile')
            })
        }
        else {
            db.login(d.email, d.password, (error) => {
                setError(error.message)
                setLoading(false)
                console.log(error.code);
            })
        }
    }

    const loginCheck = () => {
        var email=getValues('email')
        db.login(email,'0', (error) => {
            setLoading(false)
            if(error.code==='auth/user-not-found'){
                setsignUp(true)
                setlogin("Sign Up")
            }
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
                <h2>{login}</h2>
                <br />
                <Form.Control type="email" name='email' placeholder='Email' className="textfield field" ref={register({ required: true })} onBlur={() => loginCheck() } />
                <Form.Control type="password" name='password' placeholder='Password' className="textfield field" ref={register({ required: true })} />
                {
                    signUp && <div>
                        <Form.Control type="password" name='confirm_password' placeholder='Confirm Password' className="textfield field" ref={register({ required: true })} />
                    </div>
                }
                <Button type="submit" className='submit'>
                    {loading ? <Spinner
                        as="span"
                        animation="border"
                        role="status"
                        size="sm"
                    />: login}
                </Button>
                <br /><br />
                {error ? <p className="login-alert">{error}</p> : <br />}
            </Form>
        </div>
    );
}

export default Login;