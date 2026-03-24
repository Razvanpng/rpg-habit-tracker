import axios, { type AxiosInstance, type AxiosResponse, type AxiosError } from 'axios';
import type { ApiSuccess, ApiErrorBody } from '@/types';

const apiClient: AxiosInstance = axios.create({
  baseURL: '/api',
  withCredentials: true, 
  timeout: 10_000,
  headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
});

apiClient.interceptors.response.use(
  (response: AxiosResponse<ApiSuccess<unknown>>) => response,
  (error: AxiosError<ApiErrorBody>) => {
    if (error.response?.data) return Promise.reject(error.response.data);
    if (error.code === 'ECONNABORTED') return Promise.reject({ success: false, error: { message: 'Timeout. Incearca din nou.', code: 'TIMEOUT' } } as ApiErrorBody);
    return Promise.reject({ success: false, error: { message: 'Eroare de retea. Verifica conexiunea.', code: 'NETWORK_ERROR' } } as ApiErrorBody);
  }
);

export async function get<T>(url: string): Promise<T> { const res = await apiClient.get<ApiSuccess<T>>(url); return res.data.data; }
export async function post<T, B = unknown>(url: string, body?: B): Promise<T> { const res = await apiClient.post<ApiSuccess<T>>(url, body); return res.data.data; }
export async function patch<T, B = unknown>(url: string, body?: B): Promise<T> { const res = await apiClient.patch<ApiSuccess<T>>(url, body); return res.data.data; }
export async function del<T>(url: string): Promise<T> { const res = await apiClient.delete<ApiSuccess<T>>(url); return res.data.data; }

export default apiClient;