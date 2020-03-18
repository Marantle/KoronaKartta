import * as firebase from "firebase/app";

// If you enabled Analytics in your project, add the Firebase SDK for Analytics
import "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyAm14Ri5TNEGLu3NpTvEMLZpJiLn1nmigg",
  authDomain: "koronakartta-2879f.firebaseapp.com",
  databaseURL: "https://koronakartta-2879f.firebaseio.com",
  projectId: "koronakartta-2879f",
  storageBucket: "koronakartta-2879f.appspot.com",
  messagingSenderId: "447729675638",
  appId: "1:447729675638:web:f20d46bc67f97c11719e57",
  measurementId: "G-LRT1QKWMQG"
};

if (!firebase.apps.length) firebase.initializeApp(firebaseConfig);

export default firebase.analytics();
