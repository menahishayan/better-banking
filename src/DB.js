import firebase from 'firebase/app';
import 'firebase/database';
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
}
export default DB;
