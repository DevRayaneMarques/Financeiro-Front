import axios from 'axios';

const api = axios.create({
  baseURL: 'https://api.github.com/repos/DevRayaneMarques/Gerenciamento-Back'
});

export const getDados = async () => {
  try {
    const response = await api.get('/dados');
    return response.data;
  } catch (error) {
    console.error(error);
  }
};