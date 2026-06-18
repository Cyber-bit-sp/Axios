import axios from "axios";

const api = axios.create({
  baseURL: "https://jsonplaceholder.typicode.com",
  timeout: 100000,
  headers: {
    'Content-Type': 'application/json',
  },
});

//Request Interceptor - Logs every request
api.interceptors.request.use(
  (config) => {
    console.log(`${config.method.toUpperCase()} request sent to ${config.url}`);

    return config;
  },
  (error) => {
    console.error('Request Error', error);
    return Promise.reject(error); 
  }
);

// Response Interceptor - handles responses globally
api.interceptors.response.use(
  (response) => {
    console.log(`Response received from: ${response.config.url}`);
    return response;
  },
  (error) => {
    if (error.response) {
      // Server responded with error status
      console.error('Response Error:', error.response.status, error.response.data);
    } else if (error.request) {
      // Request made but no response
      console.error('No response received from server');
    } else {
      // Something else happened
      console.error('Error:', error.message);
    }
    return Promise.reject(error);
  }
);

export default api;