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
   * List entities in inventory
   */
  async list(options: ListInventoryEntitiesOptions): Promise<Entity[]> {
    return this.request<Entity[]>(
      'GET',
      `/inventory/${options.uid}/${options.entityType}/${options.assignType}`
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
