// Etat complet du schema live : tables + colonnes des tables d'administration.
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

const { rows: tables } = await client.query(
  `select table_name from information_schema.tables
    where table_schema='public' and table_type='BASE TABLE' order by table_name`,
);
console.log(`--- ${tables.length} tables : ${tables.map((r) => r.table_name).join(', ')}`);

for (const table of ['contact_messages', 'admin_users', 'admin_sessions']) {
  const { rows } = await client.query(
    `select column_name, data_type, is_nullable, column_default
       from information_schema.columns
      where table_schema='public' and table_name=$1
      order by ordinal_position`,
    [table],
  );
  if (!rows.length) {
    console.log(`\n--- ${table} : ABSENTE`);
    continue;
  }
  console.log(`\n--- ${table}`);
  for (const c of rows) {
    console.log(`   ${c.column_name.padEnd(18)} ${c.data_type.padEnd(28)} ${c.is_nullable === 'NO' ? 'NOT NULL' : ''}`);
  }
}

const { rows: enums } = await client.query(
  `select t.typname, string_agg(e.enumlabel, ',' order by e.enumsortorder) as labels
     from pg_type t join pg_enum e on e.enumtypid = t.oid
    where t.typname in ('message_status','user_role') group by t.typname`,
);
console.log('\n--- Enums');
for (const e of enums) console.log(`   ${e.typname}: ${e.labels}`);

await client.end();
