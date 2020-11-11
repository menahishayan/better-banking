import React from 'react';
import { Button } from 'react-bootstrap';

function Profile() {
    return (
        <div>
            <h1>Profile</h1>
            <div className="person zoom-m">
                        <div className="person-pic"></div>
                        <span className="person-name">Nishank</span>
                    </div>
            <Button type="primary">
                Back
            </Button>
        </div>
    );
}
export default Profile;