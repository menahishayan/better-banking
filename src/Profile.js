import React, { useState, useEffect } from 'react';
import { Redirect, useHistory } from 'react-router';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useForm } from "react-hook-form";
import { faArrowLeft, faPencilAlt } from '@fortawesome/free-solid-svg-icons'
import Button from 'react-bootstrap/Button'
import Form from 'react-bootstrap/Form';
import './Profile.css';
import DB from './DB'
import { Overlay } from './Components'

const db = new DB()

function Profile(props) {
    const [user, setUser] = useState(props.location.state);
    const [redirect, setRedirect] = useState();
    const [profilePic, setProfilePic] = useState();
    const [showEdit, setshowEdit] = useState(false);
    // const [showDetails, setshowDetails] = useState(true);
    const [changePassword, setchangePassword] = useState(false);
    const { register, handleSubmit } = useForm()
    const [error, setError] = useState();
    const history = useHistory()

    useEffect(() => {
        console.log("USEEFFECT");

        db.getProfilePic(user.accno, (url) => {
            setProfilePic(url)
        })
    }, [])
    const passwordHandler = (d) => {
        console.log("PASSWORD HANDLER");
        db.updatePass(d)
    }

    const editdHandler = (d) => {
        console.log("EDIT HANDLER");
        db.edit(user.accno, d, (u) => {
                console.log(u);
                setUser(u)
                setshowEdit(false)
        })
        // setRedirect('/profile')

        // user = props.location.state;
        // console.log(user);

        // history.go(0)
    }

    if (redirect) return <Redirect push to={{ pathname: redirect, state: user }} />

    return (
        <div>
            <FontAwesomeIcon icon={faArrowLeft} className="back-button zoom-m" onClick={() => setRedirect('/dashboard')} />
            <div className='profile-back'> &nbsp;</div>
            <div className='profile-subcontent'>
                {
                    !showEdit ? <div>
                        <div className="profile zoom-m">
                            <div ><img src={profilePic} className="profile-pic" alt="" /></div>
                            <span className="person-name">{user.name}</span>
                        </div><br />
                        <div className='edit zoom-m' onClick={() => (setshowEdit(true))}><FontAwesomeIcon icon={faPencilAlt} /></div>
                        <div className='info'><b>Short Name :</b> {user.shortname}</div>
                        <div className='info'><b>Account Number:</b> {user.accno}</div>
                        <div className='info'><b>Date of Birth :</b> {user.dob}</div>
                        <div className='info'><b>Phone :</b> {user.phone}</div>
                        <div className='info'><b>Email :</b> {user.email}</div>
                        <div className='info'><b>UPI ID :</b> {user.upi}</div>
                        <Button className='change' onClick={() => setchangePassword(true)}>Change Password</Button>
                        {
                            changePassword &&
                            <Overlay visible={changePassword} bgClick={() => setchangePassword(!changePassword)} height={40} width={50}>
                                <div style={{ display: 'inline-block', width: '100%', overflow: 'scroll', marginTop: '-2%' }}>
                                    <Form onSubmit={handleSubmit(passwordHandler)} autocomplete="off">
                                        <Form.Control type="password" name='oldPassword' placeholder='Old Password' className="textfield field" ref={register({ required: true })} autocomplete="off" />
                                        <Form.Control type="password" name='newPassword' placeholder='New Password' className="textfield field" ref={register({ required: true })} />
                                        <Form.Control type="password" name='confirmNewPassword' placeholder='Confirm New Password' className="textfield field" ref={register({ required: true })} />
                                        <Button className='submitProfile' type='submit'>Submit</Button>
                                    </Form>
                                </div>
                            </Overlay>
                        }
                    </div>:
                    <div visible={showEdit}>
                        <div className="profile zoom-m">
                            <div ><img src={profilePic} className="profile-pic" alt="" /></div>
                            <span className="person-name">{user.name}</span>
                        </div>
                        <FontAwesomeIcon icon={faArrowLeft} style={{ color: 'black' }} className="back-button zoom-m" onClick={() => (setshowEdit(false))} />
                        <Form onSubmit={handleSubmit(editdHandler)} autocomplete="off" >
                            <Form.Group style={{ display: 'inline-flex', width: '100%', margin: '0 0% 1% 4%' }}>
                                Name :<Form.Control type="text" name='name' placeholder={user.name} className="textfield efield" ref={register({ required: false })} />
                                Short Name :<Form.Control type="text" name='shortname' placeholder={user.shortname} className="textfield efield" ref={register({ required: false })} style={{ marginLeft: '3.5%' }} />
                            </Form.Group>
                            <Form.Group style={{ display: 'inline-flex', width: '100%', margin: '0 0% 1% 4%' }}>
                                UPI ID :<Form.Control type="text" name='upi' placeholder={user.upi} className="textfield efield" ref={register({ required: false })} />
                                Date of Birth :<Form.Control type="text" name='dob' placeholder={user.dob} className="textfield efield" ref={register({ required: false })} style={{ marginLeft: '2.5%' }} />
                            </Form.Group>
                            <Form.Group style={{ display: 'inline-flex', width: '100%', margin: '0 0% 1% 4%' }}>
                                Phone :<Form.Control type="text" name='phone' placeholder={user.phone} className="textfield efield" ref={register({ required: false })} />
                                {/* Account Num :<Form.Control type="text" name='oldPassword' placeholder={user.accno} className="textfield efield" ref={register({ required: false })} /> */}
                            </Form.Group>
                            <Button className='submitProfile' type='submit' style={{ width: '30%' }}>Submit</Button>
                        </Form>
                    </div>
                }
            </div>
        </div>
    );
}
export default Profile;
{/* <div>
                    {   
                        Object.keys(user).map((item, i) => (
                            <div>
                                {user[item].toString()}
                            </div>
                        ))
                    }
                </div> */}