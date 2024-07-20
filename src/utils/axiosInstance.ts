import axios from 'axios';

// Create an Axios instance
const axiosInstance = axios.create({
  baseURL: 'http://localhost:8080', // Base URL for your API
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add the Authorization header
axiosInstance.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem('accessToken');
    if (accessToken) {
      config.headers['Authorization'] = `Bearer ${accessToken}`;
      console.log('Access token added to headers:', accessToken);
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle token refresh
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // Log error response
    console.error('Error response:', error.response);

    if (error.response.status === 403 && !originalRequest._retry) {
      originalRequest._retry = true;
      const refreshToken = localStorage.getItem('refreshToken');

      // Log refresh token
      console.log('Refresh token:', refreshToken);

      if (refreshToken) {
        try {
          const response = await axiosInstance.post('/token', { token: refreshToken });

          // Log response from token endpoint
          console.log('Token refresh response:', response);

          const newAccessToken = response.data.accessToken;
          localStorage.setItem('accessToken', newAccessToken);
          originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;

          // Retry the original request with the new token
          return axiosInstance(originalRequest);
        } catch (refreshError) {
          // Handle token refresh failure
          console.error('Token refresh failed:', refreshError);

          // Clear tokens and redirect to login or log out the user
          localStorage.removeItem('accessToken');
          localStorage.removeItem('refreshToken');
          window.location.href = '/login'; // Adjust the login URL accordingly
        }
      } else {
        // No refresh token, redirect to login or log out the user
        window.location.href = '/login'; // Adjust the login URL accordingly
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
