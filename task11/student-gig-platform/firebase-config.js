// Firebase Configuration
// =====================
// Replace with your Firebase project configuration

// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA5uGmM7zu3W8J-xGcNngT2A3m0VgCX3LE",
  authDomain: "todo-web-547a1.firebaseapp.com",
  projectId: "todo-web-547a1",
  storageBucket: "todo-web-547a1.appspot.com", // fixed typo here
  messagingSenderId: "24532435669",
  appId: "1:24532435669:web:fe2b5ca22ebfb2ff74585c",
  measurementId: "G-9HVK5SBZW7"
};
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();  // Add Firestore
