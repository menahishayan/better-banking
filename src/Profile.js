import React, { useState, useEffect } from 'react';
import { Redirect } from 'react-router';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useForm } from "react-hook-form";
import { faArrowLeft, faPencilAlt } from '@fortawesome/free-solid-svg-icons'
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form';
import './Profile.css';
import DB from './DB'
import { Overlay } from './Components'

const db = new DB()

function Profile(props) {
    const [redirect, setRedirect] = useState();
    const [profilePic, setProfilePic] = useState();
    const [changePassword, setchangePassword] = useState(false);
    const { register, handleSubmit } = useForm()
    const [error, setError] = useState();

    var user = props.location.state;
    useEffect(() => {
        db.getProfilePic(user.accno, (url) => {
            setProfilePic(url)
        })
    })
    const passwordHandler = (d) => {
        db.login(d.email, d.password, (error) => {
            setError(error.message)
        })
    }
    if (redirect) return <Redirect push to={{ pathname: redirect, state: user }} />

    console.log(user);
    return (
        <div>
            <FontAwesomeIcon icon={faArrowLeft} className="back-button zoom-m" onClick={() => setRedirect('/dashboard')} />
            <div className='profile-back'> &nbsp;</div>
            <div className='profile-subcontent'>
                <div className="profile zoom-m">
                    <div ><img src={profilePic} className="profile-pic" alt="" /></div>
                    <span className="person-name">{user.name}</span>
                </div><br />
                <div className='edit'><FontAwesomeIcon icon={faPencilAlt} /></div>
                <div className='info'><b>Short Name :</b> {user.shortname}</div>
                <div className='info'><b>Account Number:</b> {user.accno}</div>
                <div className='info'><b>Date of Birth :</b> {user.dob}</div>
                <div className='info'><b>Phone :</b> {user.phone}</div>
                <div className='info'><b>Email :</b> {user.email}</div>
                <div className='info'><b>UPI ID :</b> {user.upi}</div>
                <Button className='change' onClick={() => setchangePassword(true)}>Change Password</Button>
                { changePassword &&
				<Overlay visible={changePassword} bgClick={() => setchangePassword(!changePassword)} height={40} width={50}>
					<div style={{display:'inline-block', width: '100%', overflow:'scroll',marginTop:'-2%'}}>
                    <Form onSubmit={handleSubmit(passwordHandler)}>
                        <Form.Control type="password" name='oldPassword' placeholder='Old Password' className="textfield field" ref={register({ required: true })} />
                        <Form.Control type="password" name='newPassword' placeholder='New Password' className="textfield field" ref={register({ required: true })} />
                        <Form.Control type="password" name='confirmNewPassword' placeholder='Confirm New Password' className="textfield field" ref={register({ required: true })} />
                        <Button className='submit' type='submit'>Submit</Button>
                    </Form>
					</div>
				</Overlay>
			    }
                {changePassword && <div>

                    hi
                </div>
                }

                {/* <div>
                    {   
                        Object.keys(user).map((item, i) => (
                            <div>
                                {user[item].toString()}
                            </div>
                        ))
                    }
                </div> */}
            </div>
        </div>
    );
}
export default Profile;