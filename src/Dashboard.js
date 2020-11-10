import React from 'react';
import './Dashboard.css'

function Dashboard() {
    return (
        <div className="dashboard-back">
                <div className="profile-button"></div>
                <br/><br/>
            <div className="dashboard-main">
                <span className="balance">5023.06</span>
                <div className="recents">
                    <div className="person">
                        <div className="person-pic"></div>
                        <span className="person-name">Nishank</span>
                    </div>
                    <div className="person">
                        <div className="person-pic"></div>
                        <span className="person-name">Revathi</span>
                    </div>
                </div>
            </div>
            <div className="dashboard-subcontent">

            </div>
        </div>
    );
}

export default Dashboard;