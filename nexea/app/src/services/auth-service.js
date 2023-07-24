import axios from 'axios'


const register = (fname, lname, email, password, phoneNumber, department) => {
    return axios.post('api/register', {

        fname,
        lname,
        email,
        password,
        phoneNumber,
        department
    })
}

const login = (email, password) => {
    return axios.post('api/login', {
        email,
        password
    }).then((response) => {
        if (response.data.accessToken) {
            localStorage.setItem('user', JSON.stringify(response.data))
        }
        return response.data
    })
}

const logout = () => {
    localStorage.removeItem('user')
}

const getCurrentUser = () => {
    return JSON.parse(localStorage.getItem('user'))
}

const AuthService = {
    register,
    login,
    logout,
    getCurrentUser
}

export default AuthService;