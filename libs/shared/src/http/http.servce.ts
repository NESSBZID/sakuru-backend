import { Inject } from '@nestjs/common';
import Axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { AXIOS_INSTANCE_TOKEN } from './http.constants';

export class HttpService {
  constructor(
    @Inject(AXIOS_INSTANCE_TOKEN)
    protected readonly instance: AxiosInstance = Axios,
  ) {}

  request<T = any>(config: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.instance.request<T>(config);
  }

  get<T = any>(
    url: string,
    config?: AxiosRequestConfig,
  ): Promise<AxiosResponse<T>> {
    return this.instance.get<T>(url, config);
  }

  delete<T = any>(
    url: string,
    config?: AxiosRequestConfig,
  ): Promise<AxiosResponse<T>> {
    return this.instance.delete<T>(url, config);
  }

  head<T = any>(
    url: string,
    config?: AxiosRequestConfig,
  ): Promise<AxiosResponse<T>> {
    return this.instance.head<T>(url, config);
  }

  post<T = any>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig,
  ): Promise<AxiosResponse<T>> {
    return this.instance.post<T>(url, data, config);
  }

  put<T = any>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig,
  ): Promise<AxiosResponse<T>> {
    return this.instance.put<T>(url, data, config);
  }

  patch<T = any>(
    url: string,
    data?: unknown,
    config?: AxiosRequestConfig,
  ): Promise<AxiosResponse<T>> {
    return this.instance.patch<T>(url, data, config);
  }

  get axiosRef(): AxiosInstance {
    return this.instance;
  }
}
