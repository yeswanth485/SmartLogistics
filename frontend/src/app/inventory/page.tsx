'use client';
import React, { useEffect, useState } from 'react';
import { 
  Box as BoxIcon, 
  Plus, 
  Scale, 
  Maximize, 
  DollarSign, 
  Package,
  Layers,
  ChevronRight
} from 'lucide-react';
import { motion } from 'framer-motion';

interface BoxCatalog {
  id: string;
  name: string;
  length: number;
  width: number;
  height: number;
  max_weight: number;
  base_cost: number;
}

export default function InventoryPage() {
  const [boxes, setBoxes] = useState<BoxCatalog[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [newBox, setNewBox] = useState({
    name: '', length: 0, width: 0, height: 0, max_weight: 0, base_cost: 0
  });

  const fetchBoxes = async () => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
      const res = await fetch(`${apiUrl}/api/inventory/boxes`);
      const data = await res.json();
      setBoxes(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBoxes();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
      await fetch(`${apiUrl}/api/inventory/boxes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newBox)
      });
      setNewBox({ name: '', length: 0, width: 0, height: 0, max_weight: 0, base_cost: 0 });
      fetchBoxes();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="animate-fade-in" style={{ width: '100%', paddingBottom: '4rem' }}>
      <header style={{ marginBottom: '2.5rem' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 800, letterSpacing: '-0.03em' }}>
          Box <span style={{ color: 'var(--accent-blue)' }}>Inventory</span>
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>Manage carton specifications and stock availability benchmarks.</p>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 350px', gap: '2rem', alignItems: 'flex-start' }}>
        
        {/* Main Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
          {loading ? (
            Array(4).fill(0).map((_, i) => <div key={i} className="card loader" style={{ height: '200px' }}></div>)
          ) : boxes.map(box => (
            <motion.div 
              layout
              key={box.id} 
              className="card" 
              style={{ padding: '1.5rem', border: '1px solid var(--border-color)', position: 'relative' }}
              whileHover={{ scale: 1.02 }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                <div style={{ background: 'rgba(59, 130, 246, 0.1)', padding: '0.5rem', borderRadius: '8px' }}>
                  <BoxIcon size={20} color="var(--accent-blue)" />
                </div>
                <div style={{ fontSize: '0.7rem', color: '#10b981', background: 'rgba(16, 185, 129, 0.1)', padding: '0.2rem 0.5rem', borderRadius: '4px', fontWeight: 700 }}>AVAILABLE</div>
              </div>
              
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.5rem' }}>{box.name}</h3>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '1rem' }}>
                <InfoItem icon={<Maximize size={14} />} label="Dimensions" value={`${box.length}x${box.width}x${box.height} cm`} />
                <InfoItem icon={<Scale size={14} />} label="Max Payload" value={`${box.max_weight} kg`} />
                <InfoItem icon={<DollarSign size={14} />} label="Base Cost" value={`$${box.base_cost.toFixed(2)}`} highlight />
              </div>
              
              <div style={{ marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid var(--border-color)', display: 'flex', justifyContent: 'flex-end' }}>
                <button style={{ background: 'transparent', border: 'none', color: 'var(--accent-blue)', fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                  Edit Details <ChevronRight size={14} />
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Form Panel */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div className="card" style={{ padding: '2rem', background: 'var(--secondary-bg)', border: '1px solid var(--accent-blue)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
              <Layers size={20} color="var(--accent-blue)" />
              <h3 style={{ margin: 0 }}>Register Carton</h3>
            </div>
            
            <form onSubmit={handleCreate} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div className="form-group">
                <label className="form-label">Template name</label>
                <input type="text" className="form-input" placeholder="e.g. Medium Standard" value={newBox.name} onChange={e => setNewBox({...newBox, name: e.target.value})} required />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.75rem' }}>
                <div className="form-group">
                  <label className="form-label">L (cm)</label>
                  <input type="number" className="form-input" value={newBox.length || ''} onChange={e => setNewBox({...newBox, length: parseFloat(e.target.value)})} required />
                </div>
                <div className="form-group">
                  <label className="form-label">W (cm)</label>
                  <input type="number" className="form-input" value={newBox.width || ''} onChange={e => setNewBox({...newBox, width: parseFloat(e.target.value)})} required />
                </div>
                <div className="form-group">
                  <label className="form-label">H (cm)</label>
                  <input type="number" className="form-input" value={newBox.height || ''} onChange={e => setNewBox({...newBox, height: parseFloat(e.target.value)})} required />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Max Capacity (kg)</label>
                <input type="number" className="form-input" value={newBox.max_weight || ''} onChange={e => setNewBox({...newBox, max_weight: parseFloat(e.target.value)})} required />
              </div>

              <div className="form-group">
                <label className="form-label">Base Cost ($)</label>
                <input type="number" className="form-input" step="0.01" value={newBox.base_cost || ''} onChange={e => setNewBox({...newBox, base_cost: parseFloat(e.target.value)})} required />
              </div>

              <button type="submit" className="btn-primary" style={{ width: '100%', marginTop: '0.5rem' }}>
                <Plus size={18} /> Add to Catalog
              </button>
            </form>
          </div>

          <div className="card" style={{ padding: '1.5rem', textAlign: 'center' }}>
            <Package size={32} style={{ opacity: 0.1, marginBottom: '1rem' }} />
            <h4 style={{ margin: 0 }}>Total Templates: {boxes.length}</h4>
          </div>
        </div>

      </div>
    </div>
  );
}

function InfoItem({ icon, label, value, highlight }: { icon: React.ReactNode, label: string, value: string, highlight?: boolean }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
        {icon}
        <span>{label}:</span>
      </div>
      <span style={{ fontWeight: 600, fontSize: '0.9rem', color: highlight ? 'var(--success)' : 'var(--text-primary)' }}>{value}</span>
    </div>
  );
}
