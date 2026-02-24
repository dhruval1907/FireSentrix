import { useState, useEffect } from 'react';
import { Plus, DollarSign, Building2 } from 'lucide-react';
import { salariesApi, invoicesApi } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { formatCurrency } from '../utils/helpers';
import Button from '../components/common/Button';
import Modal from '../components/common/Modal';
import Input from '../components/common/Input';
import Table from '../components/common/Table';
import Badge from '../components/common/Badge';

const Salary = () => {
  const { token } = useAuth();
  const [activeTab, setActiveTab] = useState('salary');
  const [salaries, setSalaries] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({});

  const loadData = async () => {
    if (!token) return;
    try {
      const [salRes, invRes] = await Promise.all([salariesApi.list(token), invoicesApi.list(token)]);
      setSalaries(salRes.salaries || []);
      setInvoices(invRes.invoices || []);
    } catch (err) { console.error(err); }
  };

  useEffect(() => { loadData(); }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (activeTab === 'salary') { await salariesApi.create(token, formData); }
      else { await invoicesApi.create(token, formData); }
      await loadData();
      setShowModal(false);
      setFormData({});
    } catch (err) { alert(err.message); }
  };

  const markPaid = async (id) => {
    try {
      await invoicesApi.markPaid(token, id);
      await loadData();
    } catch (err) { alert(err.message); }
  };

  const salaryColumns = [
    { header: 'Guard', render: (row) => <span className="font-semibold">{row.guard?.name || '-'}</span> },
    { header: 'Month', accessor: 'month' },
    { header: 'Days Present', render: (row) => <span className="font-mono">{row.totalDaysPresent}</span> },
    { header: 'Total Salary', render: (row) => <span className="font-mono font-semibold">{formatCurrency(row.totalSalary)}</span> },
  ];

  const invoiceColumns = [
    { header: 'Client', render: (row) => <span className="font-semibold">{row.client?.clientName || row.client?.companyName || '-'}</span> },
    { header: 'Month', accessor: 'month' },
    { header: 'Amount', render: (row) => <span className="font-mono font-semibold">{formatCurrency(row.amount)}</span> },
    { header: 'Status', render: (row) => <Badge status={row.status === 'paid' ? 'Active' : 'Inactive'}>{row.status}</Badge> },
    { header: 'Actions', render: (row) => row.status === 'unpaid' && <Button size="sm" variant="success" onClick={() => markPaid(row.id || row._id)}>Mark Paid</Button> },
  ];

  return (
    <div className="w-full min-h-full p-6 lg:p-10">
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-secondary-900">Salary & Invoices</h1>
          <p className="text-sm text-secondary-500 mt-2">Manage payments and billing</p>
        </div>
      </div>
      <div className="flex gap-2 bg-white border border-secondary-200 rounded-xl p-2 mb-6">
        <button onClick={() => setActiveTab('salary')} className={`flex-1 h-11 flex items-center justify-center gap-2 rounded-lg font-semibold text-sm transition-all ${activeTab === 'salary' ? 'bg-gradient-to-br from-primary-600 to-primary-700 text-white shadow-md' : 'text-secondary-600 hover:bg-secondary-50'}`}><DollarSign size={20} />Salary</button>
        <button onClick={() => setActiveTab('invoices')} className={`flex-1 h-11 flex items-center justify-center gap-2 rounded-lg font-semibold text-sm transition-all ${activeTab === 'invoices' ? 'bg-gradient-to-br from-primary-600 to-primary-700 text-white shadow-md' : 'text-secondary-600 hover:bg-secondary-50'}`}><Building2 size={20} />Invoices</button>
      </div>
      <div className="bg-white border border-secondary-200 rounded-2xl shadow-sm overflow-hidden">
        <Table columns={activeTab === 'salary' ? salaryColumns : invoiceColumns} data={activeTab === 'salary' ? salaries : invoices} emptyMessage={`No ${activeTab} records yet`} />
      </div>
    </div>
  );
};

export default Salary;
