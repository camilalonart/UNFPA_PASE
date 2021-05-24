const axios = require('axios');

const baseURL = "/lda"

const executeLDAModel = (params, callback) => {
  axios.get(`${baseURL}`, {params})
  .then((res) => {
    return res.data;
  })
  .then((data) => {
    callback(data, null);
  })
  .catch((err) => {
    callback(null, err);
  })
};

module.exports = {
  executeLDAModel,
};