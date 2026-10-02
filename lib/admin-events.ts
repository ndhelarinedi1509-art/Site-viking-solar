/**
 * Evenement interne du back-office : « le nombre de messages non lus a change ».
 *
 * La boite de reception et la barre laterale vivent dans deux arbres React
 * distincts (page et layout). Plutot que de recopier les donnees ou de
 * lever un contexte, la page signale le changement et le layout recalcule son
 * badge : une seule source de verite, la base.
 */
export const UNREAD_CHANGED_EVENT = 'admin:unread-changed';

export function announceUnreadChange() {
  if (typeof window === 'undefined') return;
  window.dispatchEvent(new Event(UNREAD_CHANGED_EVENT));
}
