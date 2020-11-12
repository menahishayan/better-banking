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
            let id = ''
            switch(d.email) {
                case 'menahi.shayan@gmail.com': id='P1UUbhJEx6T63ceqWw1RDGKXmo12'; break;
                case 'nishank.swamy@gmail.com': id='Gkv2Z8gyfINuWc5ofF8C1BVGwAm2'; break;
                case 'revathipodaralla123@gmail.com': id='GRxen20Hy2PWt00dxEj4LRk9z5V2'; break;
                default: console.log('login error');
            }
            db.getUser(id, (user) => {
                setUser(user);
                setRedirect('/dashboard')
            })
        }
    }

    if (redirect) return <Redirect push to={{ pathname: redirect, state: user }} />
    return (
        <div className="login-bg">
            <h1 className="title">Better Banking</h1>
            <Form className='login-container' onSubmit={handleSubmit(loginHandler)}>
                <h2>Login</h2>
                <br/>
                <Form.Control type="email" name='email' placeholder='Email' className="textfield field" ref={register({ required: true })} />
                <Form.Control type="password" name='password' placeholder='Password' className="textfield field" ref={register({ required: true })} />
                <Button type="submit" className='submit'>Submit</Button>
                <br/><br/><br/>
            </Form>
        </div>
    );
}

export default Login;