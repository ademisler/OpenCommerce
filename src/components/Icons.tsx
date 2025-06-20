import React from 'react';

export const EditIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    className={className}
  >
    <path d="M12 20h9" />
    <path d="M16.5 3.5l4 4-11 11H5.5v-4.5l11-11z" />
  </svg>
);

export const PlusIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    className={className}
  >
    <path d="M12 5v14M5 12h14" />
  </svg>
);

export const TrashIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    className={className}
  >
    <path d="M3 6h18" />
    <path d="M8 6v12a2 2 0 002 2h4a2 2 0 002-2V6" />
    <path d="M10 11v6M14 11v6" />
    <path d="M5 6l1-1h12l1 1" />
  </svg>
);
