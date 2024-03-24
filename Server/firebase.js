/*const firebase = require("firebase/app");
const { getFirestore } = require("firebase/firestore");
const { initializeApp } = require('firebase-admin/app');


const admin = require('firebase-admin');

const serviceAccount = require('/path/to/serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

const firebaseConfig = {
    apiKey: "AIzaSyCfBn-nQAv3EyAdS27QTY7wKXx_Yh88A3g",
    authDomain: "dinodetector.firebaseapp.com",
    projectId: "dinodetector",
    storageBucket: "dinodetector.appspot.com",
    messagingSenderId: "859368794670",
    appId: "1:859368794670:web:1320c3636fb70e04b8cdbf",
    measurementId: "G-KLKC8LV4KC"
};

const app = firebase.initializeApp(firebaseConfig);
const db = getFirestore(app);

module.exports = { app, db };
*/