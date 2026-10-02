import nodemailer from 'nodemailer';
import type { Transporter } from 'nodemailer';

let transporter: Transporter | null = null;

export class MailNotConfiguredError extends Error {
  readonly problems: string[];
  constructor(problems: string[]) {
    super(`SMTP mal configure : ${problems.join(' ; ')}`);
    this.name = 'MailNotConfiguredError';
    this.problems = problems;
  }
}

export class MailDeliveryError extends Error {
  constructor(message: string, options?: { cause?: unknown }) {
    super(message, options);
    this.name = 'MailDeliveryError';
  }
}

const PLACEHOLDER_PASSWORDS = new Set([
  'your_email_password_or_app_password',
  'your_email_password',
  'your_app_password',
  'changeme',
  'password',
  'motdepasse',
  'votre_mot_de_passe',
]);

const EMAIL_RE = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

function env(key: string): string {
  const value = process.env[key];
  return typeof value === 'string' ? value.trim() : '';
}

/**
 * Description complete de ce qui manque pour pouvoir envoyer un e-mail.
 * Utilisee pour eveiter les pannes silencieuses : si cette liste est non vide,
 * aucune notification ne partira et le caller doit le signaler.
 */
export function checkMailConfig(): string[] {
  const problems: string[] = [];

  const host = env('SMTP_HOST');
  const user = env('SMTP_USER');
  const pass = env('SMTP_PASSWORD');
  const notify = getNotifyTo();

  if (!host) problems.push('SMTP_HOST absent');
  if (!user) problems.push('SMTP_USER absent');
  if (!pass) {
    problems.push('SMTP_PASSWORD absent');
  } else if (PLACEHOLDER_PASSWORDS.has(pass.toLowerCase())) {
    problems.push('SMTP_PASSWORD est encore le placeholder de .env.example');
  } else if (/\s/.test(pass)) {
    problems.push('SMTP_PASSWORD contient des espaces (invalide pour Gmail)');
  }

  if (!notify) problems.push('CONTACT_NOTIFY_EMAIL absent');
  else if (!EMAIL_RE.test(notify)) problems.push(`CONTACT_NOTIFY_EMAIL invalide : "${notify}"`);
  if (user && !EMAIL_RE.test(user)) problems.push(`SMTP_USER invalide : "${user}"`);

  const port = Number(env('SMTP_PORT') || 587);
  if (!Number.isInteger(port) || port < 1 || port > 65535) {
    problems.push(`SMTP_PORT invalide : "${env('SMTP_PORT')}"`);
  }

  return problems;
}

export function isMailConfigured(): boolean {
  return checkMailConfig().length === 0;
}

function getTransporter(): Transporter {
  const problems = checkMailConfig();
  if (problems.length > 0) throw new MailNotConfiguredError(problems);

  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: env('SMTP_HOST'),
      port: Number(env('SMTP_PORT') || 587),
      secure: env('SMTP_SECURE') === 'true',
      auth: { user: env('SMTP_USER'), pass: env('SMTP_PASSWORD') },
      // Un serveur SMTP injoignable ne doit pas faire bloquer la requete du visiteur.
      connectionTimeout: 15_000,
      greetingTimeout: 15_000,
      socketTimeout: 20_000,
    });
  }
  return transporter;
}

/** Neutralise les CR/LF qui permettraient d'injecter un en-tete SMTP. */
function headerSafe(value: string): string {
  return value.replace(/[\r\n]+/g, ' ').trim();
}

function getFrom(): string {
  const name = headerSafe(env('MAIL_FROM_NAME') || 'Viking Solar') || 'Viking Solar';
  return `"${name}" <${env('SMTP_USER')}>`;
}

function getNotifyTo(): string {
  return env('CONTACT_NOTIFY_EMAIL') || env('SMTP_USER');
}

