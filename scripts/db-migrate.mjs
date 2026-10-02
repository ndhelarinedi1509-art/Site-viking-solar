// Cree les tables absentes de la base Supabase reelle.
// necessaire car supabase/schema.sql n'a jamais ete applique en entier :
// seules services, projects, testimonials et site_settings existent.
//
// Connexion via le pooler (aws-0-eu-central-1) car l'hote direct
// db.<ref>.supabase.co ne resout pas en DNS depuis cette machine.
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

const direct = new URL(process.env.DATABASE_URL);
const password = decodeURIComponent(direct.password);
const projectRef = new URL(process.env.NEXT_PUBLIC_SUPABASE_URL).hostname.split('.')[0];

const CANDIDATES = [
  {
    label: 'pooler eu-west-1 (session, 5432)',
    config: {
      host: 'aws-0-eu-west-1.pooler.supabase.com',
      port: 5432,
      user: `postgres.${projectRef}`,
      password,
      database: 'postgres',
      ssl: { rejectUnauthorized: false },
      connectionTimeoutMillis: 15_000,
    },
  },
  {
    label: 'pooler eu-west-1 (transaction, 6543)',
    config: {
      host: 'aws-0-eu-west-1.pooler.supabase.com',
      port: 6543,
      user: `postgres.${projectRef}`,
      password,
      database: 'postgres',
      ssl: { rejectUnauthorized: false },
      connectionTimeoutMillis: 15_000,
    },
  },
  {
    label: 'pooler eu-central-1 (fallback)',
    config: {
      host: 'aws-0-eu-central-1.pooler.supabase.com',
      port: 5432,
      user: `postgres.${projectRef}`,
      password,
      database: 'postgres',
      ssl: { rejectUnauthorized: false },
      connectionTimeoutMillis: 15_000,
    },
  },
  {
    label: `direct ${direct.hostname}`,
    config: {
      host: direct.hostname,
      port: Number(direct.port || 5432),
      user: direct.username,
      password,
      database: direct.pathname.replace(/^\//, '') || 'postgres',
      ssl: { rejectUnauthorized: false },
      connectionTimeoutMillis: 15_000,
    },
  },
];

let client = null;
let usedLabel = '';
for (const candidate of CANDIDATES) {
  const c = new pg.Client(candidate.config);
  try {
    await c.connect();
    const { rows } = await c.query('select current_database() as db, current_user as usr');
    client = c;
    usedLabel = candidate.label;
    console.log(`Connexion etablie via ${candidate.label} (${rows[0].usr}@${rows[0].db})`);
    break;
  } catch (err) {
    console.log(`  ${candidate.label} -> ${err.message.split('\n')[0]}`);
    await c.end().catch(() => {});
  }
}

if (!client) {
  console.error('\nAucune connexion possible. Executez le SQL dans le Supabase SQL Editor.');
  process.exit(1);
}

/** Statements idempotents : seul l'objet manquant est cree. */
const MIGRATIONS = [
  {
    name: 'enum message_status',
    sql: `do $$ begin
            create type message_status as enum ('new','read','replied','archived');
          exception when duplicate_object then null; end $$;`,
  },
  {
    name: 'enum user_role',
    sql: `do $$ begin
            create type user_role as enum ('admin','manager','user');
          exception when duplicate_object then null; end $$;`,
  },
  {
    name: 'table contact_messages',
    sql: `create table if not exists contact_messages (
            id uuid primary key default gen_random_uuid(),
            name text not null,
            email text not null,
            phone text,
            service text,
            message text not null,
            status message_status not null default 'new',
            created_at timestamptz not null default now()
          );
          comment on table contact_messages is 'Messages recus via le formulaire de contact';`,
  },
  {
    name: 'index contact_messages.status',
    sql: `create index if not exists idx_contact_messages_status on contact_messages(status);`,
  },
  {
    name: 'index contact_messages.created_at',
    sql: `create index if not exists idx_contact_messages_created_at on contact_messages(created_at desc);`,
  },
  {
    name: 'index contact_messages.status_created_at',
    sql: `create index if not exists idx_contact_messages_status_created_at
            on contact_messages(status, created_at desc);`,
  },
  {
    name: 'table newsletter_subscribers',
    sql: `create table if not exists newsletter_subscribers (
            id uuid primary key default gen_random_uuid(),
            email text not null unique,
            subscribed_at timestamptz not null default now(),
            active boolean not null default true
          );
          comment on table newsletter_subscribers is 'Liste des abonnes a la newsletter';`,
  },
  {
    name: 'contact_messages.subject',
    sql: `alter table contact_messages add column if not exists subject text;`,
  },
  {
    name: 'contact_messages.replied_at',
    sql: `alter table contact_messages add column if not exists replied_at timestamptz;`,
  },
  {
    name: 'contact_messages.replied_message',
    sql: `alter table contact_messages add column if not exists replied_message text;`,
  },
  {
    name: 'contact_messages.replied_by',
    sql: `alter table contact_messages add column if not exists replied_by text;`,
  },
  {
    name: 'index newsletter_subscribers.email',
    sql: `create index if not exists idx_newsletter_subscribers_email on newsletter_subscribers(email);`,
  },
  {
    name: 'RLS on contact_messages',
    sql: `alter table contact_messages enable row level security;`,
  },
  {
    name: 'RLS on newsletter_subscribers',
    sql: `alter table newsletter_subscribers enable row level security;`,
  },
  {
    name: 'policy: anon can submit contact messages',
    sql: `do $$ begin
            create policy "Anonymous can submit contact messages"
              on contact_messages for insert to anon with check (true);
          exception when duplicate_object then null; end $$;`,
  },
  {
    name: 'policy: anon can subscribe to newsletter',
    sql: `do $$ begin
            create policy "Anonymous can subscribe to newsletter"
              on newsletter_subscribers for insert to anon with check (true);
          exception when duplicate_object then null; end $$;`,
  },
];

let failed = 0;
for (const m of MIGRATIONS) {
  try {
    await client.query(m.sql);
    console.log(`  OK      ${m.name}`);
  } catch (err) {
    failed += 1;
    console.log(`  ECHEC   ${m.name} -> ${err.message}`);
  }
}

// PostgREST garde les tables ET les policies RLS en cache et ne recharge que sur
// notification. Sans ce NOTIFY, l'API peut repondre "table introuvable" ou
// "violates row-level security policy" pendant plusieurs minutes apres la creation.
try {
  await client.query(`notify pgrst, 'reload schema'`);
  console.log('  OK      NOTIFY pgrst (rechargement du cache PostgREST)');
} catch (err) {
  console.log(`  AVERT   NOTIFY pgrst impossible -> ${err.message}`);
}

console.log(`\n${MIGRATIONS.length - failed}/${MIGRATIONS.length} statements appliquees via ${usedLabel}`);

const { rows } = await client.query(`
  select table_name from information_schema.tables
   where table_schema='public' and table_name in ('contact_messages','newsletter_subscribers')
   order by table_name`);
console.log('Tables verifiees :', rows.map((r) => r.table_name).join(', ') || '(aucune)');

await client.end();
process.exitCode = failed > 0 ? 1 : 0;
