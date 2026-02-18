import { useState, useEffect } from 'react';
import { Plus, DollarSign, Building2 } from 'lucide-react';
import { salaryService, invoiceService } from '../services/storage';
import { formatCurrency, formatDate } from '../utils/helpers';
import Button from '../components/common/Button';
import Modal from '../components/common/Modal';
import Input from '../components/common/Input';
import Table from '../components/common/Table';
import Badge from '../components/common/Badge';

const Salary = () => {
  const [activeTab, setActiveTab] = useState('salary');
  const [salaries, setSalaries] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ guardName: '', month: '', amount: '', workingDays: '' });

  useEffect(() => {
    setSalaries(salaryService.getAll());
    setInvoices(invoiceService.getAll());
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (activeTab === 'salary') {
      salaryService.create(formData);
      setSalaries(salaryService.getAll());
    } else {
      invoiceService.create(formData);
      setInvoices(invoiceService.getAll());
    }
    setShowModal(false);
    setFormData({ guardName: '', month: '', amount: '', workingDays: '' });
  };

  const markPaid = (id) => {
    if (activeTab === 'salary') {
      salaryService.markAsPaid(id);
      setSalaries(salaryService.getAll());
    } else {
      invoiceService.markAsPaid(id);
      setInvoices(invoiceService.getAll());
    }
  };

  const salaryColumns = [
    { header: 'Guard', accessor: 'guardName', render: (row) => <span className="font-semibold">{row.guardName}</span> },
    { header: 'Month', accessor: 'month' },
    { header: 'Days', accessor: 'workingDays', render: (row) => <span className="font-mono">{row.workingDays}</span> },
    { header: 'Amount', render: (row) => <span className="font-mono font-semibold">{formatCurrency(row.amount)}</span> },
    { header: 'Status', render: (row) => <Badge status={row.status}>{row.status}</Badge> },
    { header: 'Actions', render: (row) => row.status === 'Unpaid' && <Button size="sm" variant="success" onClick={() => markPaid(row.id)}>Mark Paid</Button> },
  ];

  const invoiceColumns = [
    { header: 'Invoice No', accessor: 'invoiceNo', render: (row) => <span className="font-mono font-semibold">{row.invoiceNo}</span> },
    { header: 'Client', accessor: 'clientName', render: (row) => <span className="font-semibold">{row.clientName}</span> },
    { header: 'Date', render: (row) => <span className="font-mono">{formatDate(row.date)}</span> },
    { header: 'Amount', render: (row) => <span className="font-mono font-semibold">{formatCurrency(row.amount)}</span> },
    { header: 'Status', render: (row) => <Badge status={row.status}>{row.status}</Badge> },
    { header: 'Actions', render: (row) => row.status === 'Unpaid' && <Button size="sm" variant="success" onClick={() => markPaid(row.id)}>Mark Paid</Button> },
  ];

  return (
    <div className="w-full min-h-full p-6 lg:p-10">
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-secondary-900">Salary & Invoices</h1>
          <p className="text-sm text-secondary-500 mt-2">Manage payments and billing</p>
        </div>
        <Button icon={Plus} onClick={() => setShowModal(true)}>{activeTab === 'salary' ? 'Generate Salary' : 'Create Invoice'}</Button>
      </div>

      <div className="flex gap-2 bg-white border border-secondary-200 rounded-xl p-2 mb-6">
        <button onClick={() => setActiveTab('salary')} className={`flex-1 h-11 flex items-center justify-center gap-2 rounded-lg font-semibold text-sm transition-all ${activeTab === 'salary' ? 'bg-gradient-to-br from-primary-600 to-primary-700 text-white shadow-md' : 'text-secondary-600 hover:bg-secondary-50'}`}><DollarSign size={20} />Salary</button>
        <button onClick={() => setActiveTab('invoices')} className={`flex-1 h-11 flex items-center justify-center gap-2 rounded-lg font-semibold text-sm transition-all ${activeTab === 'invoices' ? 'bg-gradient-to-br from-primary-600 to-primary-700 text-white shadow-md' : 'text-secondary-600 hover:bg-secondary-50'}`}><Building2 size={20} />Invoices</button>
      </div>

      <div className="bg-white border border-secondary-200 rounded-2xl shadow-sm overflow-hidden">
        <Table columns={activeTab === 'salary' ? salaryColumns : invoiceColumns} data={activeTab === 'salary' ? salaries : invoices} emptyMessage={`No ${activeTab} records yet`} />
      </div>

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title={activeTab === 'salary' ? 'Generate Salary' : 'Create Invoice'}>
        <form onSubmit={handleSubmit} className="space-y-5">
          {activeTab === 'salary' ? (
            <>
              <Input label="Guard Name" value={formData.guardName} onChange={(e) => setFormData({ ...formData, guardName: e.target.value })} required />
              <Input label="Month" type="month" value={formData.month} onChange={(e) => setFormData({ ...formData, month: e.target.value })} required />
              <Input label="Working Days" type="number" min="1" value={formData.workingDays} onChange={(e) => setFormData({ ...formData, workingDays: e.target.value })} required />
              <Input label="Amount" type="number" min="0" value={formData.amount} onChange={(e) => setFormData({ ...formData, amount: e.target.value })} required />
            </>
          ) : (
            <>
              <Input label="Client Name" value={formData.clientName} onChange={(e) => setFormData({ ...formData, clientName: e.target.value })} required />
              <Input label="Date" type="date" value={formData.date} onChange={(e) => setFormData({ ...formData, date: e.target.value })} required />
              <Input label="Due Date" type="date" value={formData.dueDate} onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })} required />
              <Input label="Amount" type="number" min="0" value={formData.amount} onChange={(e) => setFormData({ ...formData, amount: e.target.value })} required />
            </>
          )}
          <Button type="submit" fullWidth>{activeTab === 'salary' ? 'Generate' : 'Create'}</Button>
        </form>
      </Modal>
    </div>
  );
};

export default Salary;
