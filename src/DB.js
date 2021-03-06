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
		let ref = firebase.database().ref('/users/' + accno);
		ref.once('value').then( async (snapshot) => {
			// var user = firebase.auth().currentUser;
			// var data = await snapshot.val()
			// user.updateProfile({
			// 	displayName: data.accno
			// }).then(function () {
			// 	console.log("success");
			// }).catch(function (error) {
			// 	console.log(error);
			// });
			console.log("Get User");
			callback && callback(await snapshot.val())
		})
	}
	getProfilePic = (accno, callback) => {
		let ref = firebase.storage().ref('dp/' + accno + '.jpg');
		ref.getDownloadURL().then(callback).catch(err => console.log(err.code))
	}

	login = (email, pass, successCallback, errorCallback) => {
		firebase.auth().signInWithEmailAndPassword(email, pass).then((data) => this.getUser(data.user.displayName, successCallback)).catch(errorCallback);
	}

	createUser = (email, password, callback) => {
		firebase.auth().createUserWithEmailAndPassword(email, password).then((result) => {
			console.log(result);

			const numbers = '1234567890'
			let userID = ''
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
						let ref = firebase.database().ref('/users/' + userProfile.accno);
						ref.set(userProfile)
						callback(user)
					}).catch(err => console.log(err));
				}
			});

		}).catch((error) => {
			console.log("Error");
			console.log(error.message);
		});
	}

	getTransactions = (accno, ids, callback) => {
		if(!ids) {
			callback([])
		} else {
			let ref = firebase.database().ref('/transactions');
			ref.on('value', async (snapshot) => {
				let list = []
				let data  = await snapshot.val();
	
				for (let d in data) 
					if(ids.includes(d)) {
						if(data[d].to === accno) {
							this.getUser(data[d].from, user => {
								data[d].name = user.name
							})
						}
						list.push(data[d])
					}
	
				callback && callback(list)
			})
		}
	}

	edit = (accno, d, callback) => {
		console.log(accno);
		this.getUser(accno, (data) => {
			console.log(data);
			var newData = {
				accno: data.accno,
				balance: data.balance,
				history: data.history,
				name: d.name || data.name,
				shortname: d.shortname || data.shortname,
				upi: d.upi || data.upi,
				dob: d.dob || data.dob,
				phone: d.phone || data.phone,
				cards: data.cards
			}
			firebase.database().ref('/users/' + accno).update(newData, callback(newData))
		})
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

	dec2hex = (dec) => {
		return ('0' + dec.toString(16)).substr(-2)
	}

	generateId = (len) => {
		var arr = new Uint8Array((len || 40) / 2)
		window.crypto.getRandomValues(arr)
		return Array.from(arr, this.dec2hex).join('')
	}

	payHandler = (txnData, index, successCallback, errorCallback) => {
		let ref = firebase.database().ref('/users/' + txnData.from);
		ref.child('balance').once('value').then(async (snapshot) => {
			let balance = await snapshot.val()

			if (balance >= txnData.amount){
				let txnid = this.generateId(10)
				let txnRef = firebase.database().ref('/transactions/'+txnid);
				txnRef.set(txnData) 
		
				let histRef = ref.child('history')
				let historyContent = {}
				historyContent[index] = txnid
				histRef.update(historyContent)

				balance -= txnData.amount
				ref.update({balance})

				let reciever = firebase.database().ref('/users/' + txnData.to);
				reciever.once('value').then( async(snapshot) => {
					let data = await snapshot.val()
					if(data) {
						reciever.update({balance: data.balance + txnData.amount})
					}
				})

				successCallback(balance, txnid)
			}else{
				errorCallback("Insufficient balance")
			}

		})

		
	}

	logout = (callback) => {
		firebase.auth().signOut().then(callback).catch(error => console.log(error));
	}
}
export default DB;
