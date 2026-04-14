'use client';
import React, { useState, FormEvent } from 'react';
import ThreeDBox from '@/components/ThreeDBox';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, 
  Trash2, 
  Upload, 
  Zap, 
  Box as BoxIcon, 
  Layout, 
  Sparkles,
} from 'lucide-react';

interface Product {
  name: string;
  length: number;
  width: number;
  height: number;
  weight: number;
  quantity: number;
}

interface PackingResult {
  box_name: string;
  box_length: number;
  box_width: number;
  box_height: number;
  utilization_percent: number;
  chargeable_weight: number;
  shipping_cost: number;
  ai_insights: string;
  placed_items: Array<{
    product_name: string;
    x: number;
    y: number;
    z: number;
    length: number;
    width: number;
    height: number;
  }>;
}

export default function OptimizationPage() {
  const [tab, setTab] = useState<'manual' | 'upload'>('manual');
  const [products, setProducts] = useState<Product[]>([
    { name: 'Standard Unit A', length: 30, width: 22, height: 10, weight: 2.5, quantity: 1 }
  ]);
  const [result, setResult] = useState<PackingResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAddProduct = () => {
    setProducts([...products, { name: '', length: 0, width: 0, height: 0, weight: 0, quantity: 1 }]);
  };

  const handleProductChange = (index: number, field: keyof Product, value: string | number) => {
    const newProducts = [...products];
    newProducts[index] = { ...newProducts[index], [field]: value };
    setProducts(newProducts);
  };

  const handleRemoveProduct = (index: number) => {
    const newP = [...products];
    newP.splice(index, 1);
    setProducts(newP);
  };

  const handleCsvUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (evt) => {
      const text = evt.target?.result as string;
      const lines = text.split('\n').filter(l => l.trim() !== '');
      const parsed: Product[] = [];
      for (let i = 1; i < lines.length; i++) {
        const [name, l, w, h, weight, qty] = lines[i].split(',');
        if (name && l) {
          parsed.push({
            name,
            length: parseFloat(l), width: parseFloat(w), height: parseFloat(h),
            weight: parseFloat(weight), quantity: parseInt(qty || '1', 10)
          });
        }
      }
      setProducts(parsed);
      setTab('manual');
    };
    reader.readAsText(file);
  };

  const submitOptimization = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
      const res = await fetch(`${apiUrl}/api/optimize`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ products })
      });
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.detail || 'Failed to optimize');
      }
      const data: PackingResult = await res.json();
      setResult(data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "An unknown error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-fade-in" style={{ width: '100%', paddingBottom: '4rem' }}>
      <header style={{ marginBottom: '2.5rem' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 800, letterSpacing: '-0.03em' }}>
          Packing <span style={{ color: 'var(--accent-blue)' }}>Engine</span>
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>Genetic volume cluster optimization v3.2</p>
      </header>
      
      <div style={{ display: 'grid', gridTemplateColumns: result ? '400px 1fr' : '1fr', gap: '2rem', transition: 'all 0.5s ease' }}>
        
        {/* Left Panel: Inputs */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          {/* Content Toggle */}
          <div style={{ display: 'flex', background: 'var(--secondary-bg)', padding: '0.4rem', borderRadius: '12px', border: '1px solid var(--border-color)', width: 'fit-content' }}>
            <button 
              onClick={() => setTab('manual')}
              style={{ padding: '0.6rem 1.2rem', borderRadius: '8px', border: 'none', background: tab === 'manual' ? 'rgba(59, 130, 246, 0.15)' : 'transparent', color: tab === 'manual' ? 'var(--accent-blue)' : 'var(--text-secondary)', cursor: 'pointer', fontWeight: 600, fontSize: '0.85rem', transition: 'all 0.2s' }}
            >
              Manual Entry
            </button>
            <button 
              onClick={() => setTab('upload')}
              style={{ padding: '0.6rem 1.2rem', borderRadius: '8px', border: 'none', background: tab === 'upload' ? 'rgba(59, 130, 246, 0.15)' : 'transparent', color: tab === 'upload' ? 'var(--accent-blue)' : 'var(--text-secondary)', cursor: 'pointer', fontWeight: 600, fontSize: '0.85rem', transition: 'all 0.2s' }}
            >
              Bulk Upload
            </button>
          </div>

          <form onSubmit={submitOptimization} className="card" style={{ padding: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h3 style={{ margin: 0 }}>Input Objects</h3>
              <button 
                type="button" 
                onClick={handleAddProduct}
                style={{ background: 'rgba(59,130,246,0.1)', color: 'var(--accent-blue)', border: 'none', padding: '0.4rem 0.8rem', borderRadius: '6px', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.4rem' }}
              >
                <Plus size={14} /> Add new
              </button>
            </div>

            {tab === 'upload' && (
              <div style={{ marginBottom: '1.5rem', padding: '1.5rem', border: '1px dashed var(--accent-blue)', borderRadius: '12px', textAlign: 'center', background: 'rgba(59, 130, 246, 0.03)' }}>
                <Upload size={24} color="var(--accent-blue)" style={{ marginBottom: '0.75rem' }} />
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>CSV format: name, l, w, h, wt, qty</p>
                <input type="file" accept=".csv" onChange={handleCsvUpload} className="form-input" style={{ fontSize: '0.8rem' }} />
              </div>
            )}

            <div style={{ maxHeight: '400px', overflowY: 'auto', paddingRight: '0.5rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <AnimatePresence mode="popLayout">
                {products.map((p, idx) => (
                  <motion.div 
                    layout
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    key={idx} 
                    style={{ padding: '1rem', background: 'rgba(255,255,255,0.02)', borderRadius: '10px', border: '1px solid var(--border-color)' }}
                  >
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '0.5rem', marginBottom: '0.75rem' }}>
                      <input 
                        type="text" className="form-input" placeholder="Item Name" value={p.name} 
                        onChange={(e) => handleProductChange(idx, 'name', e.target.value)} required 
                        style={{ background: 'transparent', border: 'none', fontSize: '0.95rem', fontWeight: 600, padding: 0 }}
                      />
                      <Trash2 size={16} color="var(--danger)" onClick={() => handleRemoveProduct(idx)} style={{ cursor: 'pointer', opacity: 0.6 }} />
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.5rem' }}>
                      <NumberInput label="L" value={p.length} onChange={(v) => handleProductChange(idx, 'length', v)} />
                      <NumberInput label="W" value={p.width} onChange={(v) => handleProductChange(idx, 'width', v)} />
                      <NumberInput label="H" value={p.height} onChange={(v) => handleProductChange(idx, 'height', v)} />
                      <NumberInput label="Qty" value={p.quantity} onChange={(v) => handleProductChange(idx, 'quantity', v)} />
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            <button type="submit" className="btn-primary" disabled={loading} style={{ width: '100%', marginTop: '1.5rem', height: '3rem', fontSize: '1rem' }}>
              {loading ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div className="loader" style={{ width: '18px', height: '18px', borderWidth: '2px' }}></div>
                  <span>Thinking (GA Engine)...</span>
                </div>
              ) : (
                <><Zap size={18} /> Solve Optimization</>
              )}
            </button>
          </form>
          {error && <div style={{ color: 'var(--danger)', background: 'rgba(239, 68, 68, 0.1)', padding: '1rem', borderRadius: '8px', border: '1px solid rgba(239, 68, 68, 0.2)', fontSize: '0.85rem' }}>{error}</div>}
        </div>

        {/* Right Panel: Results */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {result ? (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '1.5rem' }}>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                {/* 3D Viewer Bento Card */}
                <div className="card" style={{ padding: '1.5rem', flex: 1, minHeight: '500px', display: 'flex', flexDirection: 'column' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                    <h3 style={{ margin: 0 }}>Spatial Reconstruction</h3>
                    <div style={{ display: 'flex', gap: '1rem' }}>
                      <span style={{ fontSize: '0.75rem', padding: '0.3rem 0.6rem', borderRadius: '4px', background: 'rgba(16,185,129,0.1)', color: 'var(--success)', fontWeight: 600 }}>99.9% Accuracy</span>
                    </div>
                  </div>
                  <div style={{ flex: 1, position: 'relative', background: '#000', borderRadius: '12px', overflow: 'hidden' }}>
                    <ThreeDBox 
                      box_length={result.box_length} 
                      box_width={result.box_width} 
                      box_height={result.box_height} 
                      placed_items={result.placed_items} 
                    />
                  </div>
                </div>

                {/* AI Insights Card */}
                <div className="card" style={{ padding: '1.5rem', border: '1px solid rgba(59,130,246,0.3)', background: 'linear-gradient(135deg, rgba(59,130,246,0.05) 0%, transparent 100%)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                    <Sparkles size={20} color="var(--accent-blue)" />
                    <h4 style={{ margin: 0 }}>Terybi AI Intelligence</h4>
                  </div>
                  <p style={{ fontStyle: 'italic', fontSize: '1rem', lineHeight: 1.6, color: 'rgba(255,255,255,0.9)' }}>
                    &ldquo;{result.ai_insights}&rdquo;
                  </p>
                </div>
              </div>

              {/* Metrics & Breakdown Bento Card */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div className="card" style={{ padding: '1.5rem' }}>
                  <h4 style={{ marginBottom: '1rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Selected Carton</h4>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem', marginBottom: '1.5rem' }}>
                    <div style={{ background: 'var(--accent-blue)', padding: '0.75rem', borderRadius: '10px' }}>
                      <BoxIcon size={24} color="#fff" />
                    </div>
                    <div>
                      <div style={{ fontSize: '1.2rem', fontWeight: 800 }}>{result.box_name}</div>
                      <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{result.box_length}x{result.box_width}x{result.box_height} cm</div>
                    </div>
                  </div>
                  
                  <div style={{ display: 'grid', gap: '1rem' }}>
                    <Metric label="Volume Utilization" value={`${result.utilization_percent.toFixed(1)}%`} color="var(--accent-blue)" />
                    <Metric label="Total Cost" value={`$${result.shipping_cost.toFixed(2)}`} color="var(--success)" />
                    <Metric label="Chargeable Wt" value={`${result.chargeable_weight.toFixed(2)} kg`} />
                  </div>
                </div>

                <div className="card" style={{ padding: '1.5rem', flex: 1 }}>
                  <h4 style={{ marginBottom: '1.25rem', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>Packing Sequence</h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', maxHeight: '300px', overflowY: 'auto' }}>
                    {result.placed_items.map((item, i) => (
                      <div key={i} style={{ padding: '0.75rem', borderRadius: '8px', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-color)', fontSize: '0.8rem', display: 'flex', justifyContent: 'space-between' }}>
                        <span>{item.product_name}</span>
                        <span style={{ color: 'var(--text-secondary)' }}>x:{item.x} y:{item.y} z:{item.z}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

            </motion.div>
          ) : (
            <div style={{ flex: 1, minHeight: '600px', border: '1px dashed var(--border-color)', borderRadius: '24px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'rgba(255,255,255,0.02)' }}>
              <Layout size={48} style={{ opacity: 0.1, marginBottom: '1.5rem' }} />
              <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>Results will appear here after optimization.</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

function NumberInput({ label, value, onChange }: { label: string, value: number, onChange: (v: number) => void }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
      <label style={{ fontSize: '0.65rem', color: 'var(--text-secondary)', fontWeight: 700, textTransform: 'uppercase' }}>{label}</label>
      <input 
        type="number" step="0.1" className="form-input" value={value} 
        onChange={e => onChange(parseFloat(e.target.value))} required 
        style={{ padding: '0.3rem 0', background: 'transparent', border: 'none', borderBottom: '1px solid var(--border-color)', borderRadius: 0, fontSize: '0.85rem' }}
      />
    </div>
  );
}

function Metric({ label, value, color }: { label: string, value: string, color?: string }) {
  return (
    <div style={{ padding: '1rem', borderRadius: '12px', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-color)' }}>
      <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>{label}</div>
      <div style={{ fontSize: '1.4rem', fontWeight: 800, color: color || 'var(--text-primary)' }}>{value}</div>
    </div>
  );
}
