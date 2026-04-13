'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="sidebar">
      <div className="sidebar-title">Nexus Logistics</div>
      
      <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        <Link 
          href="/optimization" 
          className={`nav-item ${pathname === '/optimization' ? 'active' : ''}`}
        >
          📦 Packing Engine
        </Link>
        <Link 
          href="/inventory" 
          className={`nav-item ${pathname === '/inventory' ? 'active' : ''}`}
        >
          🗄️ Box Inventory
        </Link>
        <Link 
          href="/tasks" 
          className={`nav-item ${pathname === '/tasks' ? 'active' : ''}`}
        >
          📋 Priority Works
        </Link>
      </nav>
      
      <div style={{ marginTop: 'auto', paddingTop: '2rem', borderTop: '1px solid var(--border-color)', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
        System v2.0 - Active
      </div>
    </aside>
  );
}
