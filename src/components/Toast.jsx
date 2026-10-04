import React from 'react';
import { usePg } from '../context/PgContext';

export default function Toast() {
  const { toast } = usePg();

  if (!toast) return null;

  return (
    <div className={`toast-notification toast-${toast.type || 'success'}`}>
      <span className="toast-icon" aria-hidden="true">
        {toast.type === 'error' ? '!' : toast.type === 'info' ? 'i' : '✓'}
      </span>
      <span className="toast-message">{toast.message}</span>
    </div>
  );
}
