import { useState, useEffect } from 'react';
import { attendanceService, guardsService } from '../services/storage';
import { formatDate } from '../utils/helpers';
import { useAuth } from '../context/AuthContext';
import Input from '../components/common/Input';
import Button from '../components/common/Button';
import Table from '../components/common/Table';
import Badge from '../components/common/Badge';
import Avatar from '../components/common/Avatar';

const Attendance = () => {
  const { user } = useAuth();
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [attendance, setAttendance] = useState([]);

  useEffect(() => {
    loadAttendance();
  }, [date]);

  const loadAttendance = () => {
    const guards = guardsService.getAll();
    const records = attendanceService.getByDate(date);
    
    const data = guards.map(guard => {
      const record = records.find(r => r.guardId === guard.id);
      return record || { guardId: guard.id, guardName: guard.name, date, status: 'Absent', checkIn: '-', checkOut: '-' };
    });
    
    setAttendance(data);
  };

  const markAttendance = (guardId, guardName, status) => {
    attendanceService.markAttendance(guardId, guardName, date, status);
    loadAttendance();
  };

  const columns = [
    { header: 'Guard', render: (row) => <div className="flex items-center gap-3"><Avatar name={row.guardName} /><span className="font-semibold">{row.guardName}</span></div> },
    { header: 'Date', render: (row) => <span className="font-mono">{formatDate(row.date)}</span> },
    { header: 'Check In', render: (row) => <span className="font-mono">{row.checkIn}</span> },
    { header: 'Check Out', render: (row) => <span className="font-mono">{row.checkOut}</span> },
    { header: 'Status', render: (row) => <Badge status={row.status}>{row.status}</Badge> },
    ...(user.role === 'Admin' ? [{
      header: 'Actions',
      render: (row) => (
        <div className="flex gap-2">
          <Button size="sm" variant="success" onClick={() => markAttendance(row.guardId, row.guardName, 'Present')} disabled={row.status === 'Present'}>Present</Button>
          <Button size="sm" variant="danger" onClick={() => markAttendance(row.guardId, row.guardName, 'Absent')} disabled={row.status === 'Absent'}>Absent</Button>
        </div>
      ),
    }] : []),
  ];

  return (
    <div className="w-full min-h-full p-6 lg:p-10">
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-secondary-900">Attendance Management</h1>
          <p className="text-sm text-secondary-500 mt-2">Track guard attendance</p>
        </div>
        <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="w-48" />
      </div>

      <div className="bg-white border border-secondary-200 rounded-2xl shadow-sm overflow-hidden">
        <Table columns={columns} data={attendance} emptyMessage="No guards to track" />
      </div>
    </div>
  );
};

export default Attendance;
