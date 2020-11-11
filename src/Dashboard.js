import React from 'react';
import './Dashboard.css'

function Dashboard() {
    return (
        <div className="dashboard-back">
            <div className="profile-button zoom-m"></div>
            <br /><br />
            <div className="dashboard-main">
                <span className="balance amount">5023.06</span>
                <div className="recents">
                    <div className="person zoom-m">
                        <div className="person-pic"></div>
                        <span className="person-name">Shayan</span>
                    </div>
                    <div className="person zoom-m">
                        <div className="person-pic"></div>
                        <span className="person-name">Nishank</span>
                    </div>
                    <div className="person zoom-m">
                        <div className="person-pic"></div>
                        <span className="person-name">Revathi</span>
                    </div>
                </div>
            </div>
            <div className="dashboard-subcontent">
                <div style={{ width: '78%' }}>
                    <h1>History</h1>
                    <div className="chart"></div>
                    <div className="history-list">
                        {
                            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1].map((item, i) => (
                                <div className="history">
                                    <div className="history-icon"></div>
                                    <span className="history-name">KFC</span>
                                    <span className="history-description">Arekere, Bannerghatta Road</span>
                                    <span className="history-amount amount">239.0</span>
                                </div>
                            ))
                        }
                    </div>
                </div>
                <div className="card-section">
                    <h1>Cards</h1>
                    <div className="card zoom-l">
                        <div className="card-type">
                            <img src="visa-icon.svg" alt="visa" height="18px"/>
                        </div>
                        <div className="card-no">{'4591 \u2022\u2022\u2022\u2022 \u2022\u2022\u2022\u2022 \u2022\u202235'}</div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Dashboard;