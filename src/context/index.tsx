import React from 'react';
import { ToastProvider } from './ToastContext';

interface Props {
  children: React.ReactNode;
}

const ContextProviders: React.FC<Props> = ({ children }) => {
  return <ToastProvider>{children}</ToastProvider>;
};

export default ContextProviders;
