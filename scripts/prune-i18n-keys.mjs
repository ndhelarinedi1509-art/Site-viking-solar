// Supprime les cles de traduction orphelines, dans les deux locales.
//
//   node scripts/prune-i18n-keys.mjs admin.dashboard.activity1 …
//
// Sans argument, ne supprime rien : le script ne fait que lire et rapporter.
import fs from 'node:fs';

const targets = process.argv.slice(2);

if (targets.length === 0) {
  console.error('Aucun chemin de cle fourni. Rien n a ete supprime.');
  process.exit(1);
}

function prune(object, pathParts) {
  let node = object;
  for (let i = 0; i < pathParts.length - 1; i += 1) {
    if (!node || typeof node !== 'object') return false;
    node = node[pathParts[i]];
  }
  if (!node || typeof node !== 'object') return false;
  const last = pathParts[pathParts.length - 1];
  if (!(last in node)) return false;
  delete node[last];
  return true;
}

for (const locale of ['fr', 'en']) {
  const file = `locales/${locale}.json`;
  const data = JSON.parse(fs.readFileSync(file, 'utf8'));
  let removed = 0;
  for (const target of targets) {
    if (prune(data, target.split('.'))) removed += 1;
  }
  fs.writeFileSync(file, JSON.stringify(data, null, 2) + '\n', 'utf8');
  console.log(`${locale}.json : ${removed}/${targets.length} cle(s) supprimee(s)`);
}
