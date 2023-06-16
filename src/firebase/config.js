import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBhBeLH_Zr6NGxjrKhheIulO5alH2vxP5M",
  authDomain: "gerenciamento-financeiro-ade0e.firebaseapp.com",
  projectId: "gerenciamento-financeiro-ade0e",
  storageBucket: "gerenciamento-financeiro-ade0e.appspot.com",
  messagingSenderId: "152333003783",
  appId: "1:152333003783:web:0da70b21bcaa940dbf8ea2",
  measurementId: "G-WJGHHFH6SD"
};



// Initialize Firebase
const app = initializeApp(firebaseConfig);
// Configurando o Authentication e seus recursos login/cadastro
export const auth = getAuth(app);
// Configura o Firestore e seus recursos de banco de dados
export const db = getFirestore(app);
// Configura o Storage e seus recursos de Upload
export const storage = getStorage(app);
