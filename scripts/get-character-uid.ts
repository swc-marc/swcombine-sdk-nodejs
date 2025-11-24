/**
 * Helper script to get your character UID
 *
 * Usage:
 *   npm run get-character-uid YourHandle
 */

import { config } from 'dotenv';
import { SWCombine } from '../src/index.js';

// Load environment variables
config();

const handle = process.argv[2];

if (!handle) {
  console.error('❌ Please provide your character handle');
  console.error('');
  console.error('Usage: npm run get-character-uid YourHandle');
  console.error('');
  process.exit(1);
}

async function main() {
  const client = new SWCombine({
    clientId: process.env.SWC_CLIENT_ID,
    clientSecret: process.env.SWC_CLIENT_SECRET,
    accessToken: process.env.SWC_ACCESS_TOKEN,
  });

  console.log(`🔍 Looking up character: ${handle}`);
  console.log('');

  try {
    const character = await client.character.getByHandle({ handle });

    console.log('✅ Character found!');
    console.log('');
    console.log('Full response:', JSON.stringify(character, null, 2));
    console.log('');

    const uid = character.uid || (character as any).UID || (character as any).id;

    if (uid) {
      console.log('Character UID:', uid);
      if (character.name) {
        console.log('Name:', character.name);
      }
      console.log('');
      console.log('💡 Add this to your .env file:');
      console.log(`TEST_CHARACTER_UID=${uid}`);
      console.log(`TEST_CHARACTER_HANDLE=${handle}`);
      console.log('');
    } else {
      console.log('⚠️  Could not find UID field in response');
      console.log('Available fields:', Object.keys(character).join(', '));
    }
  } catch (error: any) {
    console.error('❌ Error:', error.message);
    if (error.statusCode === 404) {
      console.error('');
      console.error('Character not found. Please check the handle and try again.');
    }
    process.exit(1);
  }
}

main().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
