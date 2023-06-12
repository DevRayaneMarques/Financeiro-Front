import { collection, addDoc } from "firebase/firestore";
import { db } from "./config";
import { getAuth } from "firebase/auth";

// Função para adicionar uma transação à coleção "transactions"
export async function adicionarTransacao(transacao) {
  try {
    const transactionsCollection = collection(db, "transactions");
    const user = getAuth().currentUser;
    if (user) {
      transacao.userId = user.uid;
      await addDoc(transactionsCollection, transacao);
      console.log("Transação adicionada com sucesso!");
    } else {
      console.error("Nenhum usuário autenticado encontrado.");
    }
  } catch (error) {
    console.error("Erro ao adicionar transação:", error);
  }
}

// Exemplo de uso
const entrada = 0; // exemplo de valor para entrada
const saida = 0; // exemplo de valor para saída
const descricao = 'Para que você está realizando essa transação?';

// Obtém o ID do usuário atualmente logado
const user = getAuth().currentUser;
const userId = user ? user.uid : '';

const transaction = {
  entrada,
  saida,
  descricao,
  date: new Date(),
  userId,
};

adicionarTransacao(transaction);