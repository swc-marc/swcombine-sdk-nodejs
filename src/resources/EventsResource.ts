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
   * List events by type and mode (paginated)
   * @param options - Event mode, event type, and optional pagination/filtering parameters
   * @example
   * const events = await client.events.list({ eventMode: 'personal', eventType: 'all' });
   * const moreEvents = await client.events.list({ eventMode: 'personal', eventType: 'all', start_index: 50, item_count: 50 });
   * const recentEvents = await client.events.list({ eventMode: 'personal', eventType: 'all', start_time: 1640000000 });
   * const factionEvents = await client.events.list({ eventMode: 'faction', eventType: 'all', faction_id: '20:123' });
   */
  async list(options: {
    eventMode: string;
    eventType: string;
    start_index?: number;
    item_count?: number;
    start_time?: number;
    faction_id?: string;
  }): Promise<Event[]> {
    const params: Record<string, any> = {
      start_index: options.start_index !== undefined ? options.start_index : 0, // 0-based indexing!
      item_count: options.item_count || 50,
    };

    if (options.start_time !== undefined) {
      params.start_time = options.start_time;
    }
    if (options.faction_id) {
      params.faction_id = options.faction_id;
    }

    return this.http.get<Event[]>(`/events/${options.eventMode}/${options.eventType}`, { params });
  }

  /**
   * Get specific event
   */
  async get(options: { uid: string }): Promise<Event> {
    return this.request<Event>('GET', `/event/${options.uid}`);
  }
}
