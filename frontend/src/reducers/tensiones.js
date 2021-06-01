import { FETCH_ALL, CREATE, UPDATE, DELETE } from '../constants/actionTypes';

export default (tensiones = [], action) => {
  switch (action.type) {
    case FETCH_ALL:
      return action.payload;
    case CREATE:
      return [...tensiones, action.payload];
    case UPDATE:
      return tensiones.map((tension) => (tension._id === action.payload._id ? action.payload : tension));
    case DELETE:
      return tensiones.filter((tension) => tension._id !== action.payload);
    default:
      return tensiones;
  }
};