import React, { useState,useEffect } from 'react';
import { Redirect } from 'react-router';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeft,faPencilAlt } from '@fortawesome/free-solid-svg-icons'
import Button from 'react-bootstrap/Button'
import './Profile.css';
import DB from './DB'

const db = new DB()

function Profile(props) {
    const [redirect, setRedirect] = useState();
    const [profilePic, setProfilePic] = useState();

    var user = props.location.state;
    useEffect(() => {
        db.getProfilePic(user.accno, (url) => {
            setProfilePic(url)
        })
    })
    if (redirect) return <Redirect push to={{ pathname: redirect, state: user }} />

    console.log(user);
    return (
        <div>
            <FontAwesomeIcon icon={faArrowLeft} className="back-button zoom-m" onClick={() => setRedirect('/dashboard')} />
            <div className='profile-back'> &nbsp;</div>
            <div className='profile-subcontent'>
                <div className="profile zoom-m">
                    <div ><img src={profilePic} className="profile-pic"/></div>
                    <span className="person-name">{user.name}</span>
                </div><br />
                <div className='edit'><FontAwesomeIcon icon={faPencilAlt}/></div>
                <div className='info'><b>Short Name :</b> {user.shortname}</div>
                <div className='info'><b>Account Number:</b> {user.accno}</div>
                <div className='info'><b>Date of Birth :</b> {user.dob}</div>
                <div className='info'><b>Phone :</b> {user.phone}</div>
                <div className='info'><b>Email :</b> {user.email}</div>
                <div className='info'><b>UPI ID :</b> {user.upi}</div>
                <Button className='change'>Change Password</Button>
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