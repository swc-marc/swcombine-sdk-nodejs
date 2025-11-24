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
   * List faction members
   */
  async list(options: { factionId: string }): Promise<FactionMember[]> {
    return this.request<FactionMember[]>('GET', `/faction/${options.factionId}/members`);
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
   * List faction budgets
   */
  async list(options: { factionId: string }): Promise<Budget[]> {
    return this.request<Budget[]>('GET', `/faction/${options.factionId}/budgets`);
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
   * List faction stockholders
   */
  async list(options: { factionId: string }): Promise<Stockholder[]> {
    return this.request<Stockholder[]>('GET', `/faction/${options.factionId}/stockholders`);
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
   * Get faction credit log
   */
  async list(options: { factionId: string }): Promise<CreditLogEntry[]> {
    return this.request<CreditLogEntry[]>('GET', `/faction/${options.factionId}/creditlog`);
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
   * List all factions
   */
  async list(): Promise<Faction[]> {
    return this.request<Faction[]>('GET', '/factions');
  }
}
