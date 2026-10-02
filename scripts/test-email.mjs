// Diagnostic de la chaîne e-mail : "npm run mail:test"
// Verifie la configuration SMTP et envoie un e-mail de test a l'adresse de notification.
import fs from 'node:fs';
import nodemailer from 'nodemailer';

// --- charge .env (le projet n'a pas de dependance dotenv) -------------------
for (const file of ['.env.local', '.env']) {
  if (!fs.existsSync(file)) continue;
  for (const line of fs.readFileSync(file, 'utf8').split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eq = trimmed.indexOf('=');
    if (eq < 0) continue;
    const key = trimmed.slice(0, eq).trim();
    let value = trimmed.slice(eq + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    if (!(key in process.env)) process.env[key] = value;
  }
}

const { SMTP_HOST, SMTP_PORT, SMTP_SECURE, SMTP_USER, SMTP_PASSWORD } = process.env;
const NOTIFY = process.env.CONTACT_NOTIFY_EMAIL || SMTP_USER;
const FROM_NAME = process.env.MAIL_FROM_NAME || 'Viking Solar';

const PLACEHOLDERS = [
  'your_email_password_or_app_password',
  'your_email_password',
  'changeme',
  'password',
  'votre_mot_de_passe',
];

console.log('--- Configuration detectee');
console.log('  SMTP_HOST            =', SMTP_HOST || '(ABSENT)');
console.log('  SMTP_PORT            =', SMTP_PORT || '(ABSENT)');
console.log('  SMTP_SECURE          =', SMTP_SECURE || '(ABSENT)');
console.log('  SMTP_USER            =', SMTP_USER || '(ABSENT)');
console.log('  SMTP_PASSWORD        =', SMTP_PASSWORD ? `[${SMTP_PASSWORD.length} car.]` : '(ABSENT)');
console.log('  CONTACT_NOTIFY_EMAIL =', NOTIFY || '(ABSENT)');
console.log('  MAIL_FROM_NAME       =', FROM_NAME);

// --- controles bloquants ---------------------------------------------------
const problems = [];
if (!SMTP_HOST) problems.push('SMTP_HOST absent');
if (!SMTP_USER) problems.push('SMTP_USER absent');
if (!SMTP_PASSWORD) problems.push('SMTP_PASSWORD absent');
if (!NOTIFY) problems.push('CONTACT_NOTIFY_EMAIL absent');

if (SMTP_USER && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(SMTP_USER)) {
  problems.push(`SMTP_USER n'est pas une adresse valide : "${SMTP_USER}"`);
}
if (NOTIFY && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(NOTIFY)) {
  problems.push(`CONTACT_NOTIFY_EMAIL n'est pas une adresse valide : "${NOTIFY}"`);
}
if (SMTP_PASSWORD && PLACEHOLDERS.includes(SMTP_PASSWORD.toLowerCase())) {
  problems.push(
    'SMTP_PASSWORD est encore le placeholder de .env.example — aucun e-mail ne peut partir.',
  );
}
if (SMTP_PASSWORD && /[\s]/.test(SMTP_PASSWORD)) {
  problems.push('SMTP_PASSWORD contient des espaces (les mots de passe Gmail n’en ont pas).');
}

if (problems.length) {
  console.log('\n--- BLOQUANT');
  for (const p of problems) console.log('  x ' + p);
  console.log(
    '\nPour Gmail, generer un "mot de passe d\'application" :\n' +
      '  Google Account > Security > 2-Step Verification (activee) > App passwords\n' +
      '  Creer une app password pour "Mail", puis la coller dans SMTP_PASSWORD (16 caracteres).\n',
  );
  process.exit(1);
}

const transporter = nodemailer.createTransport({
  host: SMTP_HOST,
  port: Number(SMTP_PORT || 587),
  secure: SMTP_SECURE === 'true',
  auth: { user: SMTP_USER, pass: SMTP_PASSWORD },
  connectionTimeout: 15_000,
  greetingTimeout: 15_000,
  socketTimeout: 20_000,
});

console.log('\n--- Test de connexion/authentification SMTP');
try {
  await transporter.verify();
  console.log('  OK : authentification SMTP reussie.');
} catch (err) {
  console.log('  ECHEC :', err?.message || err);
  console.log(
    '\nCauses les plus probables :\n' +
      '  - SMTP_PASSWORD n’est pas un mot de passe d’application Gmail\n' +
      '  - la verification en 2 etapes n’est pas activee sur le compte\n' +
      '  - l’acces aux apps moins securisees est bloque\n',
  );
  process.exit(1);
}

if (process.argv.includes('--send')) {
  const from = `"${FROM_NAME}" <${SMTP_USER}>`;
  const info = await transporter.sendMail({
    from,
    to: NOTIFY,
    replyTo: SMTP_USER,
    subject: 'Viking Solar — test de reception des demandes de devis',
    text: `Ceci est un test automatique. Si vous lisez ceci, la reception fonctionne.\n\nDestinataire : ${NOTIFY}\nEnvoye le : ${new Date().toISOString()}\n`,
    html: `<div style="font-family:Segoe UI,Arial,sans-serif;background:#0b1220;padding:24px">
  <div style="max-width:520px;margin:0 auto;background:#111a2e;border:1px solid #1e293b;border-radius:14px;padding:28px">
    <h2 style="margin:0 0 10px;color:#fff;font-size:19px">Test de reception</h2>
    <p style="margin:0 0 14px;color:#cbd5e1;font-size:14px;line-height:1.6">
      Si vous lisez cet e-mail, la reception des demandes de devis fonctionne.
    </p>
    <table style="font-size:13px;color:#94a3b8;border-collapse:collapse">
      <tr><td style="padding:3px 12px 3px 0">Destinataire</td><td style="color:#e2e8f0">${NOTIFY}</td></tr>
      <tr><td style="padding:3px 12px 3px 0">Expediteur</td><td style="color:#e2e8f0">${from}</td></tr>
      <tr><td style="padding:3px 12px 3px 0">Horodatage</td><td style="color:#e2e8f0">${new Date().toISOString()}</td></tr>
    </table>
  </div>
</div>`,
  });
  console.log(`\n  E-mail de test envoye a ${NOTIFY}`);
  console.log(`  id=${info.messageId} accepted=${info.accepted?.join(',')}`);
} else {
  console.log('\n  Authentification OK. Relancez avec "--send" pour envoyer un e-mail de test.');
}
