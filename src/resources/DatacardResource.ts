/**
 * Datacard resource for managing datacards
 */

import { BaseResource } from './BaseResource.js';

export interface Datacard {
  uid: string;
  name?: string;
  description?: string;
  [key: string]: unknown;
}

/**
 * Datacard resource for managing datacards
 */
export class DatacardResource extends BaseResource {
  /**
   * List datacards owned by faction
   */
  async list(options: { factionId: string }): Promise<Datacard[]> {
    return this.request<Datacard[]>('GET', `/datacards/${options.factionId}`);
  }

  /**
   * Get specific datacard
   */
  async get(options: { uid: string }): Promise<Datacard> {
    return this.request<Datacard>('GET', `/datacard/${options.uid}`);
  }

  /**
   * Create datacard
   */
  async create(options: { factionId: string; name: string; description?: string }): Promise<Datacard> {
    return this.request<Datacard>('POST', `/datacard`, {
      factionId: options.factionId,
      name: options.name,
      description: options.description,
    });
  }

  /**
   * Delete datacard
   */
  async delete(options: { uid: string }): Promise<void> {
    return this.request<void>('DELETE', `/datacard/${options.uid}`);
  }
}
