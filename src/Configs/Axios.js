import axios from 'axios';

const instance = axios.create({
  baseURL:"https://beta.helmapp.net/api/v1/",
  timeout:5000
})

export default instance;
