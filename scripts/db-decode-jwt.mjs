// Decode la cle anon : PostgREST deduit le role Postgres du claim "role" du JWT
// lorsqu'un en-tete Authorization est present.
import fs from 'node:fs';

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

for (const name of ['NEXT_PUBLIC_SUPABASE_ANON_KEY', 'SUPABASE_SERVICE_ROLE_KEY']) {
  const jwt = process.env[name];
  console.log(`--- ${name}`);
  if (!jwt) {
    console.log('   (absente)');
    continue;
  }
  if (!jwt.startsWith('ey')) {
    console.log('   cle au nouveau format (sb_...) :', jwt.slice(0, 14) + '...');
    continue;
  }
  const payload = JSON.parse(Buffer.from(jwt.split('.')[1], 'base64url').toString());
  console.log('   role      =', payload.role);
  console.log('   iss       =', payload.iss);
  console.log('   ref       =', payload.ref);
  console.log('   iat/exp   =', payload.iat, '->', payload.exp);
}
