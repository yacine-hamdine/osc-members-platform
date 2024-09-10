// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
//import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyC9h9t3ht6Is3xV24r9kQuY009JzfZBrDs",
  authDomain: "osc-members-platform.firebaseapp.com",
  databaseURL: "https://osc-members-platform-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "osc-members-platform",
  storageBucket: "osc-members-platform.appspot.com",
  messagingSenderId: "964214333559",
  appId: "1:964214333559:web:6eed095964cf76efb56672",
  measurementId: "G-W1V1FKMR6H"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
//const analytics = getAnalytics(app);

export { app };