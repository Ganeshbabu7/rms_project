import axios from "axios";
// const apiUrl = process.env.REACT_APP_HTTP_SERVER;
const apiUrl = "http://localhost:7000/api/v1";

// Headers :
const setHeaders = (token: string | null, contentType: string) => {
  instance.defaults.headers.common["Content-Type"] = contentType;
  instance.defaults.headers.common["Authorization"] = `Bearer ${token}`;
};

const instance = axios.create({
  baseURL: apiUrl,
});

export const PostRequest = (
  token: string | null,
  url: string,
  data: object
) => {
  setHeaders(token, "application/json");
  return instance.post(url, data);
};

export const formDataPostRequest = (
  token: string,
  url: string,
  data: object
) => {
  setHeaders(token, "multipart/form-data");
  return instance.post(url, data);
};
