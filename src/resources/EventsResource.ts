/**
 * Events resource for accessing event data
 */

import { BaseResource } from './BaseResource.js';
import { Event } from '../types/index.js';

/**
 * Events resource for querying events
 */
export class EventsResource extends BaseResource {
  /**
   * List events by type and mode
   */
  async list(options: { eventMode: string; eventType: string }): Promise<Event[]> {
    return this.request<Event[]>('GET', `/events/${options.eventMode}/${options.eventType}`);
  }

  /**
   * Get specific event
   */
  async get(options: { uid: string }): Promise<Event> {
    return this.request<Event>('GET', `/event/${options.uid}`);
  }
}
