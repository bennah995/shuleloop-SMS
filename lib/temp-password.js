import crypto from 'crypto';

// Generates something a principal can read over the phone to a teacher —
// avoids ambiguous characters (0/O, 1/l/I) since it'll be spoken/typed once.
const ALPHABET = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789';

export function generateTempPassword(length = 10) {
  const bytes = crypto.randomBytes(length);
  let out = '';
  for (let i = 0; i < length; i++) {
    out += ALPHABET[bytes[i] % ALPHABET.length];
  }
  return out;
}