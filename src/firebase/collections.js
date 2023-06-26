import { db } from "./config";
import { collection } from "firebase/firestore";

export const usersCollection = collection(db, "users");
export const orcamentosCollection = collection(db, "orcamentos");
export const contasCollection = collection(db, "reminders");