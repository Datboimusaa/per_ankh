import api from "./api"

export const registerUser = (data) => api.post('/auth/register', data).then(res => res.data);
export const loginUser = (data) => api.post('/auth/login', data).then(res => res.data);
export const logoutUser = () => api.post('/auth/logout').then(res => res.data);
export const getMe = () => api.get('/users/me').then(res => res.data);
export const forgotPassword = (data) => api.post('/auth/forgot-password', data).then(res => res.data);
export const resetPassword = (data) => api.post('/auth/reset-password', data).then(res => res.data);
export const verifyEmail = (token) => api.post('/auth/verify-email', { token }).then(res => res.data);