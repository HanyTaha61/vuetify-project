// Initialize Cloud Firestore through Firebase
import { initializeApp } from "firebase/app"
import { getFirestore } from "firebase/firestore"


const firebaseConfig = {
  apiKey: "AIzaSyC38xqdVv5Es1zelkPe9cZ5jyDlzEqkLK8",
  authDomain: "vue-revision-af064.firebaseapp.com",
  databaseURL: "https://vue-revision-af064-default-rtdb.firebaseio.com",
  projectId: "vue-revision-af064",
  storageBucket: "vue-revision-af064.appspot.com",
  messagingSenderId: "1080153393176",
  appId: "1:1080153393176:web:7f819acaceba78c8181b6d",
  measurementId: "G-VSGQYB4SC4"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
// const projects_collection = collection(database, 'Projects')
// const snapShot = getDox(projects_collection)

export default db


