/**
 * OAuth Token Exchange Helper
 *
 * Simple Express app to help you get an access token for integration tests
 *
 * Usage:
 *   1. Set SWC_CLIENT_ID and SWC_CLIENT_SECRET in .env
 *   2. Run: npm run get-token
 *   3. Visit http://localhost:3000 in your browser
 *   4. Authorize the app
 *   5. Copy the access token to your .env file
 */

import express from 'express';
import { config } from 'dotenv';
import { SWCombine } from '../src/index.js';
import { getAllScopes } from '../src/auth/scopes.js';
import * as crypto from 'crypto';

// Load environment variables
config();

const app = express();
const PORT = 3000;

// Check for required credentials
if (!process.env.SWC_CLIENT_ID || !process.env.SWC_CLIENT_SECRET) {
  console.error('❌ Missing required credentials!');
  console.error('');
  console.error('Please set the following in your .env file:');
  console.error('  SWC_CLIENT_ID=your_client_id');
  console.error('  SWC_CLIENT_SECRET=your_client_secret');
  console.error('  REDIRECT_URI=https://yourdomain.ngrok.io/callback');
  console.error('');
  process.exit(1);
}

// Get redirect URI from env or use localhost default
const REDIRECT_URI = process.env.REDIRECT_URI || `http://localhost:${PORT}/callback`;

console.log('Using redirect URI:', REDIRECT_URI);

// Initialize SDK
const swc = new SWCombine({
  clientId: process.env.SWC_CLIENT_ID,
  clientSecret: process.env.SWC_CLIENT_SECRET,
  redirectUri: REDIRECT_URI,
  accessType: 'offline', // Get refresh token for long-lived access
});

// Store state for CSRF protection
let oauthState: string;

