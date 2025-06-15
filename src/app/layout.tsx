// app/layout.tsx
import './globals.css';
import type { Metadata } from 'next';
import { ReduxProvider } from '../store/provider';
export const metadata: Metadata = {
  title: 'Next.js Todo App (TS)',
  description: 'A collaborative todo list built with Next.js and Firebase.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body cz-shortcut-listen="true">
        <ReduxProvider>
          {children}
        </ReduxProvider>
      </body>
    </html>
  );
}