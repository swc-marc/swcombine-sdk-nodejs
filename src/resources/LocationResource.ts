/**
 * Location resource for accessing entity locations
 */

import { BaseResource } from './BaseResource.js';
import { Location } from '../types/index.js';

/**
 * Location resource for querying entity locations
 *
 * @see https://www.swcombine.com/ws/v2.0/documentation/location/entity_type/uid/ SW Combine API Documentation
 */
export class LocationResource extends BaseResource {
  /**
   * Get entity location
   */
  async get(options: { entityType: string; uid: string }): Promise<Location> {
    return this.request<Location>('GET', `/location/${options.entityType}/${options.uid}`);
  }
}
