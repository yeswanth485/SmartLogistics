'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  BarChart3, 
  Package, 
  Box as BoxIcon, 
  CheckSquare, 
  Settings, 
  Zap 
} from 'lucide-react';

export default function Sidebar() {
  const pathname = usePathname();

  const navItems = [
    { name: 'Overview', href: '/overview', icon: BarChart3 },
    { name: 'Packing Engine', href: '/optimization', icon: Zap },
    { name: 'Box Inventory', href: '/inventory', icon: BoxIcon },
    { name: 'Priority Works', href: '/tasks', icon: CheckSquare },
    { name: 'Settings', href: '/settings', icon: Settings },
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-title" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <div style={{ backgroundColor: 'var(--accent-blue)', padding: '0.4rem', borderRadius: '8px', boxShadow: '0 0 15px rgba(59, 130, 246, 0.4)' }}>
          <Package size={20} color="#fff" />
        </div>
        <span style={{ fontSize: '1.4rem', letterSpacing: '-0.02em', fontWeight: 800 }}>Terybi<span style={{ color: 'var(--accent-blue)' }}>AI</span></span>
      </div>
      
      <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', marginTop: '1rem' }}>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          return (
            <Link 
              key={item.href}
              href={item.href} 
              className={`nav-item ${isActive ? 'active' : ''}`}
              style={{ padding: '0.75rem 1rem' }}
            >
              <Icon size={18} style={{ opacity: isActive ? 1 : 0.7 }} />
              {item.name}
            </Link>
          );
        })}
      </nav>
      
      <div style={{ marginTop: 'auto', paddingTop: '1.5rem', borderTop: '1px solid var(--border-color)', fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span>System v3.0</span>
        <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#10b981', boxShadow: '0 0 8px #10b981' }}></div>
      </div>
    </aside>
  );
}

