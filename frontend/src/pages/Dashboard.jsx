import { useEffect, useState } from 'react';
import { Shield, UserCheck, DollarSign, Flame, Clock, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { guardsApi, equipmentApi, attendanceApi, salariesApi } from '../services/api';

const StatCard = ({ icon: Icon, label, value, subValue, subLabel, color, bgColor, delay = 0 }) => (
  <div className="bg-white border border-secondary-200 rounded-2xl p-6 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 animate-slide-in-up" style={{ animationDelay: `${delay}ms`, opacity: 0, animationFillMode: 'forwards' }}>
    <div className="flex items-start gap-4 mb-5">
      <div className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: bgColor, color }}><Icon size={28} strokeWidth={2} /></div>
      <p className="flex-1 text-xs font-bold text-secondary-500 uppercase tracking-wider leading-tight pt-1">{label}</p>
    </div>
    {subValue !== undefined ? (
      <div className="flex gap-8">
        <div><p className="text-4xl font-extrabold text-secondary-900 font-mono leading-none">{value}</p><p className="text-xs font-semibold text-secondary-500 uppercase tracking-wide mt-1">{subLabel}</p></div>
        <div><p className="text-4xl font-extrabold text-secondary-900 font-mono leading-none">{subValue}</p><p className="text-xs font-semibold text-secondary-500 uppercase tracking-wide mt-1">ABSENT</p></div>
      </div>
    ) : (
      <p className="text-5xl font-extrabold text-secondary-900 font-mono leading-none">{value}</p>
    )}
  </div>
);

const ActivityCard = ({ icon: Icon, count, label, color, delay = 0 }) => (
  <div className="h-[200px] bg-white border border-secondary-200 rounded-2xl p-8 flex flex-col items-center justify-center gap-4 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 animate-slide-in-up" style={{ animationDelay: `${delay}ms`, opacity: 0, animationFillMode: 'forwards' }}>
    <div className="w-16 h-16 flex items-center justify-center" style={{ color }}><Icon size={64} strokeWidth={1.5} /></div>
    <p className="text-6xl font-extrabold text-secondary-900 font-mono leading-none">{count}</p>
    <p className="text-xs font-bold text-secondary-500 uppercase tracking-wider text-center leading-tight">{label}</p>
  </div>
);

const Dashboard = () => {
  const { user, token } = useAuth();
  const [stats, setStats] = useState({ onDuty: 0, present: 0, absent: 0, billing: 0, equipment: 0 });

  useEffect(() => {
    if (!token) return;
    const load = async () => {
      try {
        const [guardsRes, equipRes, attRes, salRes] = await Promise.all([
          guardsApi.list(token),
          equipmentApi.list(token),
          attendanceApi.getByDate(token, new Date().toISOString().split('T')[0]),
          salariesApi.list(token),
        ]);
        setStats({
          onDuty: (guardsRes.guards || []).filter(g => g.status === 'active').length,
          present: (attRes.records || []).filter(a => a.status === 'present').length,
          absent: (attRes.records || []).filter(a => a.status === 'absent').length,
          billing: (salRes.salaries || []).reduce((sum, s) => sum + (Number(s.totalSalary) || 0), 0),
          equipment: (equipRes.equipment || []).length,
        });
      } catch (err) {
        console.error('Dashboard load error:', err);
      }
    };
    load();
  }, [token]);

  return (
    <div className="w-full min-h-full p-6 lg:p-10">
      <div className="mb-8">
        <div className="bg-gradient-to-br from-primary-50 to-primary-50/50 border border-primary-200 rounded-2xl p-6 lg:p-8 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          <div>
            <p className="text-xs font-bold text-secondary-500 uppercase tracking-wider mb-2">SYSTEM LIVE</p>
            <h1 className="text-3xl lg:text-4xl font-extrabold text-secondary-900">Welcome, <span className="text-primary-600">{user?.name}</span></h1>
          </div>
          <div className="h-11 flex items-center gap-2 bg-green-100 text-green-700 font-bold text-sm uppercase tracking-wide rounded-xl px-5">
            <div className="w-2 h-2 bg-green-600 rounded-full animate-pulse-dot" />ACTIVE
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
        <StatCard icon={Shield} label="ON-DUTY FORCE" value={stats.onDuty} color="#DC2626" bgColor="#FEE2E2" delay={0} />
        <StatCard icon={UserCheck} label="TODAY'S ATTENDANCE" value={stats.present} subValue={stats.absent} subLabel="PRESENT" color="#10B981" bgColor="#D1FAE5" delay={100} />
        <StatCard icon={DollarSign} label="BILLING" value={`₹ ${((stats.billing || 0) / 100000).toFixed(2)}L`} color="#3B82F6" bgColor="#DBEAFE" delay={200} />
        <StatCard icon={Flame} label="EQUIPMENT" value={stats.equipment} color="#F59E0B" bgColor="#FEF3C7" delay={300} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        <ActivityCard icon={Clock} count={0} label="TODAY'S ACTIVITY" color="#DC2626" delay={400} />
        <ActivityCard icon={AlertCircle} count={1} label="UPCOMING ACTIVITY" color="#3B82F6" delay={500} />
        <ActivityCard icon={CheckCircle2} count={5} label="COMPLETED ACTIVITY" color="#10B981" delay={600} />
      </div>
    </div>
  );
};

export default Dashboard;
