# Getting Started with SW Combine SDK

This guide will help you get up and running with the SW Combine SDK for Node.js in just a few minutes.

## Installation

```bash
npm install swcombine-sdk
# or
yarn add swcombine-sdk
# or
pnpm add swcombine-sdk
```

## Quick Start

### 1. Import and Initialize

```typescript
import { SWCombine } from 'swcombine-sdk';

// Public mode (no auth)
const publicClient = new SWCombine();

// Token-only mode
const tokenClient = new SWCombine({
  token: 'your-access-token',
});

// Full OAuth mode
const fullClient = new SWCombine({
  clientId: 'your-client-id',
  clientSecret: 'your-client-secret',
  token: 'your-access-token',
  redirectUri: 'http://localhost:3000/callback',
  accessType: 'offline',
});
```

### 2. Make Your First API Call

```typescript
// Get public character information (no auth required)
const character = await publicClient.character.getByHandle({
  handle: 'character-handle',
});

console.log(character.uid);    // "1:12345"
console.log(character.name);   // "Character Name"
```

### 3. Use Authenticated Endpoints

For endpoints requiring authentication, you'll need an access token from OAuth:

```typescript
const client = new SWCombine({
  token: 'your-access-token',
});

// Get authenticated character information
const character = await client.character.get({
  uid: '1:12345',
});

console.log(character.credits);  // 1000000
console.log(character.faction);  // { value: "Faction Name", ... }
```

## Configuration Options

```typescript
interface ClientConfig {
  // Optional OAuth credentials
  // If provided, both must be set together
  clientId?: string;
  clientSecret?: string;

  // Optional authentication
  token?: string | OAuthToken;

  // Optional OAuth settings
  redirectUri?: string;
  accessType?: 'online' | 'offline';

  // Optional HTTP settings
  baseURL?: string;           // Default: https://www.swcombine.com/ws/v2.0/
  timeout?: number;           // Default: 30000 (30 seconds)
  maxRetries?: number;        // Default: 3
  retryDelay?: number;        // Default: 1000ms
  debug?: boolean;            // Default: false
}
```

### Example with All Options

```typescript
const client = new SWCombine({
  // OAuth credentials
  clientId: process.env.SWC_CLIENT_ID!,
  clientSecret: process.env.SWC_CLIENT_SECRET!,
  token: process.env.SWC_ACCESS_TOKEN,

  // OAuth configuration
  redirectUri: 'http://localhost:3000/callback',
  accessType: 'offline', // Request refresh token

  // HTTP configuration
  timeout: 60000,        // 60 seconds
  maxRetries: 5,         // Retry 5 times on failure
  retryDelay: 2000,      // Wait 2 seconds between retries
  debug: true,           // Log HTTP requests
});
```

## Environment Variables

Best practice is to store credentials in environment variables:

```bash
# .env file
SWC_CLIENT_ID=your_client_id
SWC_CLIENT_SECRET=your_client_secret
SWC_ACCESS_TOKEN=your_access_token
SWC_REFRESH_TOKEN=your_refresh_token
```

```typescript
import { config } from 'dotenv';
config(); // Load .env

const client = new SWCombine({
  clientId: process.env.SWC_CLIENT_ID!,
  clientSecret: process.env.SWC_CLIENT_SECRET!,
  token: process.env.SWC_ACCESS_TOKEN,
});
```

OAuth-only methods require full OAuth mode (`clientId` + `clientSecret`):
- `client.auth.getAuthorizationUrl(...)`
- `client.auth.handleCallback(...)`
- `client.auth.revokeToken(...)`
- `client.refreshToken()`

## Available Resources

The SDK provides access to all major SW Combine API resources:

### Characters
```typescript
// Public endpoints (no auth)
await client.character.getByHandle({ handle: 'character-handle' });

// Authenticated endpoints
await client.character.get({ uid: '1:12345' });
await client.character.skills.list({ uid: '1:12345' });
await client.character.privileges.list({ uid: '1:12345' });
await client.character.credits.get({ uid: '1:12345' });
await client.character.messages.list({ uid: '1:12345', mode: 'received' });
await client.character.permissions.list({ uid: '1:12345' });
```

### Factions
```typescript
// List all factions
await client.faction.list();

// Get specific faction
await client.faction.get({ uid: '20:123' });

// Faction details (requires auth)
await client.faction.members.list({ uid: '20:123' });
await client.faction.budgets.list({ uid: '20:123' });
await client.faction.stockholders.list({ uid: '20:123' });
```

### Inventory
```typescript
// Get inventory
await client.inventory.get({ uid: '1:12345' });

// Get specific entities
await client.inventory.entities.list({
  uid: '1:12345',
  entityType: 'vehicle',
  assignType: 'pilot',
});
```

### Location
```typescript
await client.location.get({
  entityType: 'character',
  uid: '1:12345',
});
```

### Events
```typescript
await client.events.list({
  eventMode: 'character',
  eventType: 'all',
});

await client.events.get({ uid: 'event-uid' });
```

### Datacards
```typescript
await client.datacard.list({ factionId: '20:123' });
```

### Types & Galaxy Info
```typescript
// Entity types
await client.types.rooms.list();
await client.types.races.list();
await client.types.skills.list();
// ... and more

// Galaxy information
await client.galaxy.systems.list();
await client.galaxy.planets.list();
```

### Market & News
```typescript
// Market listings
await client.market.listings.list();
await client.market.auctions.list();
await client.market.bazaar.list();

// News
await client.news.list();
await client.news.get({ uid: 'news-uid' });
```

### API Utilities
```typescript
// Hello world
await client.api.helloWorld();

// Get permissions
await client.api.permissions();

// Get rate limits
await client.api.rateLimits();

// Get current time
await client.api.time();
```

## Error Handling

The SDK throws typed errors that you can catch and handle:

```typescript
import { SWCError } from 'swcombine-sdk';

try {
  const character = await client.character.get({ uid: '1:12345' });
} catch (error) {
  if (error instanceof SWCError) {
    console.error('Status:', error.statusCode);     // 404
    console.error('Message:', error.message);       // "Resource not found"
    console.error('Type:', error.type);             // "not_found"
    console.error('Request ID:', error.requestId);  // "abc123"
    console.error('Retryable:', error.retryable);   // false
  } else {
    console.error('Unexpected error:', error);
  }
}
```

## TypeScript Support

The SDK is written in TypeScript and provides full type definitions:

```typescript
import { Character, Faction, Message } from 'swcombine-sdk';

// Types are automatically inferred
const character = await client.character.get({ uid: '1:12345' });
// character: Character

// Or explicitly type
const faction: Faction = await client.faction.get({ uid: '20:123' });

// Request parameters are also typed
await client.character.messages.list({
  uid: '1:12345',
  mode: 'received', // TypeScript knows valid values
  // mode: 'invalid', // ❌ TypeScript error
});
```

## Next Steps

- **[OAuth Authentication](./AUTHENTICATION.md)** - Set up OAuth and get access tokens
- **[OAuth Scopes](./SCOPES.md)** - Learn about OAuth permissions
- **[API Reference](./API.md)** - Detailed API documentation
- **[Examples](../examples/)** - Code examples for common tasks

## Need Help?

- Check the [examples](../examples/) directory for working code
- Read the [API documentation](./API.md)
- Review integration tests in `tests/integration/` for usage patterns
- Submit issues on GitHub
