import { ModuleMetadata, Provider, Type } from '@nestjs/common';
import { AxiosRequestConfig } from 'axios';

export type HttpModuleOptions = AxiosRequestConfig;

export interface HttpModuleOptionsFactory {
  createHttpOptions(): Promise<HttpModuleOptions> | HttpModuleOptions;
}

export interface HttpModuleAsyncOptions
  extends Pick<ModuleMetadata, 'imports'> {
  useExisting?: Type<HttpModuleOptionsFactory>;
  useClass?: Type<HttpModuleOptionsFactory>;
  useFactory?: (
    ...args: unknown[]
  ) => Promise<HttpModuleOptions> | HttpModuleOptions;
  inject?: unknown[];
  extraProviders?: Provider[];
}
