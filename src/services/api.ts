import axios from 'axios';

import { AppError } from '@utils/AppError';

const api = axios.create({
  baseURL: 'https://201f-179-189-247-194.ngrok-free.app',
});

api.interceptors.response.use(response => {
  return response;
}, error => {
  if (error?.response && error?.response?.data) {
    return Promise.reject(new AppError(error.response.data.message));
  } else {
    return Promise.reject(error);
  }
});

export { api };