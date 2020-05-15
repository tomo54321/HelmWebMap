import axios from 'axios';

export const baseURL = ((!process.env.NODE_ENV || process.env.NODE_ENV === 'development') ? "http://currentproject.test" : "https://helmapp.net") + "/api/v1/"

const instance = axios.create({
  baseURL,
  timeout:5000
})

export default instance;
