'use client';

import React from 'react';

// Very simple AppProvider
export function AppProvider({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
    </>
  );
}
