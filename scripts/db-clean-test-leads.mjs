// Supprime les lignes de test creees par les scripts de diagnostic.
import fs from 'node:fs';
import pg from 'pg';

for (const file of ['.env.local', '.env']) {
  if (!fs.existsSync(file)) continue;
  for (const line of fs.readFileSync(file, 'utf8').split(/\r?\n/)) {
    const t = line.trim();
    if (!t || t.startsWith('#')) continue;
    const eq = t.indexOf('=');
    if (eq < 0) continue;
    let value = t.slice(eq + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    const key = t.slice(0, eq).trim();
    if (!(key in process.env)) process.env[key] = value;
  }
}

const direct = new URL(process.env.DATABASE_URL);
const projectRef = new URL(process.env.NEXT_PUBLIC_SUPABASE_URL).hostname.split('.')[0];

const client = new pg.Client({
  host: 'aws-0-eu-west-1.pooler.supabase.com',
  port: 5432,
  user: `postgres.${projectRef}`,
  password: decodeURIComponent(direct.password),
  database: 'postgres',
  ssl: { rejectUnauthorized: false },
  connectionTimeoutMillis: 15_000,
});
await client.connect();

const PATTERNS = [
  '%viking-solar.test',
  '%diagnostic%',
  'jean.test@example.com',
  '%debug%',
  '%test entetes%',
  '%headers%',
];

let total = 0;
for (const pattern of PATTERNS) {
  const { rowCount } = await client.query('delete from contact_messages where email like $1', [
    pattern,
  ]);
  if (rowCount) console.log(`  supprime ${rowCount} ligne(s) pour ${pattern}`);
  total += rowCount ?? 0;
}

const { rows } = await client.query('select count(*)::int as n from contact_messages');
console.log(`\n${total} ligne(s) de test supprimee(s). Restant : ${rows[0].n}`);

await client.end();
