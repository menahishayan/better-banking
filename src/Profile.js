import React from 'react';
import { Button } from 'react-bootstrap';

function Profile() {
    return (
        <div>
            <h1>Profile</h1>
            <p> <h3>NAME</h3></p>
            <p> <h3>Phone Number</h3></p>
            <p> <h3>Aadhar</h3></p>
            <p> <h3>Pan Number</h3></p>
            <Button type="primary">
                Back
            </Button>
        </div>
    );
}

export default Profile;