"use client";

import { useEffect } from "react";

function safeSetItem(key: string, value: string) {
  try {
    localStorage.setItem(key, value);
  } catch (e) {
    // ignore
  }
}

export default function ErrorLogger() {
  useEffect(() => {
    function handleError(event: ErrorEvent) {
      const payload = {
        type: 'error',
        message: event.message,
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
        stack: event.error?.stack,
        userAgent: navigator.userAgent,
        time: new Date().toISOString(),
      };
      safeSetItem('viking-last-error', JSON.stringify(payload));
      try {
        fetch('/api/client-error', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
          keepalive: true,
        }).catch(() => {});
      } catch (e) {
        // ignore
      }
    }

    function handleRejection(event: PromiseRejectionEvent) {
      const reason = event.reason;
      const payload = {
        type: 'unhandledrejection',
        message: reason?.message || String(reason),
        stack: reason?.stack,
        userAgent: navigator.userAgent,
        time: new Date().toISOString(),
      };
      safeSetItem('viking-last-error', JSON.stringify(payload));
      try {
        fetch('/api/client-error', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
          keepalive: true,
        }).catch(() => {});
      } catch (e) {
        // ignore
      }
    }

    window.addEventListener('error', handleError);
    window.addEventListener('unhandledrejection', handleRejection);

    return () => {
      window.removeEventListener('error', handleError);
      window.removeEventListener('unhandledrejection', handleRejection);
    };
  }, []);

  return null;
}
