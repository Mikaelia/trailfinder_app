import { reactReduxFirebase, firebaseReducer } from "react-redux-firebase";
import { reduxFirestore, firestoreReducer } from "redux-firestore";
import { createStore, combineReducers, compose } from "redux";
import firebase from "firebase";
import "firebase/firestore";

import notifyReducer from "./reducers/notifyReducer";

// Connect app to database
const firebaseConfig = {
  apiKey: "AIzaSyDk3IcRIKZOTy6evtrWPhZKW9JOaL1ggu8",
  authDomain: "follow-that-trail.firebaseapp.com",
  databaseURL: "https://follow-that-trail.firebaseio.com",
  projectId: "follow-that-trail",
  storageBucket: "follow-that-trail.appspot.com",
  messagingSenderId: "838456076181"
};

// React-redux-firebase config
const rrfConfig = {
  userProfile: "users",
  useFirestoreForProfile: true // Firestore for Profile instead of Realtime DB
};

// Init firebase instance
firebase.initializeApp(firebaseConfig);

// Init firestore
const firestore = firebase.firestore();
const settings = { timestampsInSnapshots: true };
firestore.settings(settings);

// Add reactReduxFirebase enhancer when to store factory
const createStoreWithFirebase = compose(
  reactReduxFirebase(firebase, rrfConfig), // firebase instance as first argument
  reduxFirestore(firebase)
)(createStore);

// Combine all reducers
const rootReducer = combineReducers({
  firebase: firebaseReducer,
  firestore: firestoreReducer,
  notify: notifyReducer
});

// Create store with reducers and initial state
const initialState = {};
const store = createStoreWithFirebase(
  rootReducer,
  initialState,
  compose(
    reactReduxFirebase(firebase),
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
  )
);

export default store;
