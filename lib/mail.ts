import nodemailer from 'nodemailer';
import type { Transporter } from 'nodemailer';

let transporter: Transporter | null = null;

function getTransporter(): Transporter | null {
  const host = process.env.SMTP_HOST;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASSWORD;
  if (!host || !user || !pass) return null;

  if (!transporter) {
    transporter = nodemailer.createTransport({
      host,
      port: Number(process.env.SMTP_PORT || 587),
      secure: process.env.SMTP_SECURE === 'true',
      auth: { user, pass },
    });
  }
  return transporter;
}

function getFrom(): string {
  const user = process.env.SMTP_USER || '';
  const name = process.env.MAIL_FROM_NAME || 'Viking Solar';
  return `"${name}" <${user}>`;
}

function getNotifyTo(): string {
  return process.env.CONTACT_NOTIFY_EMAIL || process.env.SMTP_USER || '';
}

export interface ContactSubmission {
  name: string;
  email: string;
  phone: string;
  service: string;
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
  const service = data.service || '-';
  const rows = [
    ['Nom', data.name],
    ['Email', data.email],
    ['Téléphone', data.phone],
    ['Service', service],
  ]
    .map(
      ([label, value]) =>
        `<tr>
           <td style="padding:8px 12px;color:#94a3b8;white-space:nowrap;font-weight:600;">${label}</td>
           <td style="padding:8px 12px;color:#e2e8f0;">${escapeHtml(value)}</td>
         </tr>`,
    )
    .join('');

  return layout(`
    <h2 style="margin:0 0 12px;color:#ffffff;font-size:18px;">Nouveau message de contact</h2>
    <p style="margin:0 0 16px;color:#94a3b8;">Vous avez reçu une nouvelle demande via le formulaire de contact du site.</p>
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #1e293b;border-radius:10px;margin-bottom:16px;">
      ${rows}
    </table>
    <p style="margin:0 0 6px;color:#94a3b8;font-weight:600;">Message&nbsp;:</p>
    <p style="margin:0;padding:12px;background-color:#0b1220;border:1px solid #1e293b;border-radius:10px;color:#e2e8f0;white-space:pre-line;">${escapeHtml(data.message)}</p>
  `);
}

export function acknowledgmentHtml(data: ContactSubmission): string {
  return layout(`
    <h2 style="margin:0 0 12px;color:#ffffff;font-size:18px;">Merci ${escapeHtml(data.name)}&nbsp;!</h2>
    <p style="margin:0 0 12px;color:#e2e8f0;">
      Nous avons bien reçu votre message et nous vous en remercions. Notre équipe
      reviendra vers vous dans les plus brefs délais.
    </p>
    <p style="margin:0 0 16px;color:#94a3b8;">Votre demande concernait&nbsp;: <strong style="color:#e2e8f0;">${escapeHtml(data.service || '-')}</strong>.</p>
    <p style="margin:0;color:#64748b;font-size:13px;">
      Si votre demande est urgente, contactez-nous directement au
      <strong style="color:#e2e8f0;">${escapeHtml(process.env.NEXT_PUBLIC_CONTACT_PHONE || '+243820128315')}</strong>.
    </p>
  `);
}

export async function sendContactEmails(data: ContactSubmission): Promise<{ notified: boolean; ack: boolean }> {
  const transport = getTransporter();
  if (!transport) {
    console.warn('[mail] SMTP not configured, skipping emails');
    return { notified: false, ack: false };
  }

  const notifyTo = getNotifyTo();
  const from = getFrom();

  const results = { notified: false, ack: false };

  try {
    if (notifyTo) {
      await transport.sendMail({
        from,
        to: notifyTo,
        subject: `Nouveau message de ${data.name} (${data.service || 'contact'})`,
        html: adminNotificationHtml(data),
      });
      results.notified = true;
    }
  } catch (err) {
    console.error('[mail] failed to send admin notification:', err);
  }

  try {
    await transport.sendMail({
      from,
      to: data.email,
      subject: 'Nous avons bien reçu votre message — Viking Solar',
      html: acknowledgmentHtml(data),
    });
    results.ack = true;
  } catch (err) {
    console.error('[mail] failed to send acknowledgment:', err);
  }

  return results;
}
