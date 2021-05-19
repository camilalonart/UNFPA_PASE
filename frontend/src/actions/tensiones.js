import { FETCH_ALL, CREATE, UPDATE, DELETE } from '../constants/actionTypes';

import * as api from '../api/index.js';

export const getTensiones = () => async (dispatch) => {
  try {
    const { data } = await api.fetchTensiones();

    dispatch({ type: FETCH_ALL, payload: data });
  } catch (error) {
    console.log(error.message);
  }
};

export const createTension = (tension) => async (dispatch) => {
  try {
    const { data } = await api.createTension(tension);

    dispatch({ type: CREATE, payload: data });
  } catch (error) {
    console.log(error.message);
  }
};

export const updateTension = (id, tension) => async (dispatch) => {
  try {
    const { data } = await api.updateTension(id, tension);

    dispatch({ type: UPDATE, payload: data });
  } catch (error) {
    console.log(error.message);
  }
};


export const deleteTension = (id) => async (dispatch) => {
  try {
    await await api.deleteTension(id);

    dispatch({ type: DELETE, payload: id });
  } catch (error) {
    console.log(error.message);
  }
};