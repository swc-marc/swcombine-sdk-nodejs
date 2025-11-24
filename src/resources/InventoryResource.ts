/**
 * Inventory resource for managing entities
 */

import { BaseResource } from './BaseResource.js';
import { Entity, GetEntityOptions, ListInventoryEntitiesOptions } from '../types/index.js';

/**
 * Inventory entities resource
 */
export class InventoryEntitiesResource extends BaseResource {
  /**
   * List entities in inventory (paginated with optional filtering)
   * @param options - Inventory UID, entity type, assign type, and optional pagination/filtering parameters
   * @example
   * const entities = await client.inventory.entities.list({ uid: '1:12345', entityType: 'vehicle', assignType: 'pilot' });
   * const moreEntities = await client.inventory.entities.list({ uid: '1:12345', entityType: 'vehicle', assignType: 'pilot', start_index: 51, item_count: 100 });
   * const filteredEntities = await client.inventory.entities.list({
   *   uid: '1:12345',
   *   entityType: 'vehicle',
   *   assignType: 'pilot',
   *   filter_type: ['hp'],
   *   filter_value: ['100'],
   *   filter_inclusion: ['includes']
   * });
   */
  async list(options: ListInventoryEntitiesOptions): Promise<Entity[]> {
    const params: Record<string, any> = {
      start_index: options.start_index || 1,
      item_count: options.item_count || 50,
    };

    // Add filtering parameters if provided
    if (options.filter_type) {
      params.filter_type = options.filter_type;
    }
    if (options.filter_value) {
      params.filter_value = options.filter_value;
    }
    if (options.filter_inclusion) {
      params.filter_inclusion = options.filter_inclusion;
    }

    return this.http.get<Entity[]>(
      `/inventory/${options.uid}/${options.entityType}/${options.assignType}`,
      { params }
    );
  }

  /**
   * Get specific entity
   */
  async get(options: GetEntityOptions): Promise<Entity> {
    return this.request<Entity>('GET', `/inventory/${options.entityType}/${options.uid}`);
  }

  /**
   * Update entity property
   */
  async updateProperty(options: {
    entityType: string;
    uid: string;
    property: string;
    value: any;
  }): Promise<Entity> {
    return this.request<Entity>(
      'POST',
      `/inventory/${options.entityType}/${options.uid}/property`,
      {
        property: options.property,
        value: options.value,
      }
    );
  }

  /**
   * Add tag to entity
   */
  async addTag(options: { entityType: string; uid: string; tag: string }): Promise<void> {
    return this.request<void>(
      'PUT',
      `/inventory/${options.entityType}/${options.uid}/tag/${options.tag}`
    );
  }

  /**
   * Remove tag from entity
   */
  async removeTag(options: { entityType: string; uid: string; tag: string }): Promise<void> {
    return this.request<void>(
      'DELETE',
      `/inventory/${options.entityType}/${options.uid}/tag/${options.tag}`
    );
  }

  /**
   * Remove all tags from entity
   */
  async removeAllTags(options: { entityType: string; uid: string }): Promise<void> {
    return this.request<void>('DELETE', `/inventory/${options.entityType}/${options.uid}/tags`);
  }
}

/**
 * Inventory resource for managing inventories
 */
export class InventoryResource extends BaseResource {
  public readonly entities: InventoryEntitiesResource;

  constructor(http: any) {
    super(http);
    this.entities = new InventoryEntitiesResource(http);
  }

  /**
   * Get inventory by UID
   */
  async get(options: { uid: string }): Promise<any> {
    return this.request<any>('GET', `/inventory/${options.uid}`);
  }
}
