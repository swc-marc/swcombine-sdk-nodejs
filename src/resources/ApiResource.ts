/**
 * API utility endpoints
 */

import { BaseResource } from './BaseResource.js';

export interface HelloWorldResponse {
  message: string;
  [key: string]: any;
}

export interface HelloAuthResponse {
  message: string;
  character?: string;
  [key: string]: any;
}

export interface Permission {
  name: string;
  description?: string;
  [key: string]: any;
}

export interface RateLimitInfo {
  limit: number;
  remaining: number;
  reset: number;
  resetTime: string;
  [key: string]: any;
}

export interface TimeResponse {
  currentTime: string;
  timestamp: number;
  [key: string]: any;
}

/**
 * API resource for utility endpoints
 */
export class ApiResource extends BaseResource {
  /**
   * Print a HelloWorld message
   */
  async helloWorld(): Promise<HelloWorldResponse> {
    return this.request<HelloWorldResponse>('GET', '/api/helloworld');
  }

  /**
   * Print a HelloWorld message for authorized clients
   */
  async helloAuth(): Promise<HelloAuthResponse> {
    return this.request<HelloAuthResponse>('GET', '/api/helloauth');
  }

  /**
   * Get list of available web services permissions
   */
  async permissions(): Promise<Permission[]> {
    return this.request<Permission[]>('GET', '/api/permissions');
  }

  /**
   * Get current rate limit status
   */
  async rateLimits(): Promise<RateLimitInfo> {
    return this.request<RateLimitInfo>('GET', '/api/ratelimits');
  }

  /**
   * Get current time or convert times
   */
  async time(): Promise<TimeResponse> {
    return this.request<TimeResponse>('GET', '/api/time');
  }
}
