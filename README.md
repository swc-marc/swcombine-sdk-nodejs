# SW Combine SDK for Node.js

Comprehensive TypeScript SDK for the Star Wars Combine API v2.0

## Features

- **Full API Coverage** - All 60+ endpoints across 11 resource categories
- **TypeScript First** - Complete type definitions and IntelliSense support
- **Automatic Token Refresh** - OAuth tokens refresh transparently
- **Resource-Based API** - Intuitive, Stripe-style interface
- **Modern & Universal** - ES Modules + CommonJS, Node.js 18+

## Installation

```bash
npm install swcombine-sdk
```

## Quick Start

```typescript
import { SWCombine } from 'swcombine-sdk';

const swc = new SWCombine({
  clientId: process.env.SWC_CLIENT_ID,
  clientSecret: process.env.SWC_CLIENT_SECRET,
  redirectUri: 'http://localhost:3000/callback',
  accessType: 'offline'
});

// OAuth Flow
const authUrl = swc.auth.getAuthorizationUrl({
  scopes: ['character.read', 'faction.read'],
  state: 'random-state'
});
// Redirect user to authUrl...

// Handle callback
const result = await swc.auth.handleCallback(req.query);
if (result.success) {
  // Token automatically stored in client
}

// Use the API
const character = await swc.character.get({ uid: '12345' });
const messages = await swc.character.messages.list({
  uid: '12345',
  mode: 'received'
});
const factions = await swc.faction.list();
const planets = await swc.galaxy.planets.list();
```

## Manual Token Management

```typescript
// Initialize with existing token
const swc = new SWCombine({
  clientId: 'your-client-id',
  clientSecret: 'your-client-secret',
  token: existingAccessToken
});

// Or set token later
swc.setToken(token);

// Get current token (for storage)
const currentToken = swc.getToken();
```

## API Resources

- **api** - HelloWorld, HelloAuth, Permissions, RateLimits, Time
- **character** - Profiles, skills, privileges, credits, messages
- **faction** - Profiles, members, budgets, stockholders, credits
- **galaxy** - Planets, sectors, systems, stations, cities
- **inventory** - Entities, properties, tags
- **market** - Public vendors
- **news** - GNS (Galactic News Service), Sim News
- **types** - Entity types and classes
- **datacard** - Datacard management
- **events** - Event queries
- **location** - Entity locations

## Error Handling

```typescript
import { SWCError } from 'swcombine-sdk';

try {
  const character = await swc.character.get({ uid: 'invalid' });
} catch (error) {
  if (error instanceof SWCError) {
    console.log(error.type); // 'not_found', 'auth', 'rate_limit', etc.
    console.log(error.statusCode); // 404
    console.log(error.retryable); // false
  }
}
```

## Configuration Options

```typescript
interface ClientConfig {
  clientId: string;
  clientSecret: string;
  redirectUri?: string;
  accessType?: 'online' | 'offline';
  token?: string | OAuthToken;
  baseURL?: string;        // Override for testing
  timeout?: number;        // Request timeout in ms (default: 30000)
  maxRetries?: number;     // Max retry attempts (default: 3)
  retryDelay?: number;     // Retry delay in ms (default: 1000)
}
```

## Documentation

- [Getting Started](docs/getting-started.md)
- [Authentication](docs/authentication.md)
- [Error Handling](docs/error-handling.md)
- [API Resources](docs/resources/)
- [Examples](docs/examples/)

## Development

```bash
# Install dependencies
npm install

# Run tests
npm test

# Run tests in watch mode
npm run test:watch

# Build
npm run build

# Lint
npm run lint

# Format
npm run format
```

## License

MIT

## Contributing

Contributions welcome! Please read our contributing guidelines and submit pull requests.

## Links

- [SW Combine API Documentation](https://www.swcombine.com/ws/v2.0/developers/index.php)
- [GitHub Repository](https://github.com/yourusername/swcombine-sdk-nodejs)
- [npm Package](https://www.npmjs.com/package/swcombine-sdk)
