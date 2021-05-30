import axios from 'axios';

const url = '/tensiones';

export const getTensiones = () => async (dispatch) => {
  try {
    const { data } = await axios.get(url);

    dispatch({ type: FETCH_ALL, payload: data });
  } catch (error) {
    console.log(error.message);
  }
};

export const createTension = (tension) => async (dispatch) => {
  try {
    const { data } = await axios.post(url, newTension);

    dispatch({ type: CREATE, payload: data });
  } catch (error) {
    console.log(error.message);
  }
};

export const updateTension = (id, tension) => async (dispatch) => {
  try {
    const { data } = await axios.patch(`${url}/${id}`, updatedTension);

    dispatch({ type: UPDATE, payload: data });
  } catch (error) {
    console.log(error.message);
  }
};


export const deleteTension = (id) => async (dispatch) => {
  try {
    await await axios.delete(`${url}/${id}`);

    dispatch({ type: DELETE, payload: id });
  } catch (error) {
    console.log(error.message);
  }
};

