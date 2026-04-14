'use client';
import React, { useEffect, useState } from 'react';
import { 
  Plus, 
  Clock, 
  Play, 
  CheckCircle2, 
  RotateCcw,
  AlertCircle,
  Calendar
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Task {
  id: string;
  title: string;
  description: string;
  status: string;
  created_at: string;
}

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');

  const fetchTasks = async () => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
      const res = await fetch(`${apiUrl}/api/tasks`);
      const data = await res.json();
      setTasks(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle) return;
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
      await fetch(`${apiUrl}/api/tasks`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: newTitle, description: newDesc, status: 'pending' })
      });
      setNewTitle('');
      setNewDesc('');
      fetchTasks();
    } catch (err) {
      console.error(err);
    }
  };

  const updateStatus = async (id: string, newStatus: string) => {
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
      await fetch(`${apiUrl}/api/tasks/${id}?status=${newStatus}`, {
        method: 'PATCH'
      });
      fetchTasks();
    } catch (err) {
      console.error(err);
    }
  };

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'completed': return { color: '#10b981', bg: 'rgba(16, 185, 129, 0.1)', icon: <CheckCircle2 size={14} /> };
      case 'in_progress': return { color: 'var(--accent-blue)', bg: 'rgba(59, 130, 246, 0.1)', icon: <Play size={14} /> };
      default: return { color: 'var(--text-secondary)', bg: 'rgba(156, 163, 175, 0.1)', icon: <Clock size={14} /> };
    }
  };

  return (
    <div className="animate-fade-in" style={{ width: '100%', paddingBottom: '4rem' }}>
      <header style={{ marginBottom: '2.5rem' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 800, letterSpacing: '-0.03em' }}>
          Priority <span style={{ color: 'var(--accent-blue)' }}>Works</span>
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>Operational strategy and pending logistics optimizations.</p>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 400px', gap: '2rem', alignItems: 'flex-start' }}>
        
        {/* Task Feed */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {loading ? (
            Array(3).fill(0).map((_, i) => <div key={i} className="card loader" style={{ height: '120px' }}></div>)
          ) : tasks.length === 0 ? (
            <div className="card" style={{ padding: '4rem', textAlign: 'center', background: 'rgba(255,255,255,0.01)', border: '1px dashed var(--border-color)' }}>
              <AlertCircle size={40} style={{ opacity: 0.1, marginBottom: '1rem' }} />
              <p style={{ color: 'var(--text-secondary)' }}>No active strategies. Initialize a new task from the portal.</p>
            </div>
          ) : (
            <AnimatePresence mode="popLayout">
              {tasks.map(task => {
                const config = getStatusConfig(task.status);
                return (
                  <motion.div 
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    key={task.id} 
                    className="card" 
                    style={{ padding: '1.5rem', border: '1px solid var(--border-color)', display: 'flex', gap: '1.5rem' }}
                  >
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
                      <div style={{ color: config.color, background: config.bg, padding: '0.6rem', borderRadius: '50%' }}>
                        {config.icon}
                      </div>
                      <div style={{ width: '2px', flex: 1, background: 'linear-gradient(to bottom, var(--border-color) 0%, transparent 100%)' }}></div>
                    </div>

                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                        <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 700 }}>{task.title}</h3>
                        <span style={{ fontSize: '0.65rem', padding: '0.2rem 0.6rem', borderRadius: '4px', background: config.bg, color: config.color, fontWeight: 800, textTransform: 'uppercase' }}>
                          {task.status.replace('_', ' ')}
                        </span>
                      </div>
                      <p style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.7)', marginBottom: '1.25rem', lineHeight: 1.5 }}>{task.description}</p>
                      
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                          <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                            <Calendar size={12} /> {new Date(task.created_at).toLocaleDateString()}
                          </span>
                        </div>
                        <div style={{ display: 'flex', gap: '0.75rem' }}>
                          {task.status !== 'completed' && (
                            <button 
                              onClick={() => updateStatus(task.id, task.status === 'pending' ? 'in_progress' : 'completed')} 
                              className="btn-primary" 
                              style={{ fontSize: '0.75rem', padding: '0.4rem 1rem' }}
                            >
                              {task.status === 'pending' ? 'Activate' : 'Finalize'}
                            </button>
                          )}
                          <button 
                            onClick={() => updateStatus(task.id, 'pending')}
                            style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', padding: '0.4rem' }}
                          >
                            <RotateCcw size={14} />
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          )}
        </div>

        {/* Action Panel */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div className="card" style={{ padding: '2rem', border: '1px solid var(--accent-blue)', background: 'var(--secondary-bg)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
              <Plus size={20} color="var(--accent-blue)" />
              <h3 style={{ margin: 0 }}>New Strategy</h3>
            </div>
            <form onSubmit={handleCreate} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div className="form-group">
                <label className="form-label">Objective Title</label>
                <input 
                  type="text" 
                  className="form-input" 
                  placeholder="e.g. Optimize North Hub" 
                  value={newTitle} 
                  onChange={e => setNewTitle(e.target.value)} 
                  required 
                />
              </div>
              <div className="form-group">
                <label className="form-label">Context & Requirements</label>
                <textarea 
                  className="form-input" 
                  placeholder="Describe the logistical goals..." 
                  rows={4} 
                  value={newDesc} 
                  onChange={e => setNewDesc(e.target.value)}
                />
              </div>
              <button type="submit" className="btn-primary" style={{ width: '100%' }}>
                Create Operational Task
              </button>
            </form>
          </div>

          <div className="card" style={{ padding: '1.5rem' }}>
            <h4 style={{ marginBottom: '1rem' }}>Network Performance</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div style={{ fontSize: '0.85rem', display: 'flex', justifyContent: 'space-between' }}>
                <span color="var(--text-secondary)">Throughput</span>
                <span style={{ fontWeight: 700 }}>98.4%</span>
              </div>
              <div style={{ height: '4px', background: 'rgba(255,255,255,0.05)', borderRadius: '2px', overflow: 'hidden' }}>
                <div style={{ width: '98.4%', height: '100%', background: 'var(--accent-blue)' }}></div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
