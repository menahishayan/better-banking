import './Dashboard.css';
import React, { useState, useEffect, Fragment } from 'react';
import { useForm } from "react-hook-form";
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button'
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
    const [selectedCategory, setSelectedCategory] = useState();
    const [error, setError] = useState();
    const [loading, setLoading] = useState(false);
    const [history, setHistory] = useState(false);
    const { register, handleSubmit } = useForm()

    var user = props.location.state
    const [balance, setBalance] = useState(user.balance.toFixed(2));

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
                    db.getUser(his.to !== user.accno ? his.to : his.from, (u) =>
                        db.getProfilePic(his.to !== user.accno ? his.to : his.from, (url) => {
                            recentPersonsSet[u.accno] = { to: u.accno, name: u.name, shortname: u.shortname, img: url }
                            let tempArray = []
                            for (let rps in recentPersonsSet) {
                                tempArray.push(recentPersonsSet[rps])
                            }
                            setRecentPersons(tempArray)
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


    const accnoCheck = (e) => {
        let accno = e.target.value
        if (!accno) setError('Please enter an account number')
        else if (accno.length < 13) setError('Please enter a valid account number')
        else setError('')
    }

    const amountCheck = (e) => {
        let amount = e.target.value
        if (!amount) setError('Please enter a valid amount')
        else setError('')
    }

    const payHandler = (d) => {
        let txnData = {
            name:newPayment ? newPayment.person.name : d.name,
            from: user.accno, 
            to:newPayment ? newPayment.person.to : d.accno, 
            amount:parseInt(d.amount), 
            description:d.description, 
            date: new Date().toJSON().slice(0, 10), 
            category:getCategoryName(selectedCategory),
            type: 'person'
        }
        db.payHandler(txnData,user.history.length, (balance,txnid) => {
            setBalance(balance)
            user.history.push(txnid)
            setPayOverlay(false)
        }, (er) => {
            if(er) setError(er)
        })
    }

    const getCategoryIcon = (category) => {
        switch (category) {
            case 'food': return <FontAwesomeIcon icon={faUtensils} />
            case 'travel': return <FontAwesomeIcon icon={faPlane} />
            case 'shopping': return <FontAwesomeIcon icon={faShoppingBag} />
            case 'medical': return <FontAwesomeIcon icon={faHandHoldingMedical} />
            case 'entertainment': return <FontAwesomeIcon icon={faFilm} />
            case 'bills': return <FontAwesomeIcon icon={faReceipt} />
            default: return <FontAwesomeIcon icon={faCubes} />
        }
    }

    const getCategoryName = (category) => {
        switch (category) {
            case faUtensils: return 'food'
            case faPlane: return 'travel'
            case faShoppingBag: return 'shopping'
            case faHandHoldingMedical: return 'medical'
            case faFilm: return 'entertainment'
            case faReceipt: return 'bills'
            default: return 'other'
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
                <span className="balance amount">{balance}</span>
                <div className="recents">
                    {
                        recentPersons.length > 1 && recentPersons.map((person, p) =>
                            <Fragment key={p}><PersonAvatar person={person} onClick={() => { setPayOverlay(true); setNewPayment({ person }); setSelectedCategory(faUtensils); }} /></Fragment>
                        )
                    }
                    <div className="new-pay-button zoom-m" onClick={() => { setPayOverlay(true); setNewPayment(); setSelectedCategory(faUtensils); }}>+</div>
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
                        {newPayment ?
                            <Fragment>
                                <PersonAvatar person={newPayment.person} inline />
                                <br />
                                <br />
                            </Fragment>
                            :
                            <Fragment>
                                <br />
                                <h2>Quick Transfer</h2>
                                <br />
                                <Form.Control type="text" name='name' placeholder='Full Name' className="field" style={{ textAlign: 'center' }} ref={register({ required: true })} />
                                <Form.Control type="text" name='accno' placeholder='Account Number' className="field" style={{ textAlign: 'center' }} ref={register({ required: false })} onBlur={accnoCheck} />
                            </Fragment>
                        }

                        <Form.Control type="number" name='amount' placeholder='0' className="field pay-amount" ref={register({ required: true })} onBlur={amountCheck} />
                        <Form.Control type="text" name='description' placeholder='Message' className="field" style={{ textAlign: 'center' }} ref={register({ required: true })} />

                        {
                            [faUtensils, faPlane, faShoppingBag, faHandHoldingMedical, faFilm, faReceipt, faCubes].map((item, i) =>
                                <div key={i} className={`pay-category-icon ${selectedCategory === item ? "selected-pay-category" : ""}`} onClick={() => setSelectedCategory(item)}><FontAwesomeIcon icon={item} /></div>
                            )
                        }

                        <br /><br /><br />
                        <Button type="submit" className='submit' style={{padding: '2%', width: '100%', borderRadius:12, fontWeight:'bold', fontSize:18}}>Pay</Button>
                        <br />
                        {error ? <p className="login-alert">{error}</p> : <br />}
                    </Form>
                </Overlay>
            }
        </div>
    );
}

export default Dashboard;