// Etat du schema distant via l'API REST Supabase (service role key).
import fs from 'node:fs';

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

const base = (process.env.NEXT_PUBLIC_SUPABASE_URL || '').replace(/\/$/, '');
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!base || !key) {
  console.error('NEXT_PUBLIC_SUPABASE_URL ou SUPABASE_SERVICE_ROLE_KEY absent');
  process.exit(1);
}

// Chaque table connue du schema.sql est interrogee : 200 = existe, 404 = absente.
const TABLES = [
  'users',
  'permissions',
  'user_roles',
  'categories',
  'services',
  'projects',
  'team_members',
  'contact_messages',
  'newsletter_subscribers',
  'faq_items',
  'testimonials',
  'site_settings',
  'activity_logs',
  'notifications',
];

console.log('--- Tables declarees dans supabase/schema.sql');

let missing = 0;
for (const table of TABLES) {
  const res = await fetch(`${base}/rest/v1/${table}?select=*&limit=1`, {
    headers: { apikey: key, Authorization: `Bearer ${key}` },
  });
  if (res.ok) {
    const body = await res.text();
    let count = '?';
    const head = await fetch(`${base}/rest/v1/${table}?select=*`, {
      headers: {
        apikey: key,
        Authorization: `Bearer ${key}`,
        Prefer: 'count=exact',
        Range: '0-0',
      },
    });
    const cr = head.headers.get('content-range');
    if (cr && cr.includes('/')) count = cr.split('/')[1];
    console.log(`  OK       ${table.padEnd(24)} ${count} ligne(s)${body ? '' : ''}`);
  } else {
    const text = await res.text();
    missing += 1;
    const code = text.match(/"code":"([^"]+)"/)?.[1] ?? res.status;
    console.log(`  ABSENTE  ${table.padEnd(24)} ${code}`);
  }
}

console.log(`\n${missing} table(s) absente(s) sur ${TABLES.length}.`);
