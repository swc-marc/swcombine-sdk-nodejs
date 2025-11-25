/**
 * Galaxy resource for accessing galactic data
 */

import { HttpClient } from '../http/HttpClient.js';
import { BaseResource } from './BaseResource.js';
import {
  Planet,
  Sector,
  System,
  Station,
  City,
  GetPlanetOptions,
  GetSectorOptions,
  GetSystemOptions,
  GetStationOptions,
  GetCityOptions,
} from '../types/index.js';

/**
 * Galaxy planets resource
 */
export class GalaxyPlanetsResource extends BaseResource {
  /**
   * List all planets (paginated)
   * @param options - Optional pagination parameters
   * @example
   * const planets = await client.galaxy.planets.list();
   * const morePlanets = await client.galaxy.planets.list({ start_index: 51, item_count: 50 });
   */
  async list(options?: { start_index?: number; item_count?: number }): Promise<Planet[]> {
    const params = {
      start_index: options?.start_index || 1,
      item_count: options?.item_count || 50,
    };
    return this.http.get<Planet[]>('/galaxy/planets/', { params });
  }

  /**
   * Get planet by UID
   */
  async get(options: GetPlanetOptions): Promise<Planet> {
    return this.request<Planet>('GET', `/galaxy/planets/${options.uid}`);
  }
}

/**
 * Galaxy sectors resource
 */
export class GalaxySectorsResource extends BaseResource {
  /**
   * List all sectors (paginated)
   * @param options - Optional pagination parameters
   * @example
   * const sectors = await client.galaxy.sectors.list();
   * const moreSectors = await client.galaxy.sectors.list({ start_index: 51, item_count: 50 });
   */
  async list(options?: { start_index?: number; item_count?: number }): Promise<Sector[]> {
    const params = {
      start_index: options?.start_index || 1,
      item_count: options?.item_count || 50,
    };
    return this.http.get<Sector[]>('/galaxy/sectors/', { params });
  }

  /**
   * Get sector by name or UID
   * @param options - Sector identifier (use lowercase sector name, e.g., 'seswenna')
   * @example
   * const sector = await client.galaxy.sectors.get({ uid: 'seswenna' });
   */
  async get(options: GetSectorOptions): Promise<Sector> {
    return this.request<Sector>('GET', `/galaxy/sectors/${options.uid}`);
  }
}

/**
 * Galaxy systems resource
 */
export class GalaxySystemsResource extends BaseResource {
  /**
   * List all systems (paginated)
   * @param options - Optional pagination parameters
   * @example
   * const systems = await client.galaxy.systems.list();
   * const moreSystems = await client.galaxy.systems.list({ start_index: 51, item_count: 50 });
   */
  async list(options?: { start_index?: number; item_count?: number }): Promise<System[]> {
    const params = {
      start_index: options?.start_index || 1,
      item_count: options?.item_count || 50,
    };
    return this.http.get<System[]>('/galaxy/systems/', { params });
  }

  /**
   * Get system by UID
   */
  async get(options: GetSystemOptions): Promise<System> {
    return this.request<System>('GET', `/galaxy/systems/${options.uid}`);
  }
}

/**
 * Galaxy stations resource
 */
export class GalaxyStationsResource extends BaseResource {
  /**
   * List all stations in named systems with no ECM (paginated)
   * @param options - Optional pagination parameters
   * @example
   * const stations = await client.galaxy.stations.list();
   * const moreStations = await client.galaxy.stations.list({ start_index: 51, item_count: 50 });
   */
  async list(options?: { start_index?: number; item_count?: number }): Promise<Station[]> {
    const params = {
      start_index: options?.start_index || 1,
      item_count: options?.item_count || 50,
    };
    return this.http.get<Station[]>('/galaxy/stations/', { params });
  }

  /**
   * Get station by UID
   */
  async get(options: GetStationOptions): Promise<Station> {
    return this.request<Station>('GET', `/galaxy/stations/${options.uid}`);
  }
}

/**
 * Galaxy cities resource
 */
export class GalaxyCitiesResource extends BaseResource {
  /**
   * List all cities (paginated)
   * @param options - Optional pagination parameters
   * @example
   * const cities = await client.galaxy.cities.list();
   * const moreCities = await client.galaxy.cities.list({ start_index: 51, item_count: 50 });
   */
  async list(options?: { start_index?: number; item_count?: number }): Promise<City[]> {
    const params = {
      start_index: options?.start_index || 1,
      item_count: options?.item_count || 50,
    };
    return this.http.get<City[]>('/galaxy/cities/', { params });
  }

  /**
   * Get city by UID
   */
  async get(options: GetCityOptions): Promise<City> {
    return this.request<City>('GET', `/galaxy/cities/${options.uid}`);
  }
}

/**
 * Galaxy resource for accessing galactic information
 */
export class GalaxyResource extends BaseResource {
  public readonly planets: GalaxyPlanetsResource;
  public readonly sectors: GalaxySectorsResource;
  public readonly systems: GalaxySystemsResource;
  public readonly stations: GalaxyStationsResource;
  public readonly cities: GalaxyCitiesResource;

  constructor(http: HttpClient) {
    super(http);
    this.planets = new GalaxyPlanetsResource(http);
    this.sectors = new GalaxySectorsResource(http);
    this.systems = new GalaxySystemsResource(http);
    this.stations = new GalaxyStationsResource(http);
    this.cities = new GalaxyCitiesResource(http);
  }

  /**
   * Extract unique sectors from systems list
   * This is a helper method since the API doesn't provide a direct sectors list endpoint
   * @returns Array of unique sector information extracted from systems
   * @example
   * const sectorsData = await client.galaxy.getSectorsFromSystems();
   * // Returns: [{ uid: '25:160', name: 'Seswenna', href: '...' }, ...]
   */
  async getSectorsFromSystems(): Promise<Array<{ uid: string; name: string; href?: string }>> {
    const systemsResponse = await this.systems.list();

    // Handle paginated response
    const systems = (systemsResponse as any).system || systemsResponse;

    // Extract unique sectors
    const sectorMap = new Map<string, { uid: string; name: string; href?: string }>();

    for (const system of systems) {
      const sector = system.location?.container;
      if (sector?.attributes?.uid && sector.attributes.type === 'sector') {
        const uid = sector.attributes.uid;
        if (!sectorMap.has(uid)) {
          sectorMap.set(uid, {
            uid: uid,
            name: sector.value,
            href: sector.attributes.href,
          });
        }
      }
    }

    return Array.from(sectorMap.values());
  }
}
