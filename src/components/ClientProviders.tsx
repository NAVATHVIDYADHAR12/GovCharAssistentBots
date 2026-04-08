'use client';

import { ReactNode } from 'react';
import { ToastProvider } from '@/components/ui/Toast';
import ScrollToTop from '@/components/ui/ScrollToTop';
import SiteChatbot from '@/components/ui/SiteChatbot';

export default function ClientProviders({ children }: { children: ReactNode }) {
  return (
    <ToastProvider>
      {children}
      <ScrollToTop />
      <SiteChatbot />
    </ToastProvider>
  );
}
