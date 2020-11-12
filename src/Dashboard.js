import './Dashboard.css';
import React, { useState, useEffect } from 'react';
import { Redirect } from 'react-router';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
// import { faSignOutAlt } from '@fortawesome/free-solid-svg-icons'
import { PieChart, Pie, Cell, Tooltip } from 'recharts';
import DB from './DB'

const db = new DB()

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

function Dashboard(props) {
    const [redirect, setRedirect] = useState();
    const [chartData, setChartData] = useState([]);
    var user = props.location.state

    const maskedCardNo = (number) => {
        return number.substring(0, 4) + number.substring(4, number.length - 2).replace(/\d/g, "\u2022") + number.substring(number.length - 2);
    }

    const loadProfilePic = (accno) => {
        db.getProfilePic(accno, (url) => {
            var img = document.getElementById('userpic');
            img.src = url;
            var img2 = document.getElementById('userpic2');
            img2.src = url;
        })
    }

    loadProfilePic(user.accno)

    useEffect(() => {
        const getChartData = () => {
            let items = {}, arrayItems = []

            user.history.forEach(his => {
                if (items[his.category]) items[his.category].value += his.amount
                else items[his.category] = { name: his.category[0].toUpperCase() + his.category.slice(1), value: his.amount }
            })

            for (let item in items) {
                arrayItems.push(items[item])
            }

            setChartData(arrayItems);
        }
        getChartData()
    }, [user.history])

    const chartLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }) => {
        const radius = innerRadius + (outerRadius - innerRadius) * 0.25;
        const x = cx + radius * Math.cos(-midAngle * (Math.PI / 180));
        const y = cy + radius * Math.sin(-midAngle * (Math.PI / 180));

        return (
            <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
                {chartData[index].name}
            </text>
        );
    };

    const chartTooltip = ({ active, payload, label }) => {
        if (active) {
            return (
                <div className="chart-tooltip">
                    <b>{`${payload[0].name}`}</b><br />
                    {` \u20B9${payload[0].value.toFixed(2)}`}
                </div>
            );
        }

        return null;
    };

    if (redirect) return <Redirect push to={{ pathname: redirect, state: user }} />
    return (
        <div className="dashboard-back">
            {/* <FontAwesomeIcon icon={faSignOutAlt} className="logout"/> */}
            <img id="userpic" className="profile-button zoom-m" onClick={() => setRedirect('/profile')} alt="userpic" />
            <div className="name">{user.shortname}</div>
            <br /><br />
            <div className="dashboard-main">
                <span className="balance amount">{user.balance.toFixed(2)}</span>
                <div className="recents">
                    <div className="person zoom-m">
                        <div>
                            <img id="userpic2" alt="userpic" className="person-pic" />
                        </div>
                        <span className="person-name">Shayan</span>
                    </div>
                    <div className="person zoom-m">
                        {/* <div className="person-pic"></div> */}
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
                        <Pie data={chartData} labelLine={false} label={chartLabel} outerRadius={150} innerRadius={110} fill="#8884d8" dataKey="value" >
                            {chartData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                        </Pie>
                        <Tooltip content={chartTooltip} />
                        {/* <Legend /> */}
                    </PieChart>
                    <div className="history-list">
                        {
                            user.history.map((item, i) => (
                                <div className="history" key={i}>
                                    <div className="history-icon"></div>
                                    <span className="history-name">{item.name}</span>
                                    <span className="history-description">{item.description}</span>
                                    <span className="history-amount amount">{item.amount}</span>
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
                        <div className="card-no">{maskedCardNo(user.cards[0].number)}</div>
                    </div>
                </div>

            </div>
        </div>
    );
}

export default Dashboard;