export interface ContactSubmission {
  name: string;
  email: string;
  phone: string;
  service: string;
  subject: string;
  message: string;
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

const SERVICE_LABELS: Record<string, string> = {
  installation: 'Installation de panneaux solaires',
  hybrid: 'Système hybride (réseau + solaire)',
  maintenance: 'Maintenance & entretien',
  industrial: 'Installation industrielle',
  residential: 'Installation résidentielle',
  audit: 'Audit énergétique',
  other: 'Autre / non précisé',
};

function serviceLabel(key: string): string {
  return SERVICE_LABELS[key] ?? key;
}

interface Field {
  label: string;
  value: string;
  /** Rend la valeur cliquable dans le mail (mailto:, tel:). */
  href?: string;
}

function buildFields(data: ContactSubmission): Field[] {
  const name = headerSafe(data.name) || '—';
  const email = headerSafe(data.email);
  const phone = headerSafe(data.phone);

  return [
    { label: 'Nom complet', value: name },
    { label: 'Email', value: email, href: `mailto:${email}` },
    { label: 'Téléphone', value: phone, href: `tel:${phone.replace(/[^\d+]/g, '')}` },
    { label: 'Service demandé', value: serviceLabel(data.service) },
    { label: 'Objet', value: headerSafe(data.subject) || '—' },
    { label: 'Reçu le', value: new Date().toLocaleString('fr-FR', { dateStyle: 'full', timeStyle: 'short' }) },
  ];
}

function layout(body: string): string {
  return `
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Viking Solar</title>
</head>
<body style="margin:0;padding:0;background-color:#0b1220;font-family:Segoe UI,Arial,sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#0b1220;padding:24px 0;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background-color:#111a2e;border:1px solid #1e293b;border-radius:16px;overflow:hidden;">
          <tr>
            <td style="background-color:#16a34a;padding:18px 28px;">
              <span style="color:#ffffff;font-size:20px;font-weight:bold;">Viking Solar</span>
            </td>
          </tr>
          <tr>
            <td style="padding:28px;color:#e2e8f0;font-size:14px;line-height:1.6;">
              ${body}
            </td>
          </tr>
          <tr>
            <td style="padding:16px 28px;border-top:1px solid #1e293b;color:#64748b;font-size:12px;">
              Viking Solar &mdash; Kinshasa, RDC &middot; <a href="https://vickingsolar.com" style="color:#16a34a;text-decoration:none;">vickingsolar.com</a>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

export function adminNotificationHtml(data: ContactSubmission): string {
  const rows = buildFields(data)
    .map(
      (field) =>
        `<tr>
           <td style="padding:8px 12px;color:#94a3b8;white-space:nowrap;font-weight:600;">${escapeHtml(field.label)}</td>
           <td style="padding:8px 12px;color:#e2e8f0;">${
             field.href
               ? `<a href="${escapeHtml(field.href)}" style="color:#22c55e;text-decoration:none;">${escapeHtml(field.value)}</a>`
               : escapeHtml(field.value)
           }</td>
         </tr>`,
    )
    .join('');

  return layout(`
    <h2 style="margin:0 0 12px;color:#ffffff;font-size:18px;">Nouvelle demande de devis</h2>
    <p style="margin:0 0 16px;color:#94a3b8;">Un client a rempli le formulaire « Devis gratuit » sur vickingsolar.com.</p>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #1e293b;border-radius:10px;margin-bottom:16px;">
      ${rows}
    </table>
    <p style="margin:0 0 6px;color:#94a3b8;font-weight:600;">Message&nbsp;:</p>
    <p style="margin:0 0 20px;padding:12px;background-color:#0b1220;border:1px solid #1e293b;border-radius:10px;color:#e2e8f0;white-space:pre-line;">${escapeHtml(data.message)}</p>
    <p style="margin:0;font-size:13px;color:#64748b;">
      Répondre directement à cet e-mail recontacte le client.
      <a href="https://vickingsolar.com/admin/messages" style="color:#22c55e;text-decoration:none;">Voir dans le back-office</a>
    </p>
  `);
}

export function adminNotificationText(data: ContactSubmission): string {
  const lines = buildFields(data).map((f) => `${f.label}: ${f.value}`);
  return [
    'NOUVELLE DEMANDE DE DEVIS - Viking Solar',
    '',
    'Un client a rempli le formulaire « Devis gratuit » sur vickingsolar.com.',
    '',
    ...lines,
    '',
    'Message :',
    data.message,
    '',
    '---',
    'Répondre directement à cet e-mail recontacte le client.',
    'Back-office : https://vickingsolar.com/admin/messages',
  ].join('\n');
}

export function acknowledgmentHtml(data: ContactSubmission): string {
  const name = escapeHtml(headerSafe(data.name));
  const subject = escapeHtml(headerSafe(data.subject));
  return layout(`
    <h2 style="margin:0 0 12px;color:#ffffff;font-size:18px;">Merci ${name}&nbsp;!</h2>
    <p style="margin:0 0 12px;color:#e2e8f0;">
      Votre demande de devis a bien été transmise à notre équipe. Nous vous en remercions
      et reviendrons vers vous dans les plus brefs délais.
    </p>
    <p style="margin:0 0 6px;color:#94a3b8;">Votre demande concernait&nbsp;:</p>
    <p style="margin:0 0 16px;color:#e2e8f0;font-weight:600;">${subject}</p>
    <p style="margin:0 0 16px;color:#94a3b8;">
      Service&nbsp;: <strong style="color:#e2e8f0;">${escapeHtml(serviceLabel(data.service))}</strong>
    </p>
    <p style="margin:0;color:#64748b;font-size:13px;">
      Si votre demande est urgente, contactez-nous directement au
      <strong style="color:#e2e8f0;">${escapeHtml(env('NEXT_PUBLIC_CONTACT_PHONE') || '+243820128315')}</strong>.
    </p>
  `);
}

export function acknowledgmentText(data: ContactSubmission): string {
  return [
    `Merci ${headerSafe(data.name)} !`,
    '',
    'Votre demande de devis a bien été transmise à notre équipe. Nous vous en remercions',
    'et reviendrons vers vous dans les plus brefs délais.',
    '',
    `Votre demande concernait : ${headerSafe(data.subject)}`,
    `Service : ${serviceLabel(data.service)}`,
    '',
    `Si votre demande est urgente : ${env('NEXT_PUBLIC_CONTACT_PHONE') || '+243820128315'}`,
  ].join('\n');
}

export interface SendResult {
  notified: boolean;
  ack: boolean;
}

/**
 * Envoie la notification a l'admin puis l'accuse de reception au client.
 *
 * @throws {MailNotConfiguredError} configuration SMTP incomplete ou placeholder
 * @throws {MailDeliveryError}      la notification admin n'a pas pu partir
 */
export async function sendContactEmails(data: ContactSubmission): Promise<SendResult> {
  const transport = getTransporter();
  const notifyTo = getNotifyTo();
  const from = getFrom();

  const customer = headerSafe(data.name) || 'un visiteur';
  const subjectService = serviceLabel(data.service);

  // 1. Notification a l'admin : critique. Une erreur doit remonter, jamais etre masquee.
  let info;
  try {
    info = await transport.sendMail({
      from,
      to: notifyTo,
      replyTo: `${headerSafe(data.name) || 'Client'} <${headerSafe(data.email)}>`,
      subject: `[Devis] ${subjectService} — ${customer}`,
      text: adminNotificationText(data),
      html: adminNotificationHtml(data),
    });
  } catch (err) {
    throw new MailDeliveryError(
      `Notification de devis non envoyee a ${notifyTo} : ${describe(err)}`,
      { cause: err },
    );
  }

  console.log(
    `[mail] notification de devis envoyee a ${notifyTo} (id=${info.messageId}) — ${subjectService} / ${customer}`,
  );

  // 2. Accuse de reception : best effort, ne doit pas faire echouer la demande.
  let ack = false;
  try {
    await transport.sendMail({
      from,
      to: headerSafe(data.email),
      subject: 'Votre demande de devis a bien ete recue — Viking Solar',
      text: acknowledgmentText(data),
      html: acknowledgmentHtml(data),
    });
    ack = true;
  } catch (err) {
    console.error(`[mail] accuse de reception non envoye a ${data.email} : ${describe(err)}`);
  }

  return { notified: true, ack };
}

function describe(err: unknown): string {
  if (err && typeof err === 'object') {
    const e = err as { message?: string; code?: string; command?: string; responseCode?: number };
    return [e.message, e.code, e.responseCode].filter(Boolean).join(' / ') || String(err);
  }
  return String(err);
}

// ===========================================
// REPONDE DEPUIS LE BACK-OFFICE
// ===========================================

export interface ReplyToQuote {
  to: string;
  toName: string;
  originalSubject: string;
  originalMessage: string;
  service: string;
  body: string;
}

export function quoteReplyHtml(data: ReplyToQuote): string {
  return layout(`
    <p style="margin:0 0 16px;color:#e2e8f0;">Bonjour ${escapeHtml(headerSafe(data.toName))},</p>
    <div style="margin:0 0 20px;padding:16px;background-color:#0b1220;border:1px solid #1e293b;border-radius:10px;color:#e2e8f0;white-space:pre-line;font-size:14px;line-height:1.7;">${escapeHtml(data.body)}</div>
    <p style="margin:0 0 20px;color:#94a3b8;">
      Cordialement,<br />
      <strong style="color:#ffffff;">L'équipe Viking Solar</strong><br />
      <a href="tel:${escapeHtml(env('NEXT_PUBLIC_CONTACT_PHONE') || '+243820128315')}" style="color:#22c55e;text-decoration:none;">${escapeHtml(env('NEXT_PUBLIC_CONTACT_PHONE') || '+243820128315')}</a>
    </p>
    <hr style="border:0;border-top:1px solid #1e293b;margin:0 0 12px;" />
    <p style="margin:0;font-size:12px;color:#64748b;line-height:1.6;">
      Votre demande&nbsp;«&nbsp;${escapeHtml(headerSafe(data.originalSubject))}&nbsp;»<br />
      <span style="white-space:pre-line;">${escapeHtml(data.originalMessage)}</span>
    </p>
  `);
}

export function quoteReplyText(data: ReplyToQuote): string {
  return [
    `Bonjour ${headerSafe(data.toName)},`,
    '',
    data.body,
    '',
    'Cordialement,',
    "L'équipe Viking Solar",
    env('NEXT_PUBLIC_CONTACT_PHONE') || '+243820128315',
    '',
    '---',
    `Votre demande « ${headerSafe(data.originalSubject)} »`,
    data.originalMessage,
  ].join('\n');
}

/**
 * Reponse de l'administrateur a une demande de devis.
 *
 * @throws {MailNotConfiguredError} configuration SMTP incomplete
 * @throws {MailDeliveryError}      le message n'a pas pu etre envoye au client
 */
export async function sendQuoteReply(data: ReplyToQuote): Promise<{ messageId: string }> {
  const transport = getTransporter();
  const from = getFrom();

  const original = headerSafe(data.originalSubject) || 'votre demande de devis';

  let info;
  try {
    info = await transport.sendMail({
      from,
      to: headerSafe(data.to),
      replyTo: from,
      subject: `Re: ${original}`,
      text: quoteReplyText(data),
      html: quoteReplyHtml(data),
    });
  } catch (err) {
    throw new MailDeliveryError(
      `Reponse non envoyee a ${data.to} : ${describe(err)}`,
      { cause: err },
    );
  }

  console.log(`[mail] reponse de devis envoyee a ${data.to} (id=${info.messageId})`);
  return { messageId: info.messageId };
}
