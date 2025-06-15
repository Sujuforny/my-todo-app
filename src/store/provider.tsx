'use client';

import { Provider } from 'react-redux';
import { store } from './index';
import React from 'react';

interface ReduxProviderProps {
  children: React.ReactNode;
}

export function ReduxProvider({ children }: ReduxProviderProps) {
  return <Provider store={store}>{children}</Provider>;
}