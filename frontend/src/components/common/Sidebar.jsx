import { NavLink, useNavigate } from 'react-router-dom';
import { Shield, TrendingUp, Building2, Users, Flame, Calendar, DollarSign, MessageSquare, LogOut, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { getAccessibleRoutes } from '../../utils/helpers';
import Avatar from './Avatar';

const Sidebar = ({ isOpen, onClose }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const allMenuItems = [
    { path: '/dashboard', label: 'Dashboard', icon: TrendingUp, id: 'dashboard' },
    { path: '/clients', label: 'Client & Sites', icon: Building2, id: 'clients' },
    { path: '/guards', label: 'Guard Management', icon: Users, id: 'guards' },
    { path: '/equipment', label: 'Fire Equipment', icon: Flame, id: 'equipment' },
    { path: '/attendance', label: 'Attendance', icon: Calendar, id: 'attendance' },
    { path: '/salary', label: 'Salary & Invoices', icon: DollarSign, id: 'salary' },
    { path: '/chat', label: 'Live Chat', icon: MessageSquare, id: 'chat' },
  ];

  const accessibleRoutes = getAccessibleRoutes(user?.role);
  const menuItems = allMenuItems.filter(item => accessibleRoutes.includes(item.id));

  return (
    <>
      {isOpen && <div className="fixed inset-0 bg-black/50 z-40 lg:hidden animate-fade-in" onClick={onClose} />}
      <aside className={`fixed lg:sticky top-0 left-0 z-50 w-[280px] h-screen bg-secondary-800 flex flex-col border-r border-secondary-700 transition-transform duration-300 lg:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="h-[100px] flex items-center gap-4 border-b border-secondary-700 px-6">
          <div className="w-12 h-12 bg-gradient-to-br from-primary-600 to-primary-700 rounded-xl flex items-center justify-center flex-shrink-0"><Shield size={24} className="text-white" strokeWidth={2.5} /></div>
          <div className="flex-1 min-w-0">
            <h2 className="text-lg font-extrabold text-white tracking-wider">KRUSHA FIRE</h2>
            <p className="text-xs text-secondary-400 font-medium mt-0.5">Security System</p>
          </div>
          <button onClick={onClose} className="lg:hidden w-10 h-10 flex items-center justify-center rounded-lg hover:bg-secondary-700 transition-colors"><X size={20} className="text-white" /></button>
        </div>

        <nav className="flex-1 overflow-y-auto custom-scrollbar py-6 px-4">
          {menuItems.map(item => {
            const Icon = item.icon;
            return (
              <NavLink key={item.path} to={item.path} onClick={onClose} className={({ isActive }) => `flex items-center gap-3 h-12 px-4 rounded-xl mb-1 text-sm font-medium transition-all duration-200 ${isActive ? 'bg-gradient-to-br from-primary-600 to-primary-700 text-white shadow-lg' : 'text-secondary-400 hover:bg-secondary-700 hover:text-white'}`}>
                <Icon size={20} />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>

        <div className="h-auto border-t border-secondary-700 py-5 px-4 space-y-3">
          <div className="flex items-center gap-3 px-3">
            <Avatar name={user?.name} size="md" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-white truncate">{user?.name}</p>
              <p className="text-xs text-secondary-400 mt-0.5">{user?.role}</p>
            </div>
          </div>
          <button onClick={() => { logout(); navigate('/login'); }} className="w-full h-11 flex items-center justify-center gap-2 bg-red-500/10 border border-red-500/30 rounded-xl text-sm font-semibold text-red-400 hover:bg-red-500/20 transition-all">
            <LogOut size={18} />
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
