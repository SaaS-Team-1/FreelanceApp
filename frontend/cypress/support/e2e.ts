import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/database';
import 'firebase/compat/firestore';
import { attachCustomCommands } from 'cypress-firebase';

const fbConfig = {
    apiKey: "AIzaSyD5CYwwqBfgkrJDWUsol-hRLvg0OMK8dng",
    authDomain: "saas-team-1.firebaseapp.com",
    databaseURL: "https://saas-team-1-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "saas-team-1",
    storageBucket: "saas-team-1.appspot.com",
    messagingSenderId: "414383982341",
    appId: "1:414383982341:web:f6a58ad71632ae26ef996c",
    measurementId: "G-5FX5YJ8YMM"
  };

// Check if Firebase app is already initialized
if (!firebase.apps.length) {
    firebase.initializeApp(fbConfig);
  } else {
    firebase.app(); // Use the existing app
  }


// Optionally, connect to emulators during testing

firebase.auth().useEmulator('http://localhost:9099/');
firebase.firestore().useEmulator('localhost', 8080);



attachCustomCommands({ Cypress, cy, firebase });
  