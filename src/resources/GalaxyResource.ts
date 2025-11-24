/**
 * Galaxy resource for accessing galactic data
 */

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
   * List all planets
   */
  async list(): Promise<Planet[]> {
    return this.request<Planet[]>('GET', '/galaxy/planets');
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
   * List all sectors
   */
  async list(): Promise<Sector[]> {
    return this.request<Sector[]>('GET', '/galaxy/sectors');
  }

  /**
   * Get sector by UID
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
   * List all systems
   */
  async list(): Promise<System[]> {
    return this.request<System[]>('GET', '/galaxy/systems');
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
   * List all stations in named systems with no ECM
   */
  async list(): Promise<Station[]> {
    return this.request<Station[]>('GET', '/galaxy/stations');
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
   * List all cities
   */
  async list(): Promise<City[]> {
    return this.request<City[]>('GET', '/galaxy/cities');
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

  constructor(http: any) {
    super(http);
    this.planets = new GalaxyPlanetsResource(http);
    this.sectors = new GalaxySectorsResource(http);
    this.systems = new GalaxySystemsResource(http);
    this.stations = new GalaxyStationsResource(http);
    this.cities = new GalaxyCitiesResource(http);
  }
}
