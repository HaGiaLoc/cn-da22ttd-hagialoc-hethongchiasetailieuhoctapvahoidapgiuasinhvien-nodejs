#!/usr/bin/env node
import bcrypt from 'bcryptjs';

// Usage:
// node verify_hash.mjs <plaintext> [hash]
// If [hash] is omitted, the script uses the default hash embedded below.

const defaultHash = '$2a$10$46SbHE19S13/0I.GJmUVIeETluzX5O9TmAh3iRPwcff0iaOfkVYfu';

const plaintext = process.argv[2];
const hash = process.argv[3] || defaultHash;

if (!plaintext) {
  console.error('Usage: node verify_hash.mjs <plaintext> [hash]');
  process.exit(1);
}

try {
  const match = await bcrypt.compare(plaintext, hash);
  console.log('Hash:', hash);
  console.log('Plaintext:', plaintext);
  console.log('Match:', match);
  process.exit(match ? 0 : 2);
} catch (err) {
  console.error('Error comparing hash:', err);
  process.exit(1);
}
