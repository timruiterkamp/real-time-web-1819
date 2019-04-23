const firebase = require('firebase-admin')
require('dotenv').config()
const serviceAccount = require("../firebase-login.json");

firebase.initializeApp({
  credential: firebase.credential.cert(serviceAccount),
  databaseURL: "https://rtw-1819.firebaseio.com"
});

const db = firebase.firestore()

module.exports = db