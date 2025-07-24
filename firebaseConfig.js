// firebaseConfig.js
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import 'firebase/compat/storage';

// ✅ Live Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD3yMr1WOLdFZc6qau4qx-nwP7KPizN3jA",
  authDomain: "todofirebaseapp-908e3.firebaseapp.com",
  projectId: "todofirebaseapp-908e3",
  storageBucket: "todofirebaseapp-908e3.appspot.com",
  messagingSenderId: "611603010",
  appId: "1:611603010:web:a9d78ed45b9d60ed4913db"
};

// ✅ Initialize Firebase once
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

// ✅ Export Firebase services (compat)
const auth = firebase.auth();
const db = firebase.firestore();
const storage = firebase.storage();

export { firebase, auth, db, storage };
