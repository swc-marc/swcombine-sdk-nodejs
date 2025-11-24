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
  AUTH: 'CHARACTER_AUTH',
  /** Read basic character information (UID, handle, image, race, gender, etc.) */
  READ: 'CHARACTER_READ',
  /** Read character HP and XP */
  STATS: 'CHARACTER_STATS',
  /** Read character privileges */
  PRIVILEGES: 'CHARACTER_PRIVILEGES',
  /** Read character skills */
  SKILLS: 'CHARACTER_SKILLS',
  /** Read character credit information */
  CREDITS: 'CHARACTER_CREDITS',
  /** Transfer character credits */
  CREDITS_WRITE: 'CHARACTER_CREDITS_WRITE',
  /** Read character force-related information (FP, FXP, regen rate, Force Meter) */
  FORCE: 'CHARACTER_FORCE',
  /** Read location information in-game */
  LOCATION: 'CHARACTER_LOCATION',
  /** Read character events */
  EVENTS: 'CHARACTER_EVENTS',
  /** Access all character information (includes all above) */
  ALL: 'CHARACTER_ALL',
} as const;

/**
 * Message-related scopes
 */
export const MessageScopes = {
  /** Read messages */
  READ: 'MESSAGES_READ',
  /** Send messages */
  SEND: 'MESSAGES_SEND',
  /** Delete messages */
  DELETE: 'MESSAGES_DELETE',
  /** All message permissions */
  ALL: 'MESSAGES_ALL',
} as const;

/**
 * Personal inventory entity types
 */
const PersonalInventoryTypes = [
  'SHIPS',
  'VEHICLES',
  'STATIONS',
  'CITIES',
  'FACILITIES',
  'PLANETS',
  'ITEMS',
  'NPCS',
  'DROIDS',
  'MATERIALS',
  'CREATURES',
] as const;

/**
 * Personal inventory permission types
 */
const InventoryPermissions = ['READ', 'RENAME', 'ASSIGN', 'MAKEOVER', 'TAGS_READ', 'TAGS_WRITE', 'ALL'] as const;

/**
 * Generate personal inventory scopes for a specific entity type
 */
function generatePersonalInventoryScopes(entityType: string, hasRename: boolean = true) {
  const scopes: Record<string, string> = {};

  scopes.READ = `PERSONAL_INV_${entityType}_READ`;
  if (hasRename) {
    scopes.RENAME = `PERSONAL_INV_${entityType}_RENAME`;
  }
  scopes.ASSIGN = `PERSONAL_INV_${entityType}_ASSIGN`;
  if (hasRename) {
    scopes.MAKEOVER = `PERSONAL_INV_${entityType}_MAKEOVER`;
  }
  scopes.TAGS_READ = `PERSONAL_INV_${entityType}_TAGS_READ`;
  scopes.TAGS_WRITE = `PERSONAL_INV_${entityType}_TAGS_WRITE`;
  scopes.ALL = `PERSONAL_INV_${entityType}_ALL`;

  return scopes;
}

/**
 * Personal inventory scopes
 */
export const PersonalInventoryScopes = {
  /** Overview of personal inventory */
  OVERVIEW: 'PERSONAL_INV_OVERVIEW',

  /** Personal ship scopes */
  SHIPS: generatePersonalInventoryScopes('SHIPS'),

  /** Personal vehicle scopes */
  VEHICLES: generatePersonalInventoryScopes('VEHICLES'),

  /** Personal station scopes */
  STATIONS: generatePersonalInventoryScopes('STATIONS'),

  /** Personal city scopes */
  CITIES: generatePersonalInventoryScopes('CITIES'),

  /** Personal facility scopes */
  FACILITIES: generatePersonalInventoryScopes('FACILITIES'),

  /** Personal planet scopes (no RENAME/MAKEOVER) */
  PLANETS: generatePersonalInventoryScopes('PLANETS', false),

  /** Personal item scopes */
  ITEMS: generatePersonalInventoryScopes('ITEMS'),

  /** Personal NPC scopes (no RENAME) */
  NPCS: generatePersonalInventoryScopes('NPCS', false),

  /** Personal droid scopes */
  DROIDS: generatePersonalInventoryScopes('DROIDS'),

  /** Personal material scopes (no ASSIGN) */
  MATERIALS: {
    READ: 'PERSONAL_INV_MATERIALS_READ',
    RENAME: 'PERSONAL_INV_MATERIALS_RENAME',
    MAKEOVER: 'PERSONAL_INV_MATERIALS_MAKEOVER',
    TAGS_READ: 'PERSONAL_INV_MATERIALS_TAGS_READ',
    TAGS_WRITE: 'PERSONAL_INV_MATERIALS_TAGS_WRITE',
    ALL: 'PERSONAL_INV_MATERIALS_ALL',
  },

  /** Personal creature scopes */
  CREATURES: generatePersonalInventoryScopes('CREATURES'),
} as const;

