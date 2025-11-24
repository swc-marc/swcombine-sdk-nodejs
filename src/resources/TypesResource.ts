/**
 * Types resource for accessing entity type information
 */

import { BaseResource } from './BaseResource.js';
import { Entity } from '../types/index.js';

export interface EntityType {
  name: string;
  description?: string;
  [key: string]: any;
}

export interface EntityClass {
  name: string;
  description?: string;
  [key: string]: any;
}

/**
 * Entity classes resource
 */
export class TypesClassesResource extends BaseResource {
  /**
   * Get all classes for an entity type
   */
  async list(options: { entityType: string }): Promise<EntityClass[]> {
    return this.request<EntityClass[]>('GET', `/types/classes/${options.entityType}`);
  }
}

/**
 * Entities by type resource
 */
export class TypesEntitiesResource extends BaseResource {
  /**
   * Get all entities of a type
   */
  async list(options: { entityType: string; class?: string }): Promise<Entity[]> {
    const path = options.class
      ? `/types/${options.entityType}/class/${options.class}`
      : `/types/${options.entityType}`;
    return this.request<Entity[]>('GET', path);
  }

  /**
   * Get specific entity type information
   */
  async get(options: { entityType: string; uid: string }): Promise<Entity> {
    return this.request<Entity>('GET', `/types/${options.entityType}/${options.uid}`);
  }
}

/**
 * Types resource for accessing type information
 */
export class TypesResource extends BaseResource {
  public readonly classes: TypesClassesResource;
  public readonly entities: TypesEntitiesResource;

  constructor(http: any) {
    super(http);
    this.classes = new TypesClassesResource(http);
    this.entities = new TypesEntitiesResource(http);
  }

  /**
   * Get all entity types
   */
  async listEntityTypes(): Promise<EntityType[]> {
    return this.request<EntityType[]>('GET', '/types/entitytypes');
  }
}
