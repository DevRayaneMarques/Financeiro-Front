import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBYr7z83uDtM4hpwi9c3t5gqo5NR6Ibu5U",
  authDomain: "financeiro-28598.firebaseapp.com",
  projectId: "financeiro-28598",
  storageBucket: "financeiro-28598.appspot.com",
  messagingSenderId: "302650726660",
  appId: "1:302650726660:web:4800468b58c3b368661851"
};



// Initialize Firebase
const app = initializeApp(firebaseConfig);
// Configurando o Authentication e seus recursos login/cadastro
export const auth = getAuth(app);
// Configura o Firestore e seus recursos de banco de dados
export const db = getFirestore(app);
// Configura o Storage e seus recursos de Upload
export const storage = getStorage(app);
