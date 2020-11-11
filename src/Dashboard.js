import './Dashboard.css';
import React, { useState } from 'react';
import { Redirect } from 'react-router';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
// import { faSignOutAlt } from '@fortawesome/free-solid-svg-icons'
import { PieChart, Pie, Cell } from 'recharts';
import DB from './DB'

const db = new DB()

const data = [
    { name: 'Group A', value: 600 },
    { name: 'Group B', value: 300 },
    { name: 'Group C', value: 300 },
    { name: 'Group D', value: 100 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const RADIAN = Math.PI / 180;
const renderCustomizedLabel = ({
    cx, cy, midAngle, innerRadius, outerRadius, percent, index,
}) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + (radius*0.95) * Math.cos(-midAngle * RADIAN);
    const y = cy + (radius*0.95) * Math.sin(-midAngle * RADIAN);

    return (
        <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
            {`${(percent * 100).toFixed(0)}%`}
        </text>
    );
};

function Dashboard() {
    const [redirect, setRedirect] = useState();
    const [redirectProps, setRedirectProps] = useState();

    var user = db.getUser('0192319023103')
    console.log(user)

    if (redirect) return <Redirect push to={{ pathname: redirect, state: redirectProps }} />
    return (
        <div className="dashboard-back">
            {/* <FontAwesomeIcon icon={faSignOutAlt} className="logout"/> */}
            <div className="profile-button zoom-m" onClick={() => setRedirect('/profile')}></div>
            <div className="name">Shayan</div>
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
                    <PieChart width={300} height={300} className="chart">
                        <Pie data={data} labelLine={false} label={renderCustomizedLabel} outerRadius={150} innerRadius={110} fill="#8884d8" dataKey="value" >
                            { data.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />) }
                        </Pie>
                    </PieChart>
                    <div className="history-list">
                        {
                            [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1].map((item, i) => (
                                <div className="history" key={i}>
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
                            <img src="visa-icon.svg" alt="visa" height="18px" />
                        </div>
                        <div className="card-no">{'4591 \u2022\u2022\u2022\u2022 \u2022\u2022\u2022\u2022 \u2022\u202235'}</div>
                    </div>
                </div>

            </div>
        </div>
    );
}

export default Dashboard;