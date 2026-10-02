// Verifie que les demandes de devis sont bien arrivees en base.
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

const { rows } = await client.query(`
  select to_char(created_at at time zone 'Africa/Kinshasa','DD/MM/YYYY HH24:MI') as quand,
         name, email, service, status, left(message, 60) as extrait
    from contact_messages
   order by created_at desc
   limit 10`);

console.log(`--- ${rows.length} demande(s) recente(s)`);
for (const r of rows) {
  console.log(`  [${r.quand}] ${r.status.padEnd(5)} ${r.name} <${r.email}> ${r.service ?? ''}`);
  console.log(`           ${r.extrait}`);
}

const { rows: total } = await client.query(
  `select count(*)::int as n, count(*) filter (where status='new')::int as neuves from contact_messages`,
);
console.log(`\nTotal: ${total[0].n} demande(s), dont ${total[0].neuves} non traitee(s).`);

await client.end();
