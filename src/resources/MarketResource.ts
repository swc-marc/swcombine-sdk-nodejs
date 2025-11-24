/**
 * Market resource for accessing vendor data
 */

import { BaseResource } from './BaseResource.js';
import { Vendor, GetVendorOptions } from '../types/index.js';

/**
 * Market vendors resource
 */
export class MarketVendorsResource extends BaseResource {
  /**
   * List all public vendors
   */
  async list(): Promise<Vendor[]> {
    return this.request<Vendor[]>('GET', '/market/vendors');
  }

  /**
   * Get vendor by UID
   */
  async get(options: GetVendorOptions): Promise<Vendor> {
    return this.request<Vendor>('GET', `/market/vendors/${options.uid}`);
  }
}

/**
 * Market resource for accessing market data
 */
export class MarketResource extends BaseResource {
  public readonly vendors: MarketVendorsResource;

  constructor(http: any) {
    super(http);
    this.vendors = new MarketVendorsResource(http);
  }
}
