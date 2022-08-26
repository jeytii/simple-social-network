import axios from 'axios';
import Cookies from 'js-cookie';

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_APP_URL,
  withCredentials: true,
  headers: {
    Accept: 'application/json',
  },
});

axiosInstance.interceptors.request.use((request) => {
  const token = Cookies.get('token');

  if (token && request.headers) {
    const authToken = request.params.authToken || token;

    request.headers.Authorization = `Bearer ${authToken}`;

    if (request.params.authToken) {
      delete request.params.authToken;
    }
  }

  return request;
});

export default axiosInstance;
