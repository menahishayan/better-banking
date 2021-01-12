import './Dashboard.css';
import React, { useState, useEffect, Fragment } from 'react';
import { useForm } from "react-hook-form";
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button'
import Spinner from 'react-bootstrap/Spinner'
import { Redirect } from 'react-router';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeft, faUtensils, faPlane, faShoppingBag, faReceipt, faFilm, faHandHoldingMedical, faCubes } from '@fortawesome/free-solid-svg-icons'
import DB from './DB'
import { Overlay, Chart, Card, PersonAvatar, COLORS } from './Components'

const db = new DB()

function Dashboard(props) {
    const [redirect, setRedirect] = useState();
    const [chartData, setChartData] = useState([]);
    const [recentPersons, setRecentPersons] = useState([]);
    const [profilePic, setProfilePic] = useState();
    const [payOverlay, setPayOverlay] = useState();
    const [newPayment, setNewPayment] = useState();
    const [error, setError] = useState();
    const [loading, setLoading] = useState(false);
    const [history, setHistory] = useState(false);
    const { register, handleSubmit } = useForm()

    var user = props.location.state

    useEffect(() => {
        db.getProfilePic(user.accno, (url) => {
            setProfilePic(url)
        })
        const getChartData = (transactions) => {
            let items = {}, arrayItems = []

            transactions.forEach(his => {
                if (items[his.category]) items[his.category].value += his.amount
                else items[his.category] = { name: his.category[0].toUpperCase() + his.category.slice(1), value: his.amount }
            })

            for (let item in items) {
                arrayItems.push(items[item])
            }

            setChartData(arrayItems);
        }
        const getRecentPersons = (transactions) => {
            var recentPersonsSet = {}
            setRecentPersons([])
            transactions.forEach(his => {
                if (his.type === 'person') {
                    db.getUser(his.to, (user) =>
                        db.getProfilePic(his.to, (url) => {
                            recentPersonsSet[user.accno] = { to: user.accno, name: user.name, shortname: user.shortname, img: url }
                            for( let rpsIndex in recentPersonsSet) {
                                console.log(rpsIndex);
                                setRecentPersons(r => [...new Set([...r,recentPersonsSet[rpsIndex]])])
                            }
                        })
                    )
                }
            })
        }
        db.getTransactions(user.accno, user.history, transactions => {
            setHistory(transactions)
            getChartData(transactions)
            getRecentPersons(transactions)
        })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user.accno, user.history])

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
                        recentPersons.length > 1  && recentPersons.map((person, p) =>
                            <Fragment key={p}><PersonAvatar person={person} onClick={() => { setPayOverlay(true); setNewPayment({ person }) }} /></Fragment>
                        )
                    }
                </div>
            </div>
            <div className="dashboard-subcontent">
                <div style={{ width: '78%' }}>
                    <h1>History</h1>
                    <Chart chartData={chartData} />
                    <div className="history-list">
                        { //add txn id & to and from tracking on both sides
                            history && history.map((item, i) => (
                                <div className="history" key={i}>
                                    <div className="history-icon" style={{ backgroundColor: COLORS[i % COLORS.length] }}>{getCategoryIcon(item.category)}</div>
                                    <span className="history-name">{item.name || item.to}</span>
                                    <span className="history-description">{item.description}</span>
                                    {
                                        item.to === user.accno ?
                                            <span className="history-amount pos-amount">{item.amount}</span> : <span className="history-amount neg-amount">{item.amount}</span>
                                    }
                                </div>
                            ))
                        }
                    </div>
                </div>
                <div className="card-section">
                    <h1>Cards</h1>
                    {user.cards &&
                        <div>
                            <Card card={user.cards[0]} />
                        </div>
                    }
                </div>

            </div>
            { payOverlay &&
                <Overlay visible={payOverlay} bgClick={() => setPayOverlay(!payOverlay)}>
                    <Form onSubmit={handleSubmit(payHandler)}>
                        <PersonAvatar person={newPayment.person} inline />
                        <br />
                        <br />
                        <Form.Control type="number" name='amount' placeholder='Amount' className="textfield field" ref={register({ required: true })} />
                        <Form.Control type="text" name='description' placeholder='Message' className="textfield field" ref={register({ required: false })} />

                        <div className="history-icon" style={{ backgroundColor: 'rgb(226, 225, 225)', color: 'grey', marginLeft:'2%', marginRight: '2%' }}>{<FontAwesomeIcon icon={faUtensils} />}</div>
                        <div className="history-icon" style={{ backgroundColor: 'rgb(226, 225, 225)', color: 'grey', marginLeft:'2%', marginRight: '2%' }}>{<FontAwesomeIcon icon={faPlane} />}</div>
                        <div className="history-icon" style={{ backgroundColor: 'rgb(226, 225, 225)', color: 'grey', marginLeft:'2%', marginRight: '2%' }}>{<FontAwesomeIcon icon={faShoppingBag} />}</div>
                        <div className="history-icon" style={{ backgroundColor: 'rgb(226, 225, 225)', color: 'grey', marginLeft:'2%', marginRight: '2%' }}>{<FontAwesomeIcon icon={faHandHoldingMedical} />}</div>
                        <div className="history-icon" style={{ backgroundColor: 'rgb(226, 225, 225)', color: 'grey', marginLeft:'2%', marginRight: '2%' }}>{<FontAwesomeIcon icon={faFilm} />}</div>
                        <div className="history-icon" style={{ backgroundColor: 'rgb(226, 225, 225)', color: 'grey', marginLeft:'2%', marginRight: '2%' }}>{<FontAwesomeIcon icon={faReceipt} />}</div>
                        <div className="history-icon" style={{ backgroundColor: 'rgb(226, 225, 225)', color: 'grey', marginLeft:'2%', marginRight: '2%' }}>{<FontAwesomeIcon icon={faCubes} />}</div>
                        <br /><br /><br />
                        <Button type="submit" className='submit'>
                            {loading ? <Spinner
                                as="span"
                                animation="border"
                                role="status"
                                size="sm"
                            /> : 'Pay'}
                        </Button>
                        <br />
                        {error ? <p className="login-alert">{error}</p> : <br />}
                    </Form>
                </Overlay>
            }
        </div>
    );
}

export default Dashboard;