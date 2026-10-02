// Cherche le pooler Supabase qui accepte le projet (la region n'est pas
// devinable de facon fiable a partir du project ref).
import fs from 'node:fs';
import pg from 'pg';

function loadEnv() {
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
      if (!(t.slice(0, eq).trim() in process.env)) process.env[t.slice(0, eq).trim()] = value;
    }
  }
}

loadEnv();

const direct = new URL(process.env.DATABASE_URL);
const password = decodeURIComponent(direct.password);
const projectRef = new URL(process.env.NEXT_PUBLIC_SUPABASE_URL).hostname.split('.')[0];

const REGIONS = [
  'us-east-1',
  'us-west-1',
  'us-west-2',
  'eu-west-1',
  'eu-west-2',
  'eu-west-3',
  'eu-central-1',
  'eu-central-2',
  'ap-south-1',
  'ap-southeast-1',
  'ap-southeast-2',
  'ap-northeast-1',
  'ca-central-1',
  'sa-east-1',
];

const USERS = [`postgres.${projectRef}`, 'postgres'];

async function attempt(host, port, user) {
  const client = new pg.Client({
    host,
    port,
    user,
    password,
    database: 'postgres',
    ssl: { rejectUnauthorized: false },
    connectionTimeoutMillis: 12_000,
  });
  try {
    await client.connect();
    const { rows } = await client.query('select current_user as usr, current_database() as db');
    await client.end().catch(() => {});
    return { ok: true, host, port, user, info: `${rows[0].usr}@${rows[0].db}` };
  } catch (err) {
    await client.end().catch(() => {});
    return { ok: false, host, port, user, err: err.message.split('\n')[0] };
  }
}

const jobs = [];
for (const region of REGIONS) {
  for (const user of USERS) jobs.push(attempt(`aws-0-${region}.pooler.supabase.com`, 5432, user));
}

const results = await Promise.all(jobs);
const hits = results.filter((r) => r.ok);

console.log('--- Connexions reussies');
for (const h of hits) console.log(`  ${h.host}:${h.port} user=${h.user} -> ${h.info}`);

if (!hits.length) {
  console.log('\n--- Echecs (premiers messages uniques)');
  for (const msg of [...new Set(results.map((r) => r.err))].slice(0, 6)) console.log('  ' + msg);
  console.log('\nAucun pooler accepte le projet. Utiliser le Supabase SQL Editor.');
  process.exit(1);
}
