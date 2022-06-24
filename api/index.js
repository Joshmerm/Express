const config = require('./config.json');
const axios = require('axios');

const url = `${config.baseUrl}?apikey=${config.APIkey}`;

const getId = (id) => {
    return axios.get(`${url}&i=${id}`);
}

const getSearch = async (input) => {
    return axios.get(`${url}&s=${input}`);
}

module.exports = {
    getSearch,
    getId,
};