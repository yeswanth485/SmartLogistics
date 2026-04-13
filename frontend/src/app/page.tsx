'use client';
import React, { useState, FormEvent } from 'react';
import ThreeDBox from '@/components/ThreeDBox';

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

export default function Home() {
  const [tab, setTab] = useState<'manual' | 'upload'>('manual');
  const [products, setProducts] = useState<Product[]>([
    { name: 'Laptop', length: 30, width: 22, height: 2, weight: 2.1, quantity: 1 }
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
      // skip header assumed
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
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unknown error occurred");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="layout-container animate-fade-in">
      
      {/* Tabs */}
      <div style={{ display: 'flex', gap: '1rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem' }}>
        <button 
          className="btn-primary" 
          style={{ background: tab === 'manual' ? 'var(--accent-color)' : 'transparent', color: tab === 'manual' ? '#fff' : 'var(--text-secondary)' }}
          onClick={() => setTab('manual')}
        >
          Manual Entry
        </button>
        <button 
          className="btn-primary" 
          style={{ background: tab === 'upload' ? 'var(--accent-color)' : 'transparent', color: tab === 'upload' ? '#fff' : 'var(--text-secondary)' }}
          onClick={() => setTab('upload')}
        >
          Upload CSV
        </button>
      </div>

      {/* Input Section */}
      <div className="card">
        <h2>Input Products</h2>
        {tab === 'upload' && (
          <div className="form-group" style={{ marginBottom: '2rem' }}>
            <label className="form-label">Upload Items (CSV format: name,length,width,height,weight,quantity)</label>
            <input type="file" accept=".csv" onChange={handleCsvUpload} className="form-input" />
          </div>
        )}

        <form onSubmit={submitOptimization}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {products.map((p, idx) => (
              <div key={idx} style={{ display: 'flex', gap: '1rem', alignItems: 'flex-end', flexWrap: 'wrap' }}>
                <div className="form-group" style={{ flex: 2 }}>
                  <label className="form-label">Name</label>
                  <input type="text" className="form-input" value={p.name} onChange={(e) => handleProductChange(idx, 'name', e.target.value)} required />
                </div>
                <div className="form-group" style={{ flex: 1 }}>
                  <label className="form-label">L (cm)</label>
                  <input type="number" step="0.1" className="form-input" value={p.length} onChange={(e) => handleProductChange(idx, 'length', parseFloat(e.target.value))} required />
                </div>
                <div className="form-group" style={{ flex: 1 }}>
                  <label className="form-label">W (cm)</label>
                  <input type="number" step="0.1" className="form-input" value={p.width} onChange={(e) => handleProductChange(idx, 'width', parseFloat(e.target.value))} required />
                </div>
                <div className="form-group" style={{ flex: 1 }}>
                  <label className="form-label">H (cm)</label>
                  <input type="number" step="0.1" className="form-input" value={p.height} onChange={(e) => handleProductChange(idx, 'height', parseFloat(e.target.value))} required />
                </div>
                <div className="form-group" style={{ flex: 1 }}>
                  <label className="form-label">Wt (kg)</label>
                  <input type="number" step="0.1" className="form-input" value={p.weight} onChange={(e) => handleProductChange(idx, 'weight', parseFloat(e.target.value))} required />
                </div>
                <div className="form-group" style={{ flex: 1 }}>
                  <label className="form-label">Qty</label>
                  <input type="number" min="1" className="form-input" value={p.quantity} onChange={(e) => handleProductChange(idx, 'quantity', parseInt(e.target.value))} required />
                </div>
                <div className="form-group">
                  <button type="button" className="btn-primary" style={{ background: 'var(--danger)' }} onClick={() => handleRemoveProduct(idx)}>X</button>
                </div>
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
            <button type="button" className="btn-primary" style={{ background: 'var(--secondary-bg)', border: '1px solid var(--border-color)', color: 'var(--text-primary)' }} onClick={handleAddProduct}>
              + Add Item
            </button>
            <button type="submit" className="btn-primary" disabled={loading} style={{ flex: 1 }}>
              {loading ? (
                <>
                  <span className="loader" style={{ width: '20px', height: '20px', borderWidth: '2px' }}></span>
                  Optimizing with Genetic Algorithm...
                </>
              ) : (
                'Optimize Now (AI Engine)'
              )}
            </button>
          </div>
        </form>
        {error && <div style={{ color: 'var(--danger)', marginTop: '1rem', fontWeight: 600 }}>{error}</div>}
      </div>

      {/* Results Section */}
      {result && (
        <div className="card animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2rem', alignItems: 'flex-start' }}>
            <div style={{ flex: 1, minWidth: '300px' }}>
              <h2>Optimization Results</h2>
              <div style={{ background: 'var(--primary-bg)', padding: '1.5rem', borderRadius: '12px', border: '1px solid var(--border-color)', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div>
                  <div className="form-label">Selected Carton</div>
                  <div style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--accent-color)' }}>
                    {result.box_name} ({result.box_length}x{result.box_width}x{result.box_height}cm)
                  </div>
                </div>
                <div>
                  <div className="form-label">Total Shipping Cost</div>
                  <div style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--success)' }}>
                    ${result.shipping_cost.toFixed(2)}
                  </div>
                </div>
                <div>
                  <div className="form-label">Volume Utilization</div>
                  <div style={{ fontSize: '1.25rem', fontWeight: 600 }}>{result.utilization_percent.toFixed(2)}%</div>
                </div>
                <div>
                  <div className="form-label">Chargeable Weight</div>
                  <div style={{ fontSize: '1.25rem', fontWeight: 600 }}>{result.chargeable_weight.toFixed(2)} kg</div>
                </div>
              </div>

              <div style={{ marginTop: '2rem', background: 'var(--primary-bg)', padding: '1.5rem', borderRadius: '12px', border: '1px solid #3b82f640' }}>
                <h3 style={{ color: 'var(--accent-color)', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span>✨</span> AI Insight (Claude 3.7)
                </h3>
                <p style={{ color: 'var(--text-primary)', fontStyle: 'italic', lineHeight: 1.8 }}>
                  {result.ai_insights}
                </p>
              </div>
            </div>

            <div style={{ flex: 1, minWidth: '400px' }}>
              <h2>3D Packing Visualization</h2>
              <ThreeDBox 
                box_length={result.box_length} 
                box_width={result.box_width} 
                box_height={result.box_height} 
                placed_items={result.placed_items} 
              />
            </div>
          </div>

        </div>
      )}

    </div>
  );
}
