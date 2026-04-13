import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Smart Logistics Optimization',
  description: 'AI-powered packaging and cartonization engine',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <main className="layout-container">
          <header style={{ marginBottom: '2rem', textAlign: 'center' }} className="animate-fade-in">
            <h1>Nexus Packing AI</h1>
            <p>Smart Spatial & Cost Logistics Optimization</p>
          </header>
          {children}
        </main>
      </body>
    </html>
  );
}
