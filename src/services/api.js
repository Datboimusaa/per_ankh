import axios from 'axios';

const base_url = 'http://localhost:5500/api';

const api = axios.create({
    baseURL: base_url,
    withCredentials: true
});

let isRefreshing = false;
let failedQueue = []; // holds requests that came in while refreshing

const processQueue = (error) => {
  failedQueue.forEach(({ resolve, reject }) =>
    error ? reject(error) : resolve()
  );
  failedQueue = [];
};

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // 1. Identify routes that should NEVER trigger a refresh cycle
    const isMeRoute = originalRequest.url.includes('/auth/me') || originalRequest.url.includes('/users/me');
    const isLoginRoute = originalRequest.url.includes('/auth/login');
    const isRefreshRoute = originalRequest.url.includes('/auth/refresh');

    // 2. If it's the initial getMe check and it fails 401, let it fail naturally!
    if (error.response?.status === 401 && isMeRoute && !originalRequest._retry) {
      return Promise.reject(error); // This allows .catch() to set loading to false!
    }

    // 3. Standard refresh logic for all subsequent protected API requests
    if (error.response?.status === 401 && !originalRequest._retry && !isLoginRoute && !isRefreshRoute) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then(() => api(originalRequest));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        await api.post('/auth/refresh');
        processQueue(null);
        return api(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError);
        
        // Only redirect to login if we aren't already on the login page
        if (window.location.pathname !== '/login') {
          window.location.href = '/login';
        }
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);


export default api