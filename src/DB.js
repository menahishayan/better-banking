import firebase from 'firebase/app';
import 'firebase/database';
import 'firebase/storage';
import 'firebase/auth';
import config from './config';
import React from 'react';

class DB extends React.Component {
	constructor(props) {
		super(props);
		if (!firebase.apps.length) {
			firebase.initializeApp(config);
		}
	}

	getUser = (uid, callback) => {
		let ref = firebase.database().ref('/' + uid);
		ref.on('value', async (snapshot) => {
			callback(await snapshot.val())
		})
	}
	getProfilePic = (accno, callback) => {
		let ref = firebase.storage().ref('dp/' + accno + '.jpg');
		ref.getDownloadURL().then(callback).catch(err => console.log(err))
	}

	login = (email, pass, errorCallback) => {
		firebase.auth().signInWithEmailAndPassword(email, pass).catch(errorCallback);
	}

	loginFetch = (callback) => {
		firebase.auth().onAuthStateChanged((user) => {
			if (user) {
				var uid = user.uid;
				this.getUser(uid, callback)
			} else {
				return
			}
		});
	}
}
export default DB;
