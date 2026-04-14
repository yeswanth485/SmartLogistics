'use client';
import React, { useState } from 'react';
import { 
  Globe, 
  Cpu,
  Save
} from 'lucide-react';
// import { motion } from 'framer-motion';

export default function SettingsPage() {
  const [apiUrl, setApiUrl] = useState(process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000');
  const [notifications, setNotifications] = useState(true);

  const handleSave = () => {
    alert("Settings saved successfully to system config.");
  };

  return (
    <div className="animate-fade-in" style={{ width: '100%', maxWidth: '800px' }}>
      <header style={{ marginBottom: '2.5rem' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 800, letterSpacing: '-0.03em' }}>
          System <span style={{ color: 'var(--accent-blue)' }}>Preferences</span>
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>Configure Terybi AI engine and personal account settings.</p>
      </header>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        
        {/* API & Engine Settings */}
        <section className="card" style={{ padding: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
            <Cpu size={20} color="var(--accent-blue)" />
            <h3 style={{ margin: 0 }}>Engine Configuration</h3>
          </div>
          
          <div className="form-group">
            <label className="form-label">Backend API Endpoint</label>
            <input 
              type="text" 
              className="form-input" 
              value={apiUrl} 
              onChange={e => setApiUrl(e.target.value)}
              placeholder="https://api.terybi.ai" 
            />
            <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
              The primary URL for optimization and analytics services.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginTop: '1.5rem' }}>
            <div className="form-group">
              <label className="form-label">Default Optimizer</label>
              <select className="form-input" style={{ width: '100%' }}>
                <option>Genetic Algorithm v3.0</option>
                <option>Heuristic FFD (Fast)</option>
                <option>Hybrid Transformer (Beta)</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Search Depth</label>
              <select className="form-input" style={{ width: '100%' }}>
                <option>Deep (Recommended)</option>
                <option>Standard</option>
                <option>Quick</option>
              </select>
            </div>
          </div>
        </section>

        {/* Interface Settings */}
        <section className="card" style={{ padding: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
            <Globe size={20} color="var(--accent-blue)" />
            <h3 style={{ margin: 0 }}>Interface & Regional</h3>
          </div>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <div>
              <p style={{ fontWeight: 600, margin: 0 }}>Real-time Notifications</p>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: 0 }}>Alert when optimization results are ready.</p>
            </div>
            <input 
              type="checkbox" 
              checked={notifications} 
              onChange={e => setNotifications(e.target.checked)}
              style={{ width: '20px', height: '20px', accentColor: 'var(--accent-blue)' }} 
            />
          </div>

          <div className="form-group">
            <label className="form-label">Measuring Unit System</label>
            <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem' }}>
                <input type="radio" name="units" defaultChecked style={{ accentColor: 'var(--accent-blue)' }} /> Metric (cm/kg)
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.9rem' }}>
                <input type="radio" name="units" style={{ accentColor: 'var(--accent-blue)' }} /> Imperial (in/lb)
              </label>
            </div>
          </div>
        </section>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1rem' }}>
          <button style={{ background: 'transparent', border: '1px solid var(--border-color)', color: 'var(--text-primary)', padding: '0.75rem 1.5rem', borderRadius: '8px', cursor: 'pointer' }}>
            Reset Defaults
          </button>
          <button className="btn-primary" onClick={handleSave}>
            <Save size={18} /> Save Settings
          </button>
        </div>
      </div>
    </div>
  );
}
