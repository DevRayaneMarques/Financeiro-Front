import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBNeAwsdnGM5D5xGudzoLEqo5q4FYtOxg8",
  authDomain: "financeiro-80b94.firebaseapp.com",
  databaseURL: "https://financeiro-80b94-default-rtdb.firebaseio.com",
  projectId: "financeiro-80b94",
  storageBucket: "financeiro-80b94.appspot.com",
  messagingSenderId: "1024932717226",
  appId: "1:1024932717226:web:38e8086ba59585e91be6d3"
};



// Initialize Firebase
const app = initializeApp(firebaseConfig);
// Configurando o Authentication e seus recursos login/cadastro
export const auth = getAuth(app);
// Configura o Firestore e seus recursos de banco de dados
export const db = getFirestore(app);
// Configura o Storage e seus recursos de Upload
export const storage = getStorage(app);
