/**
 * Faction resource for accessing faction data
 */

import { BaseResource } from './BaseResource.js';
import { Faction, Character, GetFactionOptions } from '../types/index.js';

export interface FactionMember {
  character: Character | string;
  rank?: string;
  joinDate?: string;
  [key: string]: any;
}

export interface Budget {
  uid: string;
  name: string;
  amount: number;
  [key: string]: any;
}

export interface Stockholder {
  character: Character | string;
  shares: number;
  percentage: number;
  [key: string]: any;
}

export interface FactionCredits {
  amount: number;
  [key: string]: any;
}

export interface CreditLogEntry {
  timestamp: string;
  amount: number;
  balance: number;
  description?: string;
  [key: string]: any;
}

/**
 * Faction members resource
 */
export class FactionMembersResource extends BaseResource {
  /**
   * List faction members (paginated)
   * @param options - Faction ID and optional pagination parameters
   * @example
   * const members = await client.faction.members.list({ factionId: '20:123' });
   * const moreMembers = await client.faction.members.list({ factionId: '20:123', start_index: 51, item_count: 50 });
   */
  async list(options: {
    factionId: string;
    start_index?: number;
    item_count?: number;
  }): Promise<FactionMember[]> {
    const params = {
      start_index: options.start_index || 1,
      item_count: options.item_count || 50,
    };
    return this.http.get<FactionMember[]>(`/faction/${options.factionId}/members`, { params });
  }

  /**
   * Add or update faction member
   */
  async update(options: {
    factionId: string;
    characterId: string;
    rank?: string;
  }): Promise<FactionMember> {
    return this.request<FactionMember>('POST', `/faction/${options.factionId}/members`, {
      characterId: options.characterId,
      rank: options.rank,
    });
  }
}

/**
 * Faction budgets resource
 */
export class FactionBudgetsResource extends BaseResource {
  /**
   * List faction budgets (paginated)
   * @param options - Faction ID and optional pagination parameters
   * @example
   * const budgets = await client.faction.budgets.list({ factionId: '20:123' });
   * const moreBudgets = await client.faction.budgets.list({ factionId: '20:123', start_index: 51, item_count: 50 });
   */
  async list(options: {
    factionId: string;
    start_index?: number;
    item_count?: number;
  }): Promise<Budget[]> {
    const params = {
      start_index: options.start_index || 1,
      item_count: options.item_count || 50,
    };
    return this.http.get<Budget[]>(`/faction/${options.factionId}/budgets`, { params });
  }

  /**
   * Get specific budget
   */
  async get(options: { factionId: string; budgetId: string }): Promise<Budget> {
    return this.request<Budget>('GET', `/faction/${options.factionId}/budget/${options.budgetId}`);
  }
}

/**
 * Faction stockholders resource
 */
export class FactionStockholdersResource extends BaseResource {
  /**
   * List faction stockholders (paginated)
   * @param options - Faction ID and optional pagination parameters
   * @example
   * const stockholders = await client.faction.stockholders.list({ factionId: '20:123' });
   * const moreStockholders = await client.faction.stockholders.list({ factionId: '20:123', start_index: 51, item_count: 50 });
   */
  async list(options: {
    factionId: string;
    start_index?: number;
    item_count?: number;
  }): Promise<Stockholder[]> {
    const params = {
      start_index: options.start_index || 1,
      item_count: options.item_count || 50,
    };
    return this.http.get<Stockholder[]>(`/faction/${options.factionId}/stockholders`, { params });
  }
}

/**
 * Faction credits resource
 */
export class FactionCreditsResource extends BaseResource {
  /**
   * Get faction credits
   */
  async get(options: { factionId: string }): Promise<FactionCredits> {
    return this.request<FactionCredits>('GET', `/faction/${options.factionId}/credits`);
  }

  /**
   * Transfer faction credits
   */
  async update(options: {
    factionId: string;
    amount: number;
    recipient?: string;
  }): Promise<FactionCredits> {
    return this.request<FactionCredits>('POST', `/faction/${options.factionId}/credits`, {
      amount: options.amount,
      recipient: options.recipient,
    });
  }
}

/**
 * Faction credit log resource
 */
export class FactionCreditlogResource extends BaseResource {
  /**
   * Get faction credit log (paginated)
   * @param options - Faction ID and optional pagination/filtering parameters
   * @example
   * const creditlog = await client.faction.creditlog.list({ factionId: '20:123' });
   * const moreLogs = await client.faction.creditlog.list({ factionId: '20:123', start_index: 51, item_count: 100 });
   * const oldestLogs = await client.faction.creditlog.list({ factionId: '20:123', start_id: 1 });
   */
  async list(options: {
    factionId: string;
    start_index?: number;
    item_count?: number;
    start_id?: number;
  }): Promise<CreditLogEntry[]> {
    const params: Record<string, number> = {
      start_index: options.start_index || 1,
      item_count: options.item_count || 50,
    };
    if (options.start_id !== undefined) {
      params.start_id = options.start_id;
    }
    return this.http.get<CreditLogEntry[]>(`/faction/${options.factionId}/creditlog`, { params });
  }
}

/**
 * Faction resource for managing factions
 */
export class FactionResource extends BaseResource {
  public readonly members: FactionMembersResource;
  public readonly budgets: FactionBudgetsResource;
  public readonly stockholders: FactionStockholdersResource;
  public readonly credits: FactionCreditsResource;
  public readonly creditlog: FactionCreditlogResource;

  constructor(http: any) {
    super(http);
    this.members = new FactionMembersResource(http);
    this.budgets = new FactionBudgetsResource(http);
    this.stockholders = new FactionStockholdersResource(http);
    this.credits = new FactionCreditsResource(http);
    this.creditlog = new FactionCreditlogResource(http);
  }

  /**
   * Get faction by UID
   */
  async get(options: GetFactionOptions): Promise<Faction> {
    return this.request<Faction>('GET', `/faction/${options.uid}`);
  }

  /**
   * List all factions (paginated)
   * @param options - Optional pagination parameters
   * @example
   * const factions = await client.faction.list();
   * const moreFactions = await client.faction.list({ start_index: 51, item_count: 50 });
   */
  async list(options?: { start_index?: number; item_count?: number }): Promise<Faction[]> {
    const params = {
      start_index: options?.start_index || 1,
      item_count: options?.item_count || 50,
    };
    return this.http.get<Faction[]>('/factions', { params });
  }
}
