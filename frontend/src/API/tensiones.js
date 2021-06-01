import axios from 'axios';

const url = 'http://localhost:5000/tensiones';

export const fetchTensiones = () => axios.get(url);
export const createTension = (newTension) => axios.post(url, newTension);
export const updateTension = (id, updatedTension) => axios.patch(`${url}/${id}`, updatedTension);
export const deleteTension = (id) => axios.delete(`${url}/${id}`);