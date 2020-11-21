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

	createUser = (email, password, callback) => {
		firebase.auth().createUserWithEmailAndPassword(email, password).then((result) => {
			console.log(result);

			const numbers = '1234567890'
			let userID = ' '
			for (let i = 0; i < 13; ++i)
				userID += numbers.charAt(Math.floor(Math.random() * numbers.length))

			console.log(userID);

			let userProfile = {
				accno: userID,
				balance: 0,
				email: email,
				name: "",
				shortname: "",
				cards: [],
				history: []
			}

			firebase.auth().onAuthStateChanged((user) => {
				if (user) {
					user.updateProfile({
						displayName: userProfile.accno
					}).then(function () {
						console.log("success");
						let ref = firebase.database().ref('/' + userProfile.accno);
						ref.set(userProfile)
						callback()
					}).catch(function (error) {
						console.log(error);
					});
				}
			});

		}).catch((error) => {
			console.log("Error");
			console.log(error.message);
		});
	}

	edit = (callback) => {

		// firebase.auth().onAuthStateChanged((user) => {
		// 	if (user) {
		// 		user.updateProfile({
		// 			displayName: userProfile.accno
		// 		}).then(function () {
		// 			console.log("success");
		// 			let ref = firebase.database().ref('/' + userProfile.accno);
		// 			ref.set(userProfile)
		// 			callback()
		// 		}).catch(function (error) {
		// 			console.log(error);
		// 		});
		// 	}
		// });
	}

	updatePass = (callback) => {
		firebase.auth().onAuthStateChanged((user) => {
			if (user) {
				var newPassword;
				user.updatePassword(newPassword).then(function () {
					console.log("success");
				}).catch(function (error) { });
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
