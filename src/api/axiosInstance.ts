import axios from "axios";

const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_TYPE === 'DEVELOP'
    ? 'http://127.0.0.1:8000/'
    : process.env.REACT_APP_SERVICE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.request.use(
  (config) => {
    config.headers["Cache-Control"] = "no-cache, no-store, must-revalidate";
    config.headers["Pragma"] = "no-cache";
    config.headers["Expires"] = "0";

    // params를 활용한 추가적인 캐시 방지 (URL 변경 효과)
    config.params = { ...config.params, _t: new Date().getTime() };

    return config;
  },
  (error) => Promise.reject(error)
);

// 응답 인터셉터
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API 요청 오류:", error);
    return Promise.reject(error);
  }
);

export default axiosInstance;
