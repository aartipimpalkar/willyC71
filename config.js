import {firebase} from '@firebase/app'
import '@firebase/firestore';
//require('@firebase/firestore')
var firebaseConfig = {
    apiKey: "AIzaSyDL69wqAF6GGwW8Kwb1iar2T_XzoKwNXvw",
    authDomain: "wiilyapp.firebaseapp.com",
    databaseURL: "https://wiilyapp-default-rtdb.firebaseio.com",
    projectId: "wiilyapp",
    storageBucket: "wiilyapp.appspot.com",
    messagingSenderId: "993390294917",
    appId: "1:993390294917:web:88ab1eacb1954490a536ec"
  };
  //firebase.initializeApp(firebaseConfig)
  firebase.initializeApp(firebaseConfig)
  
  export default firebase.firestore();