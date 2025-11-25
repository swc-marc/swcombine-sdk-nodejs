# SW Combine SDK for Node.js

<div align="center">

**Comprehensive TypeScript SDK for the Star Wars Combine API v2.0**

[![npm version](https://img.shields.io/npm/v/swcombine-sdk.svg)](https://www.npmjs.com/package/swcombine-sdk)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue.svg)](https://www.typescriptlang.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

[Features](#features) •
[Installation](#installation) •
[Quick Start](#quick-start) •
[Documentation](#documentation) •
[Examples](#examples)

</div>

## Features

- ✨ **Full API Coverage** - All 60+ endpoints across 11 resource categories
- 🔐 **OAuth 2.0 Built-in** - Complete OAuth flow with automatic token refresh
- 📘 **TypeScript First** - Full type definitions with IntelliSense support
- 🎯 **Type-Safe Scopes** - 230+ OAuth scope constants with autocomplete
- 🔄 **Automatic Retries** - Exponential backoff for failed requests
- 🌐 **Modern & Universal** - ES Modules + CommonJS, Node.js 18+
- 🛠️ **Developer Tools** - Helper scripts for OAuth and testing
- 📦 **Zero Dependencies** (except axios)

## Installation

```bash
npm install swcombine-sdk
# or
yarn add swcombine-sdk
# or
pnpm add swcombine-sdk
```

## Quick Start

### 1. Initialize the Client

```typescript
import { SWCombine } from 'swcombine-sdk';

const client = new SWCombine({
  clientId: process.env.SWC_CLIENT_ID!,
  clientSecret: process.env.SWC_CLIENT_SECRET!,
  accessToken: process.env.SWC_ACCESS_TOKEN, // Optional
});
```

### 2. Make API Calls

```typescript
// Get public character information (no auth required)
const character = await client.character.getByHandle({
  handle: 'character-handle',
});

console.log(character.uid);    // "1:12345"
console.log(character.name);   // "Character Name"
```

### 3. Authenticated Endpoints

```typescript
// For authenticated endpoints, provide an access token
const authenticatedClient = new SWCombine({
  clientId: process.env.SWC_CLIENT_ID!,
  clientSecret: process.env.SWC_CLIENT_SECRET!,
  accessToken: process.env.SWC_ACCESS_TOKEN!,
});

// Get character details
const character = await authenticatedClient.character.get({
  uid: '1:12345',
});

// Get character messages
const messages = await authenticatedClient.character.messages.list({
  uid: '1:12345',
  mode: 'received',
});

// Get faction information
const faction = await authenticatedClient.faction.get({
  uid: '20:123',
});
```

## OAuth Authentication

### Quick OAuth Setup

Use the included helper script to get an access token:

```bash
# 1. Add your credentials to .env
echo "SWC_CLIENT_ID=your_client_id" >> .env
echo "SWC_CLIENT_SECRET=your_client_secret" >> .env

# 2. Run the OAuth helper
npm run get-token

# 3. Visit http://localhost:3000 in your browser
# 4. Authorize the app and copy the token to .env
```

### Manual OAuth Flow

```typescript
import { SWCombine, CharacterScopes, MessageScopes } from 'swcombine-sdk';

const client = new SWCombine({
  clientId: 'your-client-id',
  clientSecret: 'your-client-secret',
  redirectUri: 'http://localhost:3000/callback',
  accessType: 'offline', // Get refresh token
});

// 1. Generate authorization URL
const authUrl = client.auth.getAuthorizationUrl({
  scopes: [
    CharacterScopes.READ,
    CharacterScopes.STATS,
    MessageScopes.READ,
    MessageScopes.SEND,
  ],
  state: 'random-csrf-token',
});

// 2. Redirect user to authUrl...

// 3. Handle callback
const result = await client.auth.handleCallback(req.query);

if (result.success) {
  const token = result.token!;
  console.log('Access Token:', token.accessToken);
  console.log('Refresh Token:', token.refreshToken);
}
```

## Type-Safe OAuth Scopes

```typescript
import {
  CharacterScopes,
  MessageScopes,
  Scopes,
  getAllScopes,
  getReadOnlyScopes,
} from 'swcombine-sdk';

// Use constants with autocomplete
const scopes = [
  CharacterScopes.READ,      // ✓ TypeScript suggests all scopes
  CharacterScopes.STATS,
  MessageScopes.SEND,
  Scopes.PersonalInventory.SHIPS.READ,
];

// Or use helpers
const readOnly = getReadOnlyScopes();
const everything = getAllScopes();
```

See [OAuth Scopes Guide](docs/SCOPES.md) for all 230+ available scopes.

## API Resources

The SDK provides access to all SW Combine API resources:

### Characters

```typescript
// Public endpoints
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
await client.faction.list();
await client.faction.get({ uid: '20:123' });
await client.faction.members.list({ uid: '20:123' });
await client.faction.budgets.list({ uid: '20:123' });
```

### Inventory

```typescript
await client.inventory.get({ uid: '1:12345' });
await client.inventory.entities.list({
  uid: '1:12345',
  entityType: 'vehicle',
  assignType: 'pilot',
});
```

### Galaxy

```typescript
await client.galaxy.systems.list();
await client.galaxy.planets.list();
await client.galaxy.sectors.list();
```

### Events, Location, Datacards, and More

```typescript
await client.events.list({ eventMode: 'character', eventType: 'all' });
await client.location.get({ entityType: 'character', uid: '1:12345' });
await client.datacard.list({ factionId: '20:123' });
await client.market.listings.list();
await client.news.list();
await client.types.races.list();
```

See [API Documentation](docs/API.md) for complete reference.

## Error Handling

```typescript
import { SWCError } from 'swcombine-sdk';

try {
  const character = await client.character.get({ uid: '1:12345' });
} catch (error) {
  if (error instanceof SWCError) {
    console.error('Status:', error.statusCode);     // 404
    console.error('Message:', error.message);       // "Resource not found"
    console.error('Type:', error.type);             // "not_found"
    console.error('Retryable:', error.retryable);   // false
  }
}
```

## TypeScript Support

Full TypeScript support with intelligent type inference:

```typescript
// Types are automatically inferred
const character = await client.character.get({ uid: '1:12345' });
// character: Character

// Request parameters are typed
await client.character.messages.list({
  uid: '1:12345',
  mode: 'received', // TypeScript knows valid values
  // mode: 'invalid', // ❌ TypeScript error
});
```

## Configuration Options

```typescript
interface ClientConfig {
  // Required OAuth credentials
  clientId: string;
  clientSecret: string;

  // Optional authentication
  accessToken?: string;
  refreshToken?: string;

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

## Examples

See the [examples](examples/) directory for complete working examples:

- **[OAuth Scopes](examples/oauth-scopes-example.ts)** - 10 examples of scope usage

### Basic Usage

```typescript
import { SWCombine } from 'swcombine-sdk';

const client = new SWCombine({
  clientId: process.env.SWC_CLIENT_ID!,
  clientSecret: process.env.SWC_CLIENT_SECRET!,
});

// Get character info
const character = await client.character.getByHandle({
  handle: 'character-name',
});

console.log(`${character.name} (${character.uid})`);
```

## Developer Tools

### Get OAuth Token

Interactive OAuth flow to obtain access tokens:

```bash
npm run get-token
```

### Get Character UID

Quickly get a character's UID from their handle:

```bash
npm run get-character-uid YourHandle
```

### Run Integration Tests

```bash
npm run test:integration
```

## Documentation

- **[Getting Started Guide](docs/GETTING_STARTED.md)** - Detailed setup and usage
- **[Authentication Guide](docs/AUTHENTICATION.md)** - OAuth 2.0 setup and token management
- **[OAuth Scopes Reference](docs/SCOPES.md)** - Complete scope documentation
- **[API Reference](docs/API.md)** - Detailed API endpoint documentation
- **[Examples](examples/)** - Working code examples

## Development

```bash
# Install dependencies
npm install

# Build
npm run build

# Run tests
npm test

# Run integration tests
npm run test:integration

# Lint
npm run lint

# Format code
npm run format
```

## Requirements

- Node.js 18 or higher
- TypeScript 5.0 or higher (for TypeScript projects)

## Links

- [SW Combine API Documentation](https://www.swcombine.com/ws/developers/)
- [npm Package](https://www.npmjs.com/package/swcombine-sdk)
- [GitHub Repository](https://github.com/yourusername/swcombine-sdk-nodejs)

## License

MIT © Dreks Selmur aka JonMarkGo

## Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## Support

- 📖 Check the [documentation](docs/)
- 💬 Submit issues on [GitHub](https://github.com/yourusername/swcombine-sdk-nodejs/issues)
- 📧 Contact support

---

<div align="center">
Made with ❤️ for the Star Wars Combine community
</div>
