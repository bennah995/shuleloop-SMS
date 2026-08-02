const RESERVED = new Set([
  'www', 'app', 'api', 'admin', 'console', 'mail', 'ftp', 'shuleloop',
  'staging', 'dev', 'test', 'support', 'help', 'blog', 'status', 'docs',
  'login', 'signup', 'static', 'assets', 'cdn',
]);

function isValidSubdomain(value) {
  return /^[a-z0-9](?:[a-z0-9-]{1,61}[a-z0-9])?$/.test(value);
}

function slugify(input) {
  return String(input || '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 63);
}

function generateSuggestions(base) {
  const clean = slugify(base) || 'school';
  return [
    `${clean}-school`,
    `${clean}-academy`,
    `${clean}-ke`,
    `${clean}1`,
    `${clean}${new Date().getFullYear()}`,
  ];
}

module.exports = { RESERVED, isValidSubdomain, slugify, generateSuggestions };