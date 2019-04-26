const firebase = require('firebase-admin')
require('dotenv').config()
const serviceAccount = require('../firebase-login.json')

// {
//   type: 'service_account',
//   project_id: 'rtw-1819',
//   private_key_id: process.env.private_key_id,
//   private_key: process.env.private_key,
//   client_email: process.env.client_email,
//   client_id: process.env.client_id,
//   auth_uri: process.env.auth_uri,
//   token_uri: process.env.token_uri,
//   auth_provider_x509_cert_url: process.env.auth_provider_x509_cert_url,
//   client_x509_cert_url: process.env.auth_provider_x509_cert_url
// }

firebase.initializeApp({
  credential: firebase.credential.cert(serviceAccount),
  databaseURL: 'https://rtw-1819.firebaseio.com'
})

const db = firebase.firestore()

module.exports = db
