'use client';
import React, { useEffect, useState } from 'react';

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
    <div className="animate-fade-in" style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <header>
        <h2>🗄️ Box Inventory Catalog</h2>
        <p>Manage the carton sizes and packaging materials available in your warehouse.</p>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '1.5rem' }}>
        {loading ? (
          <div className="card">Loading...</div>
        ) : boxes.map(box => (
          <div key={box.id} className="card">
            <h3 style={{ marginBottom: '1rem', color: 'var(--accent-color)' }}>{box.name}</h3>
            <p className="form-label">Dimensions</p>
            <div style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '0.5rem' }}>
              {box.length}x{box.width}x{box.height} cm
            </div>
            <p className="form-label">Max Weight: <span style={{ color: 'var(--text-primary)' }}>{box.max_weight} kg</span></p>
            <p className="form-label">Base Cost: <span style={{ color: 'var(--success)' }}>${box.base_cost.toFixed(2)}</span></p>
          </div>
        ))}
      </div>

      <div className="card" style={{ marginTop: '2rem' }}>
        <h3>Add New Box Template</h3>
        <form onSubmit={handleCreate} style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', marginTop: '1rem' }}>
           <input type="text" className="form-input" placeholder="Box Name" value={newBox.name} onChange={e => setNewBox({...newBox, name: e.target.value})} required />
           <input type="number" className="form-input" placeholder="Length (cm)" value={newBox.length || ''} onChange={e => setNewBox({...newBox, length: parseFloat(e.target.value)})} required />
           <input type="number" className="form-input" placeholder="Width (cm)" value={newBox.width || ''} onChange={e => setNewBox({...newBox, width: parseFloat(e.target.value)})} required />
           <input type="number" className="form-input" placeholder="Height (cm)" value={newBox.height || ''} onChange={e => setNewBox({...newBox, height: parseFloat(e.target.value)})} required />
           <input type="number" className="form-input" placeholder="Max Weight (kg)" value={newBox.max_weight || ''} onChange={e => setNewBox({...newBox, max_weight: parseFloat(e.target.value)})} required />
           <input type="number" className="form-input" placeholder="Base Cost ($)" value={newBox.base_cost || ''} onChange={e => setNewBox({...newBox, base_cost: parseFloat(e.target.value)})} required />
           <button type="submit" className="btn-primary">Save Box</button>
        </form>
      </div>
    </div>
  );
}