// Home page
app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>SW Combine OAuth - Get Access Token</title>
        <style>
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
            max-width: 800px;
            margin: 50px auto;
            padding: 20px;
            background: #f5f5f5;
          }
          .container {
            background: white;
            padding: 30px;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          }
          h1 {
            color: #333;
            margin-top: 0;
          }
          .button {
            display: inline-block;
            background: #0066cc;
            color: white;
            padding: 12px 24px;
            text-decoration: none;
            border-radius: 4px;
            font-weight: bold;
            margin-top: 20px;
          }
          .button:hover {
            background: #0052a3;
          }
          .info {
            background: #e3f2fd;
            padding: 15px;
            border-radius: 4px;
            margin: 20px 0;
            border-left: 4px solid #2196f3;
          }
          .warning {
            background: #fff3cd;
            padding: 15px;
            border-radius: 4px;
            margin: 20px 0;
            border-left: 4px solid #ffc107;
          }
          ol {
            line-height: 1.8;
          }
          code {
            background: #f5f5f5;
            padding: 2px 6px;
            border-radius: 3px;
            font-family: 'Courier New', monospace;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>🚀 SW Combine OAuth - Get Access Token</h1>

          <div class="info">
            <strong>✓ Credentials Found</strong><br>
            Client ID: ${process.env.SWC_CLIENT_ID?.substring(0, 20)}...
          </div>

          <h2>Before You Start:</h2>
          <div class="warning">
            <strong>⚠️ Important:</strong> Make sure you've registered this callback URL in your SW Combine OAuth app:<br>
            <code>${REDIRECT_URI}</code>
          </div>

          <h2>Steps:</h2>
          <ol>
            <li>Click the "Authorize App" button below</li>
            <li>You'll be redirected to SW Combine to authorize</li>
            <li>Grant the requested permissions</li>
            <li>You'll be redirected back with your access token</li>
            <li>Copy the token to your .env file</li>
          </ol>

          <a href="/login" class="button">🔐 Authorize App</a>

          <h2>Scopes Requested:</h2>
          <p><strong>All comprehensive access scopes for full testing:</strong></p>
          <ul>
            <li><code>CHARACTER_ALL</code> - All character permissions</li>
            <li><code>MESSAGES_ALL</code> - All message permissions</li>
            <li><code>PERSONAL_INV_*_ALL</code> - All personal inventory permissions (ships, vehicles, stations, etc.)</li>
            <li><code>FACTION_ALL</code> - All faction permissions</li>
            <li><code>FACTION_INV_*_ALL</code> - All faction inventory permissions</li>
          </ul>
          <p><em>This grants full read/write access to all resources for comprehensive SDK testing.</em></p>
        </div>
      </body>
    </html>
  `);
});

// Start OAuth flow
app.get('/login', (req, res) => {
  // Generate random state for CSRF protection
  oauthState = crypto.randomBytes(16).toString('hex');

  // Request ALL available scopes for comprehensive testing
  const allScopes = getAllScopes();

  const authUrl = swc.auth.getAuthorizationUrl({
    scopes: allScopes,
    state: oauthState,
  });

  console.log(`📋 Requesting ${allScopes.length} scopes for comprehensive testing`);

  console.log('🔐 Redirecting to OAuth authorization...');
  res.redirect(authUrl);
});

// Handle OAuth callback
app.get('/callback', async (req, res) => {
  try {
    // Verify state parameter
    if (req.query.state !== oauthState) {
      throw new Error('Invalid state parameter - possible CSRF attack');
    }

    console.log('📥 Received OAuth callback...');

    // Exchange code for token
    const result = await swc.auth.handleCallback(req.query);

    if (!result.success) {
      throw new Error(result.error || 'OAuth authorization failed');
    }

    const token = result.token!;

    console.log('✅ Successfully obtained access token!');
    console.log('');
    console.log('Access Token:', token.accessToken);
    if (token.refreshToken) {
      console.log('Refresh Token:', token.refreshToken);
    }
    console.log('Expires At:', new Date(token.expiresAt).toISOString());
    console.log('');
    console.log('💡 Add this to your .env file:');
    console.log(`SWC_ACCESS_TOKEN=${token.accessToken}`);
    console.log('');

    // Send success page
    res.send(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Success! - Access Token Obtained</title>
          <style>
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
              max-width: 900px;
              margin: 50px auto;
              padding: 20px;
              background: #f5f5f5;
            }
            .container {
              background: white;
              padding: 30px;
              border-radius: 8px;
              box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            }
            h1 {
              color: #2e7d32;
              margin-top: 0;
            }
            .success {
              background: #e8f5e9;
              padding: 20px;
              border-radius: 4px;
              margin: 20px 0;
              border-left: 4px solid #4caf50;
            }
            .token-box {
              background: #f5f5f5;
              padding: 15px;
              border-radius: 4px;
              font-family: 'Courier New', monospace;
              word-break: break-all;
              margin: 15px 0;
              border: 1px solid #ddd;
            }
            .copy-button {
              background: #0066cc;
              color: white;
              padding: 8px 16px;
              border: none;
              border-radius: 4px;
              cursor: pointer;
              font-weight: bold;
              margin-top: 10px;
            }
            .copy-button:hover {
              background: #0052a3;
            }
            .instructions {
              background: #e3f2fd;
              padding: 20px;
              border-radius: 4px;
              margin: 20px 0;
              border-left: 4px solid #2196f3;
            }
            code {
              background: #f5f5f5;
              padding: 2px 6px;
              border-radius: 3px;
            }
            .info-grid {
              display: grid;
              grid-template-columns: 150px 1fr;
              gap: 10px;
              margin: 20px 0;
            }
            .info-label {
              font-weight: bold;
              color: #666;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>✅ Success! Access Token Obtained</h1>

            <div class="success">
              <strong>OAuth authorization successful!</strong><br>
              Your access token has been generated and is ready to use.
            </div>

            <h2>📋 Your Access Token:</h2>
            <div class="token-box" id="token">${token.accessToken}</div>
            <button class="copy-button" onclick="copyToken()">📋 Copy Token</button>

            <h2>ℹ️ Token Information:</h2>
            <div class="info-grid">
              <div class="info-label">Expires:</div>
              <div>${new Date(token.expiresAt).toLocaleString()}</div>

              ${token.refreshToken ? `
                <div class="info-label">Refresh Token:</div>
                <div style="word-break: break-all; font-family: monospace;">${token.refreshToken}</div>
              ` : ''}
            </div>

            <div class="instructions">
              <h3>📝 Next Steps:</h3>
              <ol>
                <li>Open your <code>.env</code> file in the project root</li>
                <li>Add or update this line:<br>
                  <div class="token-box" style="margin-top: 10px;">SWC_ACCESS_TOKEN=${token.accessToken}</div>
                </li>
                <li>Save the file</li>
                <li>Run the integration tests:<br>
                  <code>npm run test:integration</code>
                </li>
              </ol>
            </div>

            <h2>🧪 Test Your Token:</h2>
            <p>You can verify your token works by running:</p>
            <div class="token-box">npm run test:integration tests/integration/character.test.ts</div>

            <p style="margin-top: 30px; color: #666;">
              <small>This token will expire in ~1 hour. ${token.refreshToken ? 'You can use the refresh token to get a new access token.' : ''}</small>
            </p>
          </div>

          <script>
            function copyToken() {
              const token = document.getElementById('token').textContent;
              navigator.clipboard.writeText(token).then(() => {
                alert('✅ Token copied to clipboard!');
              });
            }
          </script>
        </body>
      </html>
    `);

  } catch (error: any) {
    console.error('❌ OAuth error:', error.message);

    res.send(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>OAuth Error</title>
          <style>
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
              max-width: 800px;
              margin: 50px auto;
              padding: 20px;
              background: #f5f5f5;
            }
            .container {
              background: white;
              padding: 30px;
              border-radius: 8px;
              box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            }
            .error {
              background: #ffebee;
              padding: 20px;
              border-radius: 4px;
              margin: 20px 0;
              border-left: 4px solid #f44336;
            }
            h1 {
              color: #d32f2f;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>❌ OAuth Error</h1>
            <div class="error">
              <strong>Error:</strong> ${error.message}
            </div>
            <p><a href="/">← Try Again</a></p>
          </div>
        </body>
      </html>
    `);
  }
});

// Start server
app.listen(PORT, () => {
  console.log('');
  console.log('🚀 OAuth Token Exchange Server Started!');
  console.log('=========================================');
  console.log('');
  console.log(`✓ Server running at: http://localhost:${PORT}`);
  console.log(`✓ Callback URL: ${REDIRECT_URI}`);
  console.log('');
  console.log('📋 Steps:');
  console.log(`  1. Open http://localhost:${PORT} in your browser`);
  console.log('  2. Click "Authorize App"');
  console.log('  3. Grant permissions on SW Combine');
  console.log('  4. Copy the access token to your .env file');
  console.log('');
  console.log(`⚠️  Make sure ${REDIRECT_URI} is registered`);
  console.log('   in your SW Combine OAuth application!');
  console.log('');
});
