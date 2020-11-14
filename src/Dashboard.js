import './Dashboard.css';
import React, { useState, useEffect } from 'react';
import { useForm } from "react-hook-form";
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button'
import Spinner from 'react-bootstrap/Spinner'
import { Redirect } from 'react-router';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeft, faUtensils, faPlane, faShoppingBag } from '@fortawesome/free-solid-svg-icons'
import { PieChart, Pie, Cell, Tooltip } from 'recharts';
import DB from './DB'
import { Overlay } from './Components'

const db = new DB()

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

function Dashboard(props) {
    const [redirect, setRedirect] = useState();
    const [chartData, setChartData] = useState([]);
    const [recentPersons, setRecentPersons] = useState([]);
    const [profilePic, setProfilePic] = useState();
    const [payOverlay, setPayOverlay] = useState();
    const [newPayment, setNewPayment] = useState();
    const [error, setError] = useState();
    const [loading, setLoading] = useState(false);
    const { register, handleSubmit } = useForm()

    var user = props.location.state

    const maskedCardNo = (number) => {
        return number.substring(0, 4) + number.substring(4, number.length - 2).replace(/\d/g, "\u2022") + number.substring(number.length - 2);
    }

    useEffect(() => {
        db.getProfilePic(user.accno, (url) => {
            setProfilePic(url)
        })
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
        const getRecentPersons = () => {
            setRecentPersons([])
            user.history.forEach(his => {
                if (his.type === 'person') {
                    db.getUser(his.accno, (user) =>
                        db.getProfilePic(his.accno, (url) => {
                            setRecentPersons(r => [...r, { accno: user.accno, name: user.name, shortname: user.shortname, img: url }])
                        })
                    )
                }
            })
        }
        getChartData()
        getRecentPersons()
    }, [user.accno, user.history])

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

    const payHandler = (d) => {
        console.log(d);
    }

    const getCategoryIcon = (category) => {
        switch (category) {
            case 'food': return <FontAwesomeIcon icon={faUtensils} />
            case 'travel': return <FontAwesomeIcon icon={faPlane} />
            case 'shopping': return <FontAwesomeIcon icon={faShoppingBag} />
            default: return ''
        }
    }

    if (redirect) return <Redirect push to={{ pathname: redirect, state: user }} />
    return (
        <div className="dashboard-back">
            <FontAwesomeIcon icon={faArrowLeft} className="back-button zoom-m" onClick={() => db.logout(() => setRedirect('/'))} />
            <img src={profilePic} className="profile-button zoom-m" onClick={() => setRedirect('/profile')} alt="" />
            <div className="name">{user.shortname}</div>
            <br /><br />
            <div className="dashboard-main">
                <span className="balance amount">{user.balance.toFixed(2)}</span>
                <div className="recents">
                    {
                        recentPersons && recentPersons.map((person, p) =>
                            <div className="person zoom-m" key={p} onClick={() => { setPayOverlay(true); setNewPayment({ person }) }}>
                                {
                                    person.img ?
                                        <div>
                                            <img src={person.img} alt={person.shortname} className="person-pic" />
                                        </div> :
                                        <div className="person-pic"></div>
                                }
                                <span className="person-name">{person.shortname}</span>
                            </div>
                        )
                    }
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
                        { //add txn id & to and from tracking on both sides
                            user.history.map((item, i) => (
                                <div className="history" key={i}>
                                    <div className="history-icon" style={{ backgroundColor: COLORS[i % COLORS.length] }}>{getCategoryIcon(item.category)}</div>
                                    <span className="history-name">{item.name || item.accno}</span>
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
            { payOverlay &&
                <Overlay visible={payOverlay} bgClick={() => setPayOverlay(!payOverlay)} height={25} width={50}>

                    <Form onSubmit={handleSubmit(payHandler)}>
                        <div style={{ display: 'inline-block' }}>
                            <div style={{ display: 'inline-block' }}>
                                {
                                    newPayment.person.img ?
                                        <div>
                                            <img src={newPayment.person.img} alt={newPayment.person.shortname} className="person-pic" />
                                        </div> :
                                        <div className="person-pic"></div>
                                }
                            </div>
                            <div style={{ display: 'inline-block' }}>

                            <span style={{fontSize:22, fontWeight:'bold'}}>Pay {newPayment.person.name}</span><br/>
                            <span>{newPayment.person.accno}</span>
                        </div>
                        </div>

                        <br />
                        <Form.Control type="number" name='amount' placeholder='Amount' className="textfield field" ref={register({ required: true })} />
                        <Form.Control type="text" name='description' placeholder='Message' className="textfield field" ref={register({ required: false })} />
                        <Button type="submit" className='submit'>
                            {loading ? <Spinner
                                as="span"
                                animation="border"
                                role="status"
                                size="sm"
                            /> : 'Pay'}
                        </Button>
                        <br /><br />
                        {error ? <p className="login-alert">{error}</p> : <br />}
                    </Form>
                </Overlay>
            }
        </div>
    );
}

export default Dashboard;