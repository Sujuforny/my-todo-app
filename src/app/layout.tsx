// app/layout.tsx
import './globals.css';
import type { Metadata } from 'next'; // Important for Next.js 13+ App Router metadata

export const metadata: Metadata = { // Using Metadata type
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
      <body cz-shortcut-listen="true">{children}</body>
    </html>
  );
}