import { message } from 'antd';
import axios, { AxiosResponse, AxiosError } from 'axios';
import qs from 'qs';
import process from '@/presentation/components/progress';

export interface CommonAPI<T = {}> {
    code: number;
    message: string;
    data: T;
}

const request = axios.create({
  baseURL: '/api',
  timeout: 60000,
});

request.interceptors.request.use((config) => {
  process.start();
  const { headers } = config;
  const token = localStorage.getItem('token');
  if (headers && token) {
    headers.token = token;
  };
  return config;
});

request.interceptors.response.use((res: AxiosResponse<CommonAPI>) => {
  process.stop();
  const { code, message: msg } = res.data;
  if (code !== 0) {
    message.error(msg);
    return Promise.reject(msg);
  }
  return Promise.resolve(res);
}, (err: AxiosError<any>) => {
  process.stop();
  if (err?.response?.status === 401) {
    message.info('请先登录');
    setTimeout(() => {
      window.history.pushState({}, '', '/login');
      window.location.reload();
    }, 1000);
    return Promise.reject(err);
  }
  if (err?.response?.data?.message) {
    if (typeof err?.response?.data?.message === 'string') {
      message.error(err?.response?.data?.message);
    }
    if (Array.isArray(err?.response?.data?.message)) {
      err?.response?.data?.message?.forEach((item: string) => {
        message.error(item);
      })
    }
  };
  return Promise.reject(err);
})

export interface Request<T> {
    data?: T;
    url: string;
}
export enum Method {
    Get = 'GET',
    Post = 'POST',
}
export class HttpClient {
  post<T>(dto: Request<T>) {
    const { data, url } = dto;
    return request.post(url, data);
  }
  get<T>(dto: Request<T>) {
    const { data, url } = dto;
    const query = qs.stringify(data);
    return request.get(`${url}?${query}`);
  }
  delete<T>(dto: Request<T>) {
    const { data, url } = dto;
    const query = qs.stringify(data);
    return request.delete(`${url}?${query}`);
  } 
}
const client = new HttpClient();
export default client;
