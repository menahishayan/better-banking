import './Dashboard.css';
import React, { useState, useEffect, Fragment } from 'react';
import { useForm } from "react-hook-form";
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button'
import Spinner from 'react-bootstrap/Spinner'
import { Redirect } from 'react-router';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeft, faUtensils, faPlane, faShoppingBag } from '@fortawesome/free-solid-svg-icons'
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
    const { register, handleSubmit } = useForm()

    var user = props.location.state

    useEffect(() => {
        db.getProfilePic(user.accno, (url) => {
            setProfilePic(url)
        })
        const getChartData = () => {
            let items = {}, arrayItems = []

            user.history && user.history.forEach(his => {
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
            user.history && user.history.forEach(his => {
                if (his.type === 'person') {
                    db.getUser(his.accno, (user) =>
                        db.getProfilePic(his.accno, (url) => {
                            console.log(url);
                            setRecentPersons(r => [...r, { accno: user.accno, name: user.name, shortname: user.shortname, img: url }])
                        })
                    )
                }
            })
        }
        getChartData()
        getRecentPersons()
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
                        recentPersons && recentPersons.map((person, p) =>
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
                            user.history && user.history.map((item, i) => (
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

                        <div className="history-icon" style={{ backgroundColor: 'rgb(226, 225, 225)', color: 'grey' }}>{<FontAwesomeIcon icon={faUtensils} />}</div>
                        <div className="history-icon" style={{ backgroundColor: 'rgb(226, 225, 225)', color: 'grey' }}>{<FontAwesomeIcon icon={faPlane} />}</div>
                        <div className="history-icon" style={{ backgroundColor: 'rgb(226, 225, 225)', color: 'grey' }}>{<FontAwesomeIcon icon={faShoppingBag} />}</div>
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