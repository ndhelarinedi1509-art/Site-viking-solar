// Inspecte la base Supabase reelle via DATABASE_URL : pg n'est pas installe en CLI.
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
      const key = t.slice(0, eq).trim();
      let value = t.slice(eq + 1).trim();
      if (
        (value.startsWith('"') && value.endsWith('"')) ||
        (value.startsWith("'") && value.endsWith("'"))
      ) {
        value = value.slice(1, -1);
      }
      if (!(key in process.env)) process.env[key] = value;
    }
  }
}

loadEnv();

const url = process.env.DATABASE_URL;
if (!url) {
  console.error('DATABASE_URL absent de .env');
  process.exit(1);
}

const client = new pg.Client({ connectionString: url, ssl: { rejectUnauthorized: false } });

try {
  await client.connect();
  const { rows } = await client.query(
    `select table_name,
            (select count(*) from information_schema.columns c
              where c.table_schema='public' and c.table_name = t.table_name) as cols
       from information_schema.tables t
      where table_schema = 'public' and table_type = 'BASE TABLE'
      order by table_name`,
  );
  console.log(`--- Tables dans public (${rows.length})`);
  for (const r of rows) console.log(`  ${r.cols > 0 ? 'OK ' : '-- '} ${r.table_name} (${r.cols} col.)`);

  const names = new Set(rows.map((r) => r.table_name));

  // Colonnes attendues par le code applicatif.
  const expected = {
    contact_messages: ['id', 'name', 'email', 'phone', 'service', 'message', 'status', 'created_at'],
    newsletter_subscribers: ['id', 'email', 'created_at'],
    activity_logs: ['id', 'created_at'],
  };

  console.log('\n--- Tables requises par le code');
  for (const [table, cols] of Object.entries(expected)) {
    if (!names.has(table)) {
      console.log(`  MANQUANTE  ${table}`);
      continue;
    }
    const { rows: actual } = await client.query(
      `select column_name from information_schema.columns
        where table_schema='public' and table_name=$1`,
      [table],
    );
    const have = new Set(actual.map((r) => r.column_name));
    const missing = cols.filter((c) => !have.has(c));
    console.log(
      missing.length === 0
        ? `  OK         ${table} (toutes les colonnes attendues)`
        : `  INCOMPLETE ${table} — colonnes manquantes: ${missing.join(', ')}`,
    );
  }

  // Volume reel des leads.
  if (names.has('contact_messages')) {
    const { rows: c } = await client.query(
      `select count(*)::int as total,
              max(created_at) as last,
              count(*) filter (where status='new')::int as unread
         from contact_messages`,
    );
    console.log(
      `\n--- contact_messages: ${c[0].total} ligne(s), ${c[0].unread} non lue(s), dernier ${c[0].last ?? '—'}`,
    );
  }
} catch (err) {
  console.error('Echec :', err.message);
  process.exitCode = 1;
} finally {
  await client.end().catch(() => {});
}
