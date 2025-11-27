/**
 * OAuth Scopes for SW Combine API
 *
 * This module defines all available OAuth scopes and provides utilities
 * for requesting common scope combinations.
 *
 * @see https://www.swcombine.com/ws/developers/permissions/
 */

/**
 * Character-related scopes
 */
export const CharacterScopes = {
  /** Solely provides the character name and ID for use by clients who want to verify a character's identity */
  AUTH: 'character_auth',
  /** Read basic character information (UID, handle, image, race, gender, etc.) */
  READ: 'character_read',
  /** Read character HP and XP */
  STATS: 'character_stats',
  /** Read character privileges */
  PRIVILEGES: 'character_privileges',
  /** Read character skills */
  SKILLS: 'character_skills',
  /** Read character credit information */
  CREDITS: 'character_credits',
  /** Transfer character credits */
  CREDITS_WRITE: 'character_credits_write',
  /** Read character force-related information (FP, FXP, regen rate, Force Meter) */
  FORCE: 'character_force',
  /** Read location information in-game */
  LOCATION: 'character_location',
  /** Read character events */
  EVENTS: 'character_events',
  /** Access all character information (includes all above) */
  ALL: 'character_all',
} as const;

/**
 * Message-related scopes
 */
export const MessageScopes = {
  /** Read messages */
  READ: 'messages_read',
  /** Send messages */
  SEND: 'messages_send',
  /** Delete messages */
  DELETE: 'messages_delete',
  /** All message permissions */
  ALL: 'messages_all',
} as const;

/**
 * Generate personal inventory scopes for a specific entity type
 */
function generatePersonalInventoryScopes(entityType: string, hasRename: boolean = true) {
  const scopes: Record<string, string> = {};

  scopes.READ = `personal_inv_${entityType}_read`;
  if (hasRename) {
    scopes.RENAME = `personal_inv_${entityType}_rename`;
  }
  scopes.ASSIGN = `personal_inv_${entityType}_assign`;
  if (hasRename) {
    scopes.MAKEOVER = `personal_inv_${entityType}_makeover`;
  }
  scopes.TAGS_READ = `personal_inv_${entityType}_tags_read`;
  scopes.TAGS_WRITE = `personal_inv_${entityType}_tags_write`;
  scopes.ALL = `personal_inv_${entityType}_all`;

  return scopes;
}

/**
 * Personal inventory scopes
 */
export const PersonalInventoryScopes = {
  /** Overview of personal inventory */
  OVERVIEW: 'personal_inv_overview',

  /** Personal ship scopes */
  SHIPS: generatePersonalInventoryScopes('ships'),

  /** Personal vehicle scopes */
  VEHICLES: generatePersonalInventoryScopes('vehicles'),

  /** Personal station scopes */
  STATIONS: generatePersonalInventoryScopes('stations'),

  /** Personal city scopes */
  CITIES: generatePersonalInventoryScopes('cities'),

  /** Personal facility scopes */
  FACILITIES: generatePersonalInventoryScopes('facilities'),

  /** Personal planet scopes (no RENAME/MAKEOVER) */
  PLANETS: generatePersonalInventoryScopes('planets', false),

  /** Personal item scopes */
  ITEMS: generatePersonalInventoryScopes('items'),

  /** Personal NPC scopes (has MAKEOVER but no RENAME) */
  NPCS: {
    READ: 'personal_inv_npcs_read',
    ASSIGN: 'personal_inv_npcs_assign',
    MAKEOVER: 'personal_inv_npcs_makeover',
    // Note: NPCs do not have RENAME scope
    TAGS_READ: 'personal_inv_npcs_tags_read',
    TAGS_WRITE: 'personal_inv_npcs_tags_write',
    ALL: 'personal_inv_npcs_all',
  },

  /** Personal droid scopes */
  DROIDS: generatePersonalInventoryScopes('droids'),

  /** Personal material scopes (no ASSIGN) */
  MATERIALS: {
    READ: 'personal_inv_materials_read',
    RENAME: 'personal_inv_materials_rename',
    MAKEOVER: 'personal_inv_materials_makeover',
    TAGS_READ: 'personal_inv_materials_tags_read',
    TAGS_WRITE: 'personal_inv_materials_tags_write',
    ALL: 'personal_inv_materials_all',
  },

  /** Personal creature scopes */
  CREATURES: generatePersonalInventoryScopes('creatures'),
} as const;

/**
 * Faction management scopes
 */
export const FactionScopes = {
  /** Read faction information */
  READ: 'faction_read',
  /** Read faction members */
  MEMBERS: 'faction_members',
  /** Read faction stocks */
  STOCKS: 'faction_stocks',
  /** Read faction credits */
  CREDITS_READ: 'faction_credits_read',
  /** Write/transfer faction credits */
  CREDITS_WRITE: 'faction_credits_write',
  /** Read faction budgets */
  BUDGETS_READ: 'faction_budgets_read',
  /** Write faction budgets */
  BUDGETS_WRITE: 'faction_budgets_write',
  /** Read faction datacards */
  DATACARDS_READ: 'faction_datacards_read',
  /** Write faction datacards */
  DATACARDS_WRITE: 'faction_datacards_write',
  /** All faction permissions */
  ALL: 'faction_all',
} as const;

/**
 * Generate faction inventory scopes for a specific entity type
 */
