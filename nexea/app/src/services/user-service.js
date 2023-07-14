import axios from 'axios'
const authHeader = require('./auth-header')
const API_URL = '/api/'

const getUserBoard = () => {
    return axios.get(API_URL + 'user' + { headers: authHeader() })
}

const getAdminBoard = () => {
    return axios.get(API_URL + 'admin' + { headers: authHeader() })
}

const getSuperAdminBoard = () => {
    return axios.get(API_URL + 'super-admin' + { headers: authHeader() })
}

const UserService = {
    getUserBoard,
    getAdminBoard,
    getSuperAdminBoard
}

export default UserService;