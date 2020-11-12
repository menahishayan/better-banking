import React from 'react';
import { Button } from 'react-bootstrap';
import './Profile.css';

function Profile() {
    return (
        <div className='profile-back'>
            {/* <h1>Profile</h1>
            <div className="person zoom-m">
                <div className="person-pic"></div>
                <span className="person-name">Nishank</span>
            </div>
            <Button type="primary">Back</Button> */}
            <div className="person zoom-m">
                <div className="person-pic"></div>
                <span className="person-name">Nishank</span>
            </div>
        </div>
    );
}
export default Profile;