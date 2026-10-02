'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import {
  ArrowLeft,
  CheckCircle2,
  Inbox,
  Loader2,
  Mail,
  MailOpen,
  RefreshCw,
  Reply,
  Send,
  Trash2,
  TriangleAlert,
  X,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { announceUnreadChange } from '@/lib/admin-events';

type MessageStatus = 'new' | 'read' | 'replied' | 'archived';

interface QuoteMessage {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  service: string | null;
  subject: string | null;
  message: string;
  status: MessageStatus;
  created_at: string;
  replied_at: string | null;
  replied_message: string | null;
  replied_by: string | null;
}

type Filter = 'all' | 'new' | 'replied';

const REFRESH_INTERVAL_MS = 15_000;

export default function AdminMessagesPage() {
  const { t, i18n } = useTranslation();

  const [messages, setMessages] = useState<QuoteMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<Filter>('all');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [replying, setReplying] = useState(false);
  const [replyBody, setReplyBody] = useState('');
  const [sending, setSending] = useState(false);
  const [replyError, setReplyError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  const replyFieldRef = useRef<HTMLTextAreaElement>(null);
  // Message deja marque lu automatiquement : empeche l'effet de se rejouer et de
  // contrer un « marquer comme non lu » choisi par l'administrateur.
  const autoReadRef = useRef<string | null>(null);

  const locale = i18n.language?.startsWith('en') ? 'en-US' : 'fr-FR';

  const formatDate = useCallback(
    (iso: string) =>
      new Intl.DateTimeFormat(locale, {
        dateStyle: 'medium',
        timeStyle: 'short',
      }).format(new Date(iso)),
    [locale],
  );

  const serviceLabel = useCallback(
    (key: string | null) => (key ? t(`contact.form.serviceOptions.${key}`) : '—'),
    [t],
  );

  const load = useCallback(async () => {
    try {
      const res = await fetch('/api/admin/messages', { cache: 'no-store' });
      if (!res.ok) throw new Error(t('admin.messages.loadError'));
      const json = (await res.json()) as { data: QuoteMessage[] };
      setMessages(json.data ?? []);
      setError(null);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }, [t]);

  useEffect(() => {
    load();
  }, [load]);

  // Rafraichissement automatique : un devis envoye doit apparaitre sans recharger
  // la page, et le compteur de non-lus doit rester juste sur le tableau de bord.
  useEffect(() => {
    const tick = () => {
      if (document.visibilityState === 'visible') load();
    };
    const interval = setInterval(tick, REFRESH_INTERVAL_MS);
    window.addEventListener('focus', tick);
    return () => {
      clearInterval(interval);
      window.removeEventListener('focus', tick);
    };
  }, [load]);

  // Un message reste « non lu » tant que l'administrateur ne l'a pas consulte.
  useEffect(() => {
    if (!selectedId) {
      autoReadRef.current = null;
      return;
    }
    // La reference est posee des l'ouverture, pas seulement quand le message
    // etait non lu : sinon un « marquer comme non lu » declenche ce meme effet
    // et serait immediatement annule.
    if (autoReadRef.current === selectedId) return;
    autoReadRef.current = selectedId;

    const target = messages.find((m) => m.id === selectedId);
    if (!target || target.status !== 'new') return;

    setMessages((prev) =>
      prev.map((m) => (m.id === selectedId ? { ...m, status: 'read' } : m)),
    );

    fetch(`/api/admin/messages/${selectedId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'read' }),
    })
      .then((res) => (res.ok ? announceUnreadChange() : load()))
      .catch(() => load());
  }, [selectedId, messages, load]);

  const selected = messages.find((m) => m.id === selectedId) ?? null;
  const unreadCount = messages.filter((m) => m.status === 'new').length;

  const visible = messages.filter((m) => {
    if (filter === 'new') return m.status === 'new';
    if (filter === 'replied') return m.status === 'replied';
    return true;
  });

  const setStatus = async (id: string, status: MessageStatus) => {
    const previous = messages;
    setMessages((prev) => prev.map((m) => (m.id === id ? { ...m, status } : m)));
    try {
      const res = await fetch(`/api/admin/messages/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error(t('admin.messages.loadError'));
      announceUnreadChange();
      setNotice(t('admin.messages.statusUpdated'));
    } catch {
      setMessages(previous);
    } finally {
      setTimeout(() => setNotice(null), 3000);
    }
  };

  const remove = async (id: string) => {
    if (!window.confirm(t('admin.messages.deleteConfirm'))) return;
    try {
      const res = await fetch(`/api/admin/messages/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error(t('admin.messages.loadError'));
      if (selectedId === id) setSelectedId(null);
      announceUnreadChange();
      load();
    } catch (err) {
      setError((err as Error).message);
    }
  };

  const openReply = () => {
    setReplyError(null);
    setReplying(true);
    // Le champ doit recevoir le focus une fois la fenetre rendue.
    window.setTimeout(() => replyFieldRef.current?.focus(), 0);
  };

  const submitReply = async () => {
    if (!selected || !replyBody.trim()) return;
    setSending(true);
    setReplyError(null);
    try {
      const res = await fetch(`/api/admin/messages/${selected.id}/reply`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ body: replyBody }),
      });
      const json = await res.json();

      if (!res.ok || !json.delivered) {
        // Le texte reste dans la fenetre pour etre renvoye apres correction.
        setReplyError(json.error || t('admin.messages.replyFailed'));
        return;
      }

      setMessages((prev) =>
        prev.map((m) =>
          m.id === selected.id
            ? {
                ...m,
                status: 'replied',
                replied_at: json.data.replied_at,
                replied_message: json.data.replied_message,
                replied_by: json.data.replied_by,
              }
            : m,
        ),
      );
      setReplyBody('');
      setReplying(false);
      announceUnreadChange();
      setNotice(t('admin.messages.replySent'));
      setTimeout(() => setNotice(null), 4000);
    } catch (err) {
      setReplyError((err as Error).message);
    } finally {
      setSending(false);
    }
  };

  // ── Rendu : detail d'un message ────────────────────────────────────────────
  if (selected) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between gap-3">
          <button
            onClick={() => setSelectedId(null)}
            className="inline-flex items-center gap-2 rounded-xl border border-white/6 px-3 py-2 text-sm text-gray-300 transition-colors hover:bg-white/5 hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden />
            {t('admin.messages.back')}
          </button>
          <StatusBadge status={selected.status} t={t} />
        </div>

        <article className="rounded-2xl border border-white/6 bg-bg-card p-5 shadow-card sm:p-6">
          <header className="border-b border-white/6 pb-4">
            <h2 className="text-lg font-semibold text-white sm:text-xl">
              {selected.subject || t('admin.messages.noSubject')}
            </h2>
            <p className="mt-1 text-sm text-gray-400">
              {formatDate(selected.created_at)}
            </p>
          </header>

          <dl className="grid gap-4 border-b border-white/6 py-5 sm:grid-cols-2">
            <Field label={t('admin.messages.name')} value={selected.name} />
            <Field
              label={t('admin.messages.subject')}
              value={selected.subject || t('admin.messages.noSubject')}
            />
            <Field
              label={t('admin.messages.service')}
              value={serviceLabel(selected.service)}
            />
            <Field
              label={t('admin.messages.email')}
              value={selected.email}
              href={`mailto:${selected.email}`}
            />
            <Field
              label={t('admin.messages.phone')}
              value={selected.phone || '—'}
              href={selected.phone ? `tel:${selected.phone.replace(/[^\d+]/g, '')}` : undefined}
            />
          </dl>

          <div className="py-5">
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.12em] text-gray-500">
              {t('admin.messages.message')}
            </p>
            <p className="whitespace-pre-line text-sm leading-relaxed text-gray-200">
              {selected.message}
            </p>
          </div>

          {selected.replied_message && (
            <section className="rounded-xl border border-green/25 bg-green/5 p-4">
              <p className="mb-2 text-xs font-semibold uppercase tracking-[0.12em] text-green">
                {t('admin.messages.replyHistory')}
              </p>
              <p className="whitespace-pre-line text-sm leading-relaxed text-gray-200">
                {selected.replied_message}
              </p>
              <p className="mt-3 text-xs text-gray-500">
                {selected.replied_at ? formatDate(selected.replied_at) : ''}
                {selected.replied_by ? ` — ${selected.replied_by}` : ''}
              </p>
            </section>
          )}

          <footer className="mt-5 flex flex-wrap gap-2 border-t border-white/6 pt-5">
            <button
              onClick={openReply}
              className="inline-flex items-center gap-2 rounded-xl bg-green px-4 py-2.5 text-sm font-semibold text-bg-primary transition-colors hover:bg-green-dark"
            >
              <Reply className="h-4 w-4" aria-hidden />
              {t('admin.messages.reply')}
            </button>
            <button
              onClick={() =>
                setStatus(selected.id, selected.status === 'new' ? 'read' : 'new')
              }
              className="inline-flex items-center gap-2 rounded-xl border border-white/10 px-4 py-2.5 text-sm text-gray-300 transition-colors hover:bg-white/5 hover:text-white"
            >
              {selected.status === 'new' ? (
                <>
                  <MailOpen className="h-4 w-4" aria-hidden />
                  {t('admin.messages.markAsRead')}
                </>
              ) : (
                <>
                  <Mail className="h-4 w-4" aria-hidden />
                  {t('admin.messages.markAsUnread')}
                </>
              )}
            </button>
            <button
              onClick={() => remove(selected.id)}
              className="inline-flex items-center gap-2 rounded-xl border border-accent-red/30 px-4 py-2.5 text-sm text-accent-red transition-colors hover:bg-accent-red/10"
            >
              <Trash2 className="h-4 w-4" aria-hidden />
              {t('admin.messages.delete')}
            </button>
          </footer>
        </article>

        {replying && (
          <ReplyDialog
            body={replyBody}
            onChange={setReplyBody}
            onCancel={() => setReplying(false)}
            onSend={submitReply}
            sending={sending}
            error={replyError}
            clientName={selected.name}
            clientEmail={selected.email}
            t={t}
            fieldRef={replyFieldRef}
          />
        )}
      </div>
    );
  }

  // ── Rendu : liste ─────────────────────────────────────────────────────────
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <h1 className="text-xl font-bold text-white sm:text-2xl">
            {t('admin.messages.inbox')}
          </h1>
          {unreadCount > 0 && (
            <span className="rounded-full bg-green/15 px-2.5 py-1 text-xs font-semibold text-green">
              {t('admin.messages.unreadCount', { count: unreadCount })}
            </span>
          )}
        </div>
        <button
          onClick={load}
          className="inline-flex items-center gap-2 rounded-xl border border-white/6 px-3 py-2 text-sm text-gray-300 transition-colors hover:bg-white/5 hover:text-white"
        >
          <RefreshCw className="h-4 w-4" aria-hidden />
          {t('admin.messages.refresh')}
        </button>
      </div>

      <div className="flex gap-2" role="group" aria-label={t('admin.messages.filterLabel')}>
        {(['all', 'new', 'replied'] as Filter[]).map((key) => (
          <button
            key={key}
            onClick={() => setFilter(key)}
            aria-pressed={filter === key}
            className={`rounded-xl px-3.5 py-2 text-sm font-medium transition-colors ${
              filter === key
                ? 'bg-green/15 text-green'
                : 'bg-white/3 text-gray-400 hover:text-white'
            }`}
          >
            {t(`admin.messages.filter.${key}`)}
          </button>
        ))}
      </div>

      {notice && (
        <p
          role="status"
          className="flex items-center gap-2 rounded-xl border border-green/30 bg-green/10 px-4 py-2.5 text-sm text-green"
        >
          <CheckCircle2 className="h-4 w-4 shrink-0" aria-hidden />
          {notice}
        </p>
      )}

      {error && (
        <p
          role="alert"
          className="flex items-center gap-2 rounded-xl border border-accent-red/30 bg-accent-red/10 px-4 py-2.5 text-sm text-accent-red"
        >
          <TriangleAlert className="h-4 w-4 shrink-0" aria-hidden />
          {error}
        </p>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="h-7 w-7 animate-spin text-green" aria-hidden />
        </div>
      ) : visible.length === 0 ? (
        <div className="flex flex-col items-center gap-3 rounded-2xl border border-dashed border-white/10 bg-bg-card/40 px-6 py-16 text-center">
          <Inbox className="h-9 w-9 text-gray-600" aria-hidden />
          <p className="text-sm font-medium text-gray-300">{t('admin.messages.empty')}</p>
          <p className="max-w-sm text-xs text-gray-500">{t('admin.messages.emptyHint')}</p>
        </div>
      ) : (
        <ul className="space-y-2">
          {visible.map((message) => {
            const isUnread = message.status === 'new';
            return (
              <li key={message.id}>
                <button
                  onClick={() => setSelectedId(message.id)}
                  className={`w-full rounded-2xl border bg-bg-card p-4 text-left shadow-card transition-colors hover:border-green/30 ${
                    isUnread ? 'border-green/30' : 'border-white/6'
                  }`}
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p
                        className={`truncate text-sm ${
                          isUnread ? 'font-bold text-white' : 'font-medium text-gray-300'
                        }`}
                      >
                        {message.name}
                      </p>
                      <p className="truncate text-sm text-gray-400">
                        {message.subject || t('admin.messages.noSubject')}
                      </p>
                    </div>
                    <div className="flex shrink-0 items-center gap-3">
                      <StatusBadge status={message.status} t={t} />
                      <time
                        dateTime={message.created_at}
                        className="whitespace-nowrap text-xs text-gray-500"
                      >
                        {formatDate(message.created_at)}
                      </time>
                    </div>
                  </div>
                  <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-gray-500">
                    {message.message}
                  </p>
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

// ── Sous-composants ─────────────────────────────────────────────────────────

type TFn = (key: string, options?: Record<string, unknown>) => string;

const STATUS_STYLES: Record<MessageStatus, string> = {
  new: 'bg-green/15 text-green',
  read: 'bg-white/6 text-gray-400',
  replied: 'bg-accent-blue/15 text-accent-blue',
  archived: 'bg-white/6 text-gray-600',
};

const STATUS_ICONS: Record<MessageStatus, typeof Mail> = {
  new: Mail,
  read: MailOpen,
  replied: Reply,
  archived: MailOpen,
};

function StatusBadge({ status, t }: { status: MessageStatus; t: TFn }) {
  const Icon = STATUS_ICONS[status];
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium ${STATUS_STYLES[status]}`}
    >
      <Icon className="h-3 w-3" aria-hidden />
      {t(`admin.messages.status.${status}`)}
    </span>
  );
}

function Field({ label, value, href }: { label: string; value: string; href?: string }) {
  return (
    <div>
      <dt className="text-xs font-semibold uppercase tracking-[0.12em] text-gray-500">
        {label}
      </dt>
      <dd className="mt-1 text-sm text-gray-200">
        {href ? (
          <a href={href} className="text-green hover:underline">
            {value}
          </a>
        ) : (
          value
        )}
      </dd>
    </div>
  );
}

interface ReplyDialogProps {
  body: string;
  onChange: (value: string) => void;
  onCancel: () => void;
  onSend: () => void;
  sending: boolean;
  error: string | null;
  clientName: string;
  clientEmail: string;
  t: TFn;
  fieldRef: React.RefObject<HTMLTextAreaElement | null>;
}

function ReplyDialog({
  body,
  onChange,
  onCancel,
  onSend,
  sending,
  error,
  clientName,
  clientEmail,
  t,
  fieldRef,
}: ReplyDialogProps) {
  // Echap ferme la fenetre, sauf pendant l'envoi.
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && !sending) onCancel();
    };
    document.addEventListener('keydown', onKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [sending, onCancel]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="reply-dialog-title"
        className="flex max-h-[90vh] w-full max-w-2xl flex-col rounded-2xl border border-white/10 bg-bg-card shadow-2xl"
      >
        <header className="flex items-start justify-between gap-4 border-b border-white/6 p-5">
          <div className="min-w-0">
            <h2 id="reply-dialog-title" className="text-base font-semibold text-white">
              {t('admin.messages.replyTitle')}
            </h2>
            <p className="mt-1 truncate text-xs text-gray-400">
              {t('admin.messages.replyTo', { name: clientName, email: clientEmail })}
            </p>
          </div>
          <button
            onClick={onCancel}
            disabled={sending}
            className="rounded-lg p-1.5 text-gray-500 transition-colors hover:bg-white/5 hover:text-white disabled:opacity-40"
            aria-label={t('admin.messages.cancel')}
          >
            <X className="h-5 w-5" aria-hidden />
          </button>
        </header>

        <div className="flex-1 overflow-y-auto p-5">
          <label
            htmlFor="reply-body"
            className="mb-2 block text-sm font-medium text-gray-300"
          >
            {t('admin.messages.replyBody')}
          </label>
          <textarea
            id="reply-body"
            ref={fieldRef}
            value={body}
            onChange={(e) => onChange(e.target.value)}
            rows={10}
            placeholder={t('admin.messages.replyPlaceholder')}
            className="w-full resize-y rounded-xl border border-white/10 bg-bg-primary/60 p-3.5 text-sm text-gray-100 placeholder:text-gray-500 transition-colors focus:border-green focus:outline-none"
          />

          {error && (
            <p
              role="alert"
              className="mt-3 flex items-start gap-2 rounded-xl border border-accent-red/30 bg-accent-red/10 px-3.5 py-2.5 text-xs leading-relaxed text-accent-red"
            >
              <TriangleAlert className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
              <span>{error}</span>
            </p>
          )}
        </div>

        <footer className="flex justify-end gap-2 border-t border-white/6 p-5">
          <button
            onClick={onCancel}
            disabled={sending}
            className="rounded-xl border border-white/10 px-4 py-2.5 text-sm text-gray-300 transition-colors hover:bg-white/5 hover:text-white disabled:opacity-40"
          >
            {t('admin.messages.cancel')}
          </button>
          <button
            onClick={onSend}
            disabled={sending || !body.trim()}
            className="inline-flex items-center gap-2 rounded-xl bg-green px-4 py-2.5 text-sm font-semibold text-bg-primary transition-colors hover:bg-green-dark disabled:cursor-not-allowed disabled:opacity-50"
          >
            {sending ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
                {t('admin.messages.sendingReply')}
              </>
            ) : (
              <>
                <Send className="h-4 w-4" aria-hidden />
                {t('admin.messages.sendReply')}
              </>
            )}
          </button>
        </footer>
      </div>
    </div>
  );
}
