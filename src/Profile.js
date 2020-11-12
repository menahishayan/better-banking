import React from 'react';
import { Button } from 'react-bootstrap';
import './Profile.css';

function Profile() {
    return (
        <div>
            <div className='profile-back'> &nbsp;</div>
            <div className='dashboard-subcontent' style={{marginTop:'-2%'}}>
                <div className="profile zoom-m">
                    <div className="profile-pic"></div>
                    <span className="person-name">Nishank</span>
                </div>
            </div>
        </div>
    );
}
export default Profile;