// Recense les cles de traduction declarees dans les locales mais jamais
// referencees dans le code : elles sont candidates a la suppression.
//
//   node scripts/audit-i18n-keys.mjs [prefixe ...]
//
// Sans argument, audite toute la racine des locales.
import fs from 'node:fs';
import path from 'node:path';

const SCAN_EXT = new Set(['.ts', '.tsx', '.js', '.jsx', '.mjs']);
const IGNORE_DIRS = new Set([
  'node_modules',
  '.next',
  'out',
  '.git',
  'coverage',
  'dist',
  'build',
]);

const prefixes = process.argv.slice(2);
if (prefixes.length === 0) prefixes.push('');

/** Toutes les chaines de cles citees dans le code, y compris par concatenation. */
function collectSourceFiles(dir, acc = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name.startsWith('.') && entry.name !== '.') continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (!IGNORE_DIRS.has(entry.name)) collectSourceFiles(full, acc);
    } else if (SCAN_EXT.has(path.extname(entry.name))) {
      acc.push(full);
    }
  }
  return acc;
}

function flatten(object, prefix = '') {
  const out = [];
  for (const [key, value] of Object.entries(object ?? {})) {
    const full = prefix ? `${prefix}.${key}` : key;
    if (value && typeof value === 'object' && !Array.isArray(value)) {
      out.push(...flatten(value, full));
    } else {
      out.push(full);
    }
  }
  return out;
}

const source = collectSourceFiles(process.cwd()).map((file) => ({
  file,
  text: fs.readFileSync(file, 'utf8'),
}));

const allKeys = new Set();
for (const locale of ['fr', 'en']) {
  const file = `locales/${locale}.json`;
  if (!fs.existsSync(file)) continue;
  for (const key of flatten(JSON.parse(fs.readFileSync(file, 'utf8')))) {
    allKeys.add(key);
  }
}

/**
 * Une cle est consideree utilisee si :
 *  - son nom exact apparait dans le code ;
 *  - le code enumere ses soeurs (`t(\`admin.messages.filter.${key}\`)`) ;
 *  - le code cite sa forme de base au pluriel (`admin.messages.unreadCount`).
 *
 * Les simples prefixes de parents ne suffisent pas : `admin.dashboard` est
 * present partout, ce qui masquerait toutes les cles mortes du tableau de bord.
 */
const PLURAL_SUFFIXES = ['_zero', '_one', '_two', '_few', '_many', '_other'];

function isUsed(key) {
  const parent = key.includes('.') ? key.slice(0, key.lastIndexOf('.')) : '';
  const dynamic = parent ? `${parent}.\${` : null;

  const pluralBase = PLURAL_SUFFIXES.some((suffix) => key.endsWith(suffix))
    ? key.slice(0, key.lastIndexOf('_'))
    : null;

  for (const { file, text } of source) {
    if (text.includes(key)) return file;
    if (dynamic && text.includes(dynamic)) return file;
    if (pluralBase && text.includes(pluralBase)) return file;
  }
  return null;
}

const dead = [];
const missing = [];

for (const key of [...allKeys].sort()) {
  if (prefixes.length && !prefixes.some((p) => key.startsWith(p))) continue;
  if (!isUsed(key)) dead.push(key);
}

for (const locale of ['fr', 'en']) {
  const file = `locales/${locale}.json`;
  if (!fs.existsSync(file)) continue;
  const keys = flatten(JSON.parse(fs.readFileSync(file, 'utf8')));
  for (const key of keys) {
    if (prefixes.length && !prefixes.some((p) => key.startsWith(p))) continue;
    if (!isUsed(key)) missing.push(`${locale}:${key}`);
  }
}

console.log(`Cles declarees auditees : ${[...allKeys].filter((k) => !prefixes.length || prefixes.some((p) => k.startsWith(p))).length}`);
console.log(`\nCles jamais referencees (${dead.length}) :`);
for (const key of dead) console.log(`  ${key}`);

console.log(`\nTotal par locale :`);
for (const locale of ['fr', 'en']) {
  const n = missing.filter((m) => m.startsWith(`${locale}:`)).length;
  console.log(`  ${locale}.json : ${n}`);
}

process.exitCode = 0;
