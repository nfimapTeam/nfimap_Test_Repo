import axios from "axios";

const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_TYPE === 'DEVELOP'
  ? 'http://localhost:8000'
  : process.env.REACT_APP_SERVICE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// 요청 인터셉터
// axiosInstance.interceptors.request.use(
//   (config) => {
//     // 예: 토큰이 있다면 헤더에 추가
//     const token = localStorage.getItem("token");
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
//   },
//   (error) => {
//     return Promise.reject(error);
//   }
// );

// 응답 인터셉터
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API 요청 오류:", error);
    return Promise.reject(error);
  }
);

export default axiosInstance;
