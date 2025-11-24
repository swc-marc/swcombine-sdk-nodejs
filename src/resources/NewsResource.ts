/**
 * News resource for accessing news feeds
 */

import { BaseResource } from './BaseResource.js';
import { NewsItem, GetNewsItemOptions, ListNewsOptions } from '../types/index.js';

/**
 * Galactic News Service (GNS) resource
 */
export class GNSResource extends BaseResource {
  /**
   * List GNS news items
   */
  async list(options?: ListNewsOptions): Promise<NewsItem[]> {
    const path = options?.category ? `/news/gns/${options.category}` : '/news/gns';
    return this.request<NewsItem[]>('GET', path);
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
   * List Sim News items
   */
  async list(options?: ListNewsOptions): Promise<NewsItem[]> {
    const path = options?.category ? `/news/simnews/${options.category}` : '/news/simnews';
    return this.request<NewsItem[]>('GET', path);
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

  constructor(http: any) {
    super(http);
    this.gns = new GNSResource(http);
    this.simNews = new SimNewsResource(http);
  }
}