function generateFactionInventoryScopes(entityType: string, hasRename: boolean = true) {
  const scopes: Record<string, string> = {};

  scopes.READ = `faction_inv_${entityType}_read`;
  if (hasRename) {
    scopes.RENAME = `faction_inv_${entityType}_rename`;
  }
  scopes.ASSIGN = `faction_inv_${entityType}_assign`;
  if (hasRename) {
    scopes.MAKEOVER = `faction_inv_${entityType}_makeover`;
  }
  scopes.TAGS_READ = `faction_inv_${entityType}_tags_read`;
  scopes.TAGS_WRITE = `faction_inv_${entityType}_tags_write`;
  scopes.ALL = `faction_inv_${entityType}_all`;

  return scopes;
}

/**
 * Faction inventory scopes
 */
export const FactionInventoryScopes = {
  /** Overview of faction inventory */
  OVERVIEW: 'faction_inv_overview',

  /** Faction ship scopes */
  SHIPS: generateFactionInventoryScopes('ships'),

  /** Faction vehicle scopes */
  VEHICLES: generateFactionInventoryScopes('vehicles'),

  /** Faction station scopes */
  STATIONS: generateFactionInventoryScopes('stations'),

  /** Faction city scopes */
  CITIES: generateFactionInventoryScopes('cities'),

  /** Faction facility scopes */
  FACILITIES: generateFactionInventoryScopes('facilities'),

  /** Faction planet scopes (no RENAME/MAKEOVER) */
  PLANETS: generateFactionInventoryScopes('planets', false),

  /** Faction item scopes */
  ITEMS: generateFactionInventoryScopes('items'),

  /** Faction NPC scopes (has MAKEOVER but no RENAME) */
  NPCS: {
    READ: 'faction_inv_npcs_read',
    ASSIGN: 'faction_inv_npcs_assign',
    MAKEOVER: 'faction_inv_npcs_makeover',
    // Note: NPCs do not have RENAME scope
    TAGS_READ: 'faction_inv_npcs_tags_read',
    TAGS_WRITE: 'faction_inv_npcs_tags_write',
    ALL: 'faction_inv_npcs_all',
  },

  /** Faction droid scopes */
  DROIDS: generateFactionInventoryScopes('droids'),

  /** Faction material scopes (no ASSIGN) */
  MATERIALS: {
    READ: 'faction_inv_materials_read',
    RENAME: 'faction_inv_materials_rename',
    MAKEOVER: 'faction_inv_materials_makeover',
    TAGS_READ: 'faction_inv_materials_tags_read',
    TAGS_WRITE: 'faction_inv_materials_tags_write',
    ALL: 'faction_inv_materials_all',
  },

  /** Faction creature scopes */
  CREATURES: generateFactionInventoryScopes('creatures'),
} as const;

/**
 * All available scopes organized by category
 */
export const Scopes = {
  Character: CharacterScopes,
  Messages: MessageScopes,
  PersonalInventory: PersonalInventoryScopes,
  Faction: FactionScopes,
  FactionInventory: FactionInventoryScopes,
} as const;

/**
 * Type representing any valid scope value
 */
export type ScopeValue = string;

/**
 * Helper function to get all character scopes
 */
export function getAllCharacterScopes(): string[] {
  return Object.values(CharacterScopes);
}

/**
 * Helper function to get all message scopes
 */
export function getAllMessageScopes(): string[] {
  return Object.values(MessageScopes);
}

/**
 * Helper function to get all personal inventory scopes
 */
export function getAllPersonalInventoryScopes(): string[] {
  const scopes: string[] = [PersonalInventoryScopes.OVERVIEW];

  // Add all entity-specific scopes
  Object.entries(PersonalInventoryScopes).forEach(([key, value]) => {
    if (key !== 'OVERVIEW' && typeof value === 'object') {
      scopes.push(...Object.values(value));
    }
  });

  return scopes;
}

/**
 * Helper function to get all faction scopes
 */
export function getAllFactionScopes(): string[] {
  return Object.values(FactionScopes);
}

/**
 * Helper function to get all faction inventory scopes
 */
export function getAllFactionInventoryScopes(): string[] {
  const scopes: string[] = [FactionInventoryScopes.OVERVIEW];

  // Add all entity-specific scopes
  Object.entries(FactionInventoryScopes).forEach(([key, value]) => {
    if (key !== 'OVERVIEW' && typeof value === 'object') {
      scopes.push(...Object.values(value));
    }
  });

  return scopes;
}

/**
 * Get all available scopes (for comprehensive testing)
 */
export function getAllScopes(): string[] {
  return [
    ...getAllCharacterScopes(),
    ...getAllMessageScopes(),
    ...getAllPersonalInventoryScopes(),
    ...getAllFactionScopes(),
    ...getAllFactionInventoryScopes(),
  ];
}

/**
 * Get basic read-only scopes (good for read-only integrations)
 */
export function getReadOnlyScopes(): string[] {
  return [
    CharacterScopes.READ,
    CharacterScopes.STATS,
    CharacterScopes.PRIVILEGES,
    CharacterScopes.SKILLS,
    CharacterScopes.CREDITS,
    CharacterScopes.FORCE,
    CharacterScopes.LOCATION,
    CharacterScopes.EVENTS,
    MessageScopes.READ,
    PersonalInventoryScopes.OVERVIEW,
    FactionScopes.READ,
    FactionScopes.MEMBERS,
    FactionInventoryScopes.OVERVIEW,
  ];
}

/**
 * Get minimal scopes for basic character info (authentication only)
 */
export function getMinimalScopes(): string[] {
  return [CharacterScopes.AUTH, CharacterScopes.READ];
}
