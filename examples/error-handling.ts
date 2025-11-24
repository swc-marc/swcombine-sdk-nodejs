/**
 * Error handling example for SW Combine SDK
 */

import { SWCombine, SWCError } from '../src/index.js';

const swc = new SWCombine({
  clientId: process.env.SWC_CLIENT_ID!,
  clientSecret: process.env.SWC_CLIENT_SECRET!,
  token: process.env.SWC_ACCESS_TOKEN,
});

async function handleErrors() {
  try {
    // This might fail with various errors
    const character = await swc.character.get({ uid: 'invalid-uid' });
    console.log(character);
  } catch (error) {
    if (error instanceof SWCError) {
      console.error('SW Combine API Error:');
      console.error('  Type:', error.type);
      console.error('  Message:', error.message);
      console.error('  Status Code:', error.statusCode);
      console.error('  Retryable:', error.retryable);

      // Handle different error types
      switch (error.type) {
        case 'auth':
          console.log('Authentication failed. Please check your credentials.');
          // Redirect to login or refresh token
          break;

        case 'rate_limit':
          console.log('Rate limit exceeded.');
          if (error.retryAfter) {
            console.log(`Retry after ${error.retryAfter} seconds`);
          }
          // Wait before retrying
          break;

        case 'not_found':
          console.log('Resource not found.');
          // Handle missing resource
          break;

        case 'validation':
          console.log('Invalid request parameters.');
          console.log('Response:', error.response);
          // Fix request parameters
          break;

        case 'server':
          console.log('Server error occurred.');
          if (error.retryable) {
            console.log('This error can be retried.');
            // Retry the request
          }
          break;

        case 'network':
          console.log('Network connection failed.');
          // Check internet connection
          break;

        default:
          console.log('Unknown error occurred.');
      }

      // Get user-friendly message
      console.log('\nUser-friendly message:', error.toUserFriendlyMessage());
    } else {
      console.error('Unexpected error:', error);
    }
  }
}

handleErrors();
