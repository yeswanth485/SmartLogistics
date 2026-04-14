'use client';
import React, { useEffect, useState } from 'react';
import { 
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  AreaChart, Area 
} from 'recharts';
import { 
  TrendingUp, 
  ShieldCheck, 
  DollarSign, 
  Package, 
  Zap,
  ArrowUpRight,
  ChevronRight,
  Clock
} from 'lucide-react';
import { motion } from 'framer-motion';

interface DashboardData {
  stats: {
    total_packages: number;
    avg_utilization: number;
    total_savings: number;
    active_tasks: number;
  };
  trends: Array<{
    date: string;
    volume: number;
    savings: number;
  }>;
}



export default function OverviewPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
        const res = await fetch(`${apiUrl}/api/analytics/dashboard`);
        const json = await res.json();
        setData(json);
      } catch (err) {
        console.error("Dashboard fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return (
    <div style={{ height: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className="loader"></div>
    </div>
  );

  const stats = data?.stats || { total_packages: 0, avg_utilization: 0, total_savings: 0, active_tasks: 0 };

  return (
    <div className="animate-fade-in" style={{ width: '100%', paddingBottom: '3rem' }}>
      <header style={{ marginBottom: '2.5rem' }}>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 800, letterSpacing: '-0.03em' }}>
          Logistics <span style={{ color: 'var(--accent-blue)' }}>Intelligence</span>
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>Welcome back to Terybi AI. System health is optimal.</p>
      </header>

      {/* Stats Bento Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem', marginBottom: '2.5rem' }}>
        <StatCard 
          title="Total Packages" 
          value={stats.total_packages.toLocaleString()} 
          icon={<Package color="var(--accent-blue)" />} 
          trend="+12% from last week" 
        />
        <StatCard 
          title="Avg Utilization" 
          value={`${stats.avg_utilization.toFixed(1)}%`} 
          icon={<Zap color="#f59e0b" />} 
          trend="+4.2% optimized" 
        />
        <StatCard 
          title="Total Savings" 
          value={`$${stats.total_savings.toFixed(2)}`} 
          icon={<DollarSign color="#10b981" />} 
          trend="AI-driven reduction" 
        />
        <StatCard 
          title="Active Tasks" 
          value={stats.active_tasks.toString()} 
          icon={<Clock color="#ef4444" />} 
          trend="Requires attention" 
        />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem' }}>
        {/* Main Trend Chart */}
        <div className="card" style={{ padding: '1.5rem', minHeight: '400px', display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
            <div>
              <h3 style={{ margin: 0 }}>Efficiency Trends</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: 0 }}>Last 7 days performance metrics</p>
            </div>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                <div style={{ width: '8px', height: '8px', borderRadius: '2px', background: 'var(--accent-blue)' }}></div> Volume
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                <div style={{ width: '8px', height: '8px', borderRadius: '2px', background: '#10b981' }}></div> Savings
              </span>
            </div>
          </div>
          
          <div style={{ flex: 1, width: '100%' }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data?.trends || []}>
                <defs>
                  <linearGradient id="colorVolume" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--accent-blue)" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="var(--accent-blue)" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis dataKey="date" stroke="var(--text-secondary)" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="var(--text-secondary)" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'var(--secondary-bg)', border: '1px solid var(--border-color)', borderRadius: '8px', boxShadow: 'var(--card-shadow)' }}
                  itemStyle={{ fontSize: '12px' }}
                />
                <Area type="monotone" dataKey="volume" stroke="var(--accent-blue)" fillOpacity={1} fill="url(#colorVolume)" strokeWidth={3} />
                <Area type="monotone" dataKey="savings" stroke="#10b981" fill="transparent" strokeWidth={2} strokeDasharray="5 5" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Action / Quick Insights */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div className="card" style={{ padding: '1.5rem', background: 'linear-gradient(135deg, rgba(59,130,246,0.1) 0%, transparent 100%)', border: '1px solid rgba(59,130,246,0.2)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
              <div style={{ background: 'var(--accent-blue)', padding: '0.5rem', borderRadius: '8px' }}>
                <ShieldCheck size={20} color="#fff" />
              </div>
              <h4 style={{ margin: 0 }}>Smart Tip</h4>
            </div>
            <p style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.8)', lineHeight: 1.5 }}>
              Increasing carton standardization by 12% could save an estimated **$1,240** in monthly shipping surcharges.
            </p>
            <button className="btn-primary" style={{ marginTop: '1rem', width: '100%', fontSize: '0.85rem', padding: '0.6rem' }}>
              Analyze Details <ArrowUpRight size={14} />
            </button>
          </div>

          <div className="card" style={{ padding: '1.5rem', flex: 1 }}>
            <h4 style={{ marginBottom: '1.25rem' }}>Recent Activity</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <ActivityItem icon={<Package size={14} />} text="New packing run: 45 items optimized" time="12m ago" />
              <ActivityItem icon={<TrendingUp size={14} />} text="Cost model updated: Q2 Global Rates" time="2h ago" />
              <ActivityItem icon={<Clock size={14} />} text="Inventory alert: 30x30 boxes low" time="5h ago" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon, trend }: { title: string, value: string, icon: React.ReactNode, trend: string }) {
  return (
    <motion.div 
      whileHover={{ translateY: -5 }}
      className="card" 
      style={{ padding: '1.5rem', position: 'relative', overflow: 'hidden' }}
    >
      <div style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', opacity: 0.8 }}>
        {icon}
      </div>
      <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.5rem', fontWeight: 500 }}>{title}</p>
      <h3 style={{ fontSize: '1.8rem', fontWeight: 800, margin: 0 }}>{value}</h3>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginTop: '1rem', fontSize: '0.75rem', color: '#10b981' }}>
        <TrendingUp size={12} />
        <span>{trend}</span>
      </div>
    </motion.div>
  );
}

function ActivityItem({ icon, text, time }: { icon: React.ReactNode, text: string, time: string }) {
  return (
    <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
      <div style={{ backgroundColor: 'rgba(255,255,255,0.05)', padding: '0.4rem', borderRadius: '6px', color: 'var(--text-secondary)' }}>
        {icon}
      </div>
      <div style={{ flex: 1 }}>
        <p style={{ fontSize: '0.85rem', margin: 0, color: 'rgba(255,255,255,0.9)' }}>{text}</p>
        <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>{time}</span>
      </div>
      <ChevronRight size={14} color="rgba(255,255,255,0.2)" />
    </div>
  );
}
