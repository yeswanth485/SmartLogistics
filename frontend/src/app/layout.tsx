import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Terybi AI - Logistics Intelligence',
  description: 'AI-powered packaging and cartonization engine for precision manufacturing and ecommerce',
};

import Sidebar from '@/components/Sidebar';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <div className="layout-container">
          <Sidebar />
          <main className="main-content">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
