import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000/https//github.com/DevRayaneMarques/Gerenciamento-Back.git'
});

export const getDados = async () => {
  try {
    const response = await api.get('/dados');
    return response.data;
  } catch (error) {
    console.error(error);
  }
};
