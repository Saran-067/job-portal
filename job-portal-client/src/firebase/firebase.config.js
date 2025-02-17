// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyD9ztvxkfvgq-iJwEIcPJByyImm50FBPPc",
  authDomain: "jobportal-adl.firebaseapp.com",
  projectId: "jobportal-adl",
  storageBucket: "jobportal-adl.firebasestorage.app",
  messagingSenderId: "885861435613",
  appId: "1:885861435613:web:de4d0263e44c9c0d68b334",
  measurementId: "G-2LJT94DXQT"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);


export default app;