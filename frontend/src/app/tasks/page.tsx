'use client';
import React, { useEffect, useState } from 'react';

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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'var(--success)';
      case 'in_progress': return 'var(--accent-color)';
      default: return 'var(--text-secondary)';
    }
  };

  return (
    <div className="animate-fade-in" style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <header>
        <h2>📋 Priority Works & Tasks</h2>
        <p>Manage logistics operations and pending warehouse optimizations.</p>
      </header>

      <div className="card">
        <h3>Add New Strategy Task</h3>
        <form onSubmit={handleCreate} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
          <input 
            type="text" 
            className="form-input" 
            placeholder="Task Title (e.g., Optimize Q3 Bulk Shipment)" 
            value={newTitle} 
            onChange={e => setNewTitle(e.target.value)} 
            required 
          />
          <textarea 
            className="form-input" 
            placeholder="Description..." 
            rows={3} 
            value={newDesc} 
            onChange={e => setNewDesc(e.target.value)}
          />
          <button type="submit" className="btn-primary" style={{ alignSelf: 'flex-start' }}>Create Task</button>
        </form>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '1.5rem' }}>
        {loading ? (
          <div className="card">Loading tasks...</div>
        ) : tasks.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', gridColumn: '1 / -1' }}>
            <p>No tasks found. Start by creating a logistics strategy above.</p>
          </div>
        ) : tasks.map(task => (
          <div key={task.id} className="card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <h4 style={{ margin: 0 }}>{task.title}</h4>
              <span style={{ 
                fontSize: '0.75rem', 
                padding: '0.25rem 0.6rem', 
                borderRadius: '12px', 
                background: `${getStatusColor(task.status)}20`, 
                color: getStatusColor(task.status),
                fontWeight: 600,
                textTransform: 'uppercase'
              }}>
                {task.status.replace('_', ' ')}
              </span>
            </div>
            <p style={{ fontSize: '0.9rem', flex: 1 }}>{task.description}</p>
            <div style={{ display: 'flex', gap: '0.5rem', marginTop: 'auto' }}>
              {task.status !== 'completed' && (
                <button 
                  onClick={() => updateStatus(task.id, task.status === 'pending' ? 'in_progress' : 'completed')} 
                  className="btn-primary" 
                  style={{ fontSize: '0.8rem', padding: '0.5rem 1rem' }}
                >
                  {task.status === 'pending' ? 'Start Task' : 'Complete'}
                </button>
              )}
              {task.status !== 'pending' && (
                <button 
                  onClick={() => updateStatus(task.id, 'pending')} 
                  className="btn-primary" 
                  style={{ fontSize: '0.8rem', padding: '0.5rem 1rem', background: 'var(--border-color)', color: 'var(--text-primary)' }}
                >
                  Reset
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
