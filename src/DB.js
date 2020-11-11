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

  getUser = (accno) => {
	let ref = firebase.database().ref('/' + accno);
	var data ;

	ref.on('value', async (snapshot) => {
		data= await snapshot.val()
		// new Promise(async(resolve, reject) => {
		
		// resolve(await snapshot.val())
		// })
	})
	return new Promise((resolve, reject) => {
   		setTimeout(() => {
	  	if (data) resolve(data)
   		}, 200)
	})
	// setTimeout(()=>{
	// 	if (data) return data
	//
	// },2000)
	}
}
export default DB;
