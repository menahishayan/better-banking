import React, { useState, useEffect } from 'react';
import { Redirect } from 'react-router';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeft} from '@fortawesome/free-solid-svg-icons'
import './Profile.css';

function Profile(props) {
    const [redirect, setRedirect] = useState();

    var user = props.location.state;
    if (redirect) return <Redirect push to={{ pathname: redirect, state: user }} />

    console.log(user);
    return (
        <div>
            <FontAwesomeIcon icon={faArrowLeft} className="back-button zoom-m" onClick={() => setRedirect('/dashboard')}/>
            <div className='profile-back'> &nbsp;</div>
            <div className='profile-subcontent'>
                <div className="profile zoom-m">
                    <div className="profile-pic"></div>
                    <span className="person-name">{user.name}</span>
                </div><br />
                <div className='info'><b>Short Name :</b> {user.name}</div>
                <div className='info'><b>Account Number:</b> {user.name}</div>
                <div className='info'><b>Date of Birth :</b> {user.name}</div>
                <div className='info'><b>Phone :</b> {user.name}</div>
                <div className='info'><b>Email :</b> {user.name}</div>
                <div className='info'><b>UPI ID :</b> {user.name}</div>
                <div className='info'><b>change Password :</b> {user.name}</div>
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