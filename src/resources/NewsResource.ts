/**
 * News resource for accessing news feeds
 */

import { HttpClient } from '../http/HttpClient.js';
import { BaseResource } from './BaseResource.js';
import { NewsItem, GetNewsItemOptions, ListGNSOptions, ListSimNewsOptions, QueryParams } from '../types/index.js';

/**
 * Galactic News Service (GNS) resource
 */
export class GNSResource extends BaseResource {
  /**
   * List GNS news items (paginated with optional filtering)
   * @requires_auth No
   * @param options - Optional category, pagination, and filtering parameters
   * @param options.category - News category: 'auto', 'economy', 'military', 'political', 'social'
   * @param options.start_index - Starting position (1-based). Default: 1
   * @param options.item_count - Number of items to retrieve. Default: 50, Max: 50
   * @param options.faction - Filter by faction name (GNS only)
   * @param options.faction_type - Filter by faction type (GNS only)
   * @example
   * const news = await client.news.gns.list();
   * const economyNews = await client.news.gns.list({ category: 'economy' });
   * const moreNews = await client.news.gns.list({ start_index: 51, item_count: 50 });
   * const searchNews = await client.news.gns.list({ search: 'battle', author: 'John Doe' });
   * const factionNews = await client.news.gns.list({ faction: 'Empire', faction_type: 'government' });
   */
  async list(options?: ListGNSOptions): Promise<NewsItem[]> {
    const path = options?.category ? `/news/gns/${options.category}` : '/news/gns';

    const params: QueryParams = {
      start_index: options?.start_index || 1,
      item_count: options?.item_count || 50,
    };

    if (options?.start_date !== undefined) {
      params.start_date = options.start_date;
    }
    if (options?.end_date !== undefined) {
      params.end_date = options.end_date;
    }
    if (options?.search) {
      params.search = options.search;
    }
    if (options?.author) {
      params.author = options.author;
    }
    if (options?.faction) {
      params.faction = options.faction;
    }
    if (options?.faction_type) {
      params.faction_type = options.faction_type;
    }

    const response = await this.http.get<{ newsitem?: NewsItem[]; attributes?: unknown }>(path, { params });
    // API returns { attributes: {...}, newsitem: [...] }, extract just the array
    return response.newsitem || [];
  }

  /**
   * Get specific GNS news item
   */
  async get(options: GetNewsItemOptions): Promise<NewsItem> {
    return this.request<NewsItem>('GET', `/news/gns/${options.id}`);
  }
}

/**
 * Sim News resource
 */
export class SimNewsResource extends BaseResource {
  /**
   * List Sim News items (paginated with optional filtering)
   * @requires_auth No
   * @param options - Optional category, pagination, and filtering parameters
   * @param options.category - News category: 'player', 'technical', 'community'
   * @param options.start_index - Starting position (1-based). Default: 1
   * @param options.item_count - Number of items to retrieve. Default: 50, Max: 50
   * @example
   * const news = await client.news.simNews.list();
   * const playerNews = await client.news.simNews.list({ category: 'player' });
   * const moreNews = await client.news.simNews.list({ start_index: 51, item_count: 50 });
   * const searchNews = await client.news.simNews.list({ search: 'update', author: 'Admin' });
   */
  async list(options?: ListSimNewsOptions): Promise<NewsItem[]> {
    const path = options?.category ? `/news/simnews/${options.category}` : '/news/simnews';

    const params: QueryParams = {
      start_index: options?.start_index || 1,
      item_count: options?.item_count || 50,
    };

    if (options?.start_date !== undefined) {
      params.start_date = options.start_date;
    }
    if (options?.end_date !== undefined) {
      params.end_date = options.end_date;
    }
    if (options?.search) {
      params.search = options.search;
    }
    if (options?.author) {
      params.author = options.author;
    }

    const response = await this.http.get<{ newsitem?: NewsItem[]; attributes?: unknown }>(path, { params });
    // API returns { attributes: {...}, newsitem: [...] }, extract just the array
    return response.newsitem || [];
  }

  /**
   * Get specific Sim News item
   */
  async get(options: GetNewsItemOptions): Promise<NewsItem> {
    return this.request<NewsItem>('GET', `/news/simnews/${options.id}`);
  }
}

/**
 * News resource for accessing news feeds
 */
export class NewsResource extends BaseResource {
  public readonly gns: GNSResource;
  public readonly simNews: SimNewsResource;

  constructor(http: HttpClient) {
    super(http);
    this.gns = new GNSResource(http);
    this.simNews = new SimNewsResource(http);
  }
}
