'use client';

import { useState, useCallback } from 'react';
import { toast } from 'sonner';

interface UseFormSubmitOptions {
  onSuccess?: () => void;
  successMessage?: string;
}

export function useFormSubmit(url: string, options?: UseFormSubmitOptions) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = useCallback(
    async (data: Record<string, unknown>) => {
      setIsLoading(true);
      setError(null);
      try {
        const res = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        });
        const json = await res.json();
        if (!res.ok) throw new Error(json.error || 'Une erreur est survenue');
        toast.success(options?.successMessage || 'Envoyé avec succès !');
        options?.onSuccess?.();
      } catch (err) {
        const msg = err instanceof Error ? err.message : 'Erreur inconnue';
        setError(msg);
        toast.error(msg);
      } finally {
        setIsLoading(false);
      }
    },
    [url, options],
  );

  return { submit, isLoading, error };
}
