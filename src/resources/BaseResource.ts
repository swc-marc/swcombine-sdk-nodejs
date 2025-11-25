/**
 * Base class for all API resources
 */

import { HttpClient } from '../http/HttpClient.js';

/**
 * Base resource class that all API resources extend
 */
export abstract class BaseResource {
  protected http: HttpClient;

  constructor(http: HttpClient) {
    this.http = http;
  }

  /**
   * Make a request to the API
   */
  protected async request<T>(method: string, path: string, data?: unknown): Promise<T> {
    switch (method.toUpperCase()) {
      case 'GET':
        return this.http.get<T>(path);
      case 'POST':
        return this.http.post<T>(path, data);
      case 'PUT':
        return this.http.put<T>(path, data);
      case 'DELETE':
        return this.http.delete<T>(path);
      default:
        throw new Error(`Unsupported HTTP method: ${method}`);
    }
  }
}
