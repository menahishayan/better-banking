import firebase from 'firebase/app';
import 'firebase/database';
import 'firebase/storage';
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
		ref.on('value', async(snapshot) => {
			callback(await snapshot.val())
		})
	}
	getProfilePic = (accno, callback) => {
		let ref = firebase.storage().ref('dp/' + accno + '.jpg');
		ref.getDownloadURL().then(callback).catch(err => console.log(err))
	}
}
export default DB;
