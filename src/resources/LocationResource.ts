/**
 * Location resource for accessing entity locations
 */

import { BaseResource } from './BaseResource.js';
import { Location } from '../types/index.js';

/**
 * Location resource for querying entity locations
 */
export class LocationResource extends BaseResource {
  /**
   * Get entity location
   */
  async get(options: { entityType: string; uid: string }): Promise<Location> {
    return this.request<Location>('GET', `/location/${options.entityType}/${options.uid}`);
  }
}
