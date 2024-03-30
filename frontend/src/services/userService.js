import axios from 'axios';

const API_URL = `${import.meta.env.VITE_REACT_APP_URL}/api/users/`;


const register = (username, email, password) => {
  return axios.post(API_URL + 'register', {
    username,
    email,
    password,
    confirmPassword: password,
  }, {
    withCredentials: true,
  });
}


const login = (email, password) => {
  return axios.post(API_URL + 'login', {
    email,
    password,
  });
}

const getUserInfo = () => {
  return axios.get(API_URL + 'me', {
    withCredentials: true,
  });

}

const userService = {
  register,
  login,
  getUserInfo,
}
export default userService;