/**
 * Faction management scopes
 */
export const FactionScopes = {
  /** Read faction information */
  READ: 'FACTION_READ',
  /** Read faction members */
  MEMBERS: 'FACTION_MEMBERS',
  /** Read faction stocks */
  STOCKS: 'FACTION_STOCKS',
  /** Read faction credits */
  CREDITS_READ: 'FACTION_CREDITS_READ',
  /** Write/transfer faction credits */
  CREDITS_WRITE: 'FACTION_CREDITS_WRITE',
  /** Read faction budgets */
  BUDGETS_READ: 'FACTION_BUDGETS_READ',
  /** Write faction budgets */
  BUDGETS_WRITE: 'FACTION_BUDGETS_WRITE',
  /** Read faction datacards */
  DATACARDS_READ: 'FACTION_DATACARDS_READ',
  /** Write faction datacards */
  DATACARDS_WRITE: 'FACTION_DATACARDS_WRITE',
  /** All faction permissions */
  ALL: 'FACTION_ALL',
} as const;

/**
 * Generate faction inventory scopes for a specific entity type
 */
function generateFactionInventoryScopes(entityType: string, hasRename: boolean = true) {
  const scopes: Record<string, string> = {};

  scopes.READ = `FACTION_INV_${entityType}_READ`;
  if (hasRename) {
    scopes.RENAME = `FACTION_INV_${entityType}_RENAME`;
  }
  scopes.ASSIGN = `FACTION_INV_${entityType}_ASSIGN`;
  if (hasRename) {
    scopes.MAKEOVER = `FACTION_INV_${entityType}_MAKEOVER`;
  }
  scopes.TAGS_READ = `FACTION_INV_${entityType}_TAGS_READ`;
  scopes.TAGS_WRITE = `FACTION_INV_${entityType}_TAGS_WRITE`;
  scopes.ALL = `FACTION_INV_${entityType}_ALL`;

  return scopes;
}

/**
 * Faction inventory scopes
 */
export const FactionInventoryScopes = {
  /** Overview of faction inventory */
  OVERVIEW: 'FACTION_INV_OVERVIEW',

  /** Faction ship scopes */
  SHIPS: generateFactionInventoryScopes('SHIPS'),

  /** Faction vehicle scopes */
  VEHICLES: generateFactionInventoryScopes('VEHICLES'),

  /** Faction station scopes */
  STATIONS: generateFactionInventoryScopes('STATIONS'),

  /** Faction city scopes */
  CITIES: generateFactionInventoryScopes('CITIES'),

  /** Faction facility scopes */
  FACILITIES: generateFactionInventoryScopes('FACILITIES'),

  /** Faction planet scopes (no RENAME/MAKEOVER) */
  PLANETS: generateFactionInventoryScopes('PLANETS', false),

  /** Faction item scopes */
  ITEMS: generateFactionInventoryScopes('ITEMS'),

  /** Faction NPC scopes (no RENAME) */
  NPCS: generateFactionInventoryScopes('NPCS', false),

  /** Faction droid scopes */
  DROIDS: generateFactionInventoryScopes('DROIDS'),

  /** Faction material scopes (no ASSIGN) */
  MATERIALS: {
    READ: 'FACTION_INV_MATERIALS_READ',
    RENAME: 'FACTION_INV_MATERIALS_RENAME',
    MAKEOVER: 'FACTION_INV_MATERIALS_MAKEOVER',
    TAGS_READ: 'FACTION_INV_MATERIALS_TAGS_READ',
    TAGS_WRITE: 'FACTION_INV_MATERIALS_TAGS_WRITE',
    ALL: 'FACTION_INV_MATERIALS_ALL',
  },

  /** Faction creature scopes */
  CREATURES: generateFactionInventoryScopes('CREATURES'),
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
