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

	getUser = (accno, callback) => {
		let ref = firebase.database().ref('/' + accno);
		ref.on('value', async (snapshot) => {
			// var user = firebase.auth().currentUser;
			// var data = await snapshot.val()
			// user.updateProfile({
			// 	displayName: data.accno
			// }).then(function () {
			// 	console.log("success");
			// }).catch(function (error) {
			// 	console.log(error);
			// });
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
				this.getUser(user.displayName, callback)
			} else {
				callback()
			}
		});
	}

	logout = (callback) => {
		firebase.auth().signOut().then(callback).catch(error => console.log(error));
	}
}
export default DB;
