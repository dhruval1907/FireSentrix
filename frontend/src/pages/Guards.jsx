import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import { guardsApi } from '../services/api';
import { hasPermission } from '../utils/helpers';
import { useAuth } from '../context/AuthContext';
import Button from '../components/common/Button';
import Modal from '../components/common/Modal';
import Input from '../components/common/Input';
import Table from '../components/common/Table';
import Badge from '../components/common/Badge';
import Avatar from '../components/common/Avatar';

const emptyForm = { id: null, name: '', phone: '', salary: '' };

const Guards = () => {
  const { user, token } = useAuth();
  const [guards, setGuards] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState(emptyForm);

  const loadGuards = async () => {
    if (!token) return;
    try {
      const { guards: list } = await guardsApi.list(token);
      setGuards(list || []);
    } catch (err) { console.error(err); }
  };

  useEffect(() => { loadGuards(); }, [token]);

  const openCreate = () => { setFormData(emptyForm); setShowModal(true); };
  const openEdit = (g) => {
    setFormData({ id: g.id || g._id, name: g.name, phone: g.phone, salary: g.salary || '' });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (formData.id) {
        await guardsApi.update(token, formData.id, formData);
      } else {
        await guardsApi.create(token, formData);
      }
      await loadGuards();
      setShowModal(false);
      setFormData(emptyForm);
    } catch (err) { alert(err.message); }
  };

  const handleDelete = async (id) => {
    if (!hasPermission(user.role, 'delete')) return alert('No permission');
    if (confirm('Delete this guard?')) {
      try { await guardsApi.remove(token, id); await loadGuards(); }
      catch (err) { alert(err.message); }
    }
  };

  const columns = [
    { header: 'Name', render: (row) => <div className="flex items-center gap-3"><Avatar name={row.name} /><span className="font-semibold">{row.name}</span></div> },
    { header: 'Phone', render: (row) => <span className="font-mono">{row.phone}</span> },
    { header: 'Salary', render: (row) => <span className="font-mono">₹{row.salary?.toLocaleString()}</span> },
    { header: 'Site', render: (row) => <span>{row.assignedSite?.siteName || 'Unassigned'}</span> },
    { header: 'Status', render: (row) => <Badge status={row.status === 'active' ? 'Active' : 'Inactive'}>{row.status}</Badge> },
    {
      header: 'Actions', render: (row) => (
        <div className="flex gap-2">
          <Button size="sm" variant="secondary" icon={Edit2} onClick={() => openEdit(row)} />
          {hasPermission(user.role, 'delete') && <Button size="sm" variant="danger" icon={Trash2} onClick={() => handleDelete(row.id || row._id)} />}
        </div>
      )
    },
  ];

  return (
    <div className="w-full min-h-full p-6 lg:p-10">
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-secondary-900">Guard Management</h1>
          <p className="text-sm text-secondary-500 mt-2">Manage security personnel</p>
        </div>
        {hasPermission(user.role, 'create') && <Button icon={Plus} onClick={openCreate}>Add Guard</Button>}
      </div>
      <div className="bg-white border border-secondary-200 rounded-2xl shadow-sm overflow-hidden">
        <Table columns={columns} data={guards} emptyMessage="No guards yet" />
      </div>
      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title={formData.id ? 'Edit Guard' : 'Add New Guard'}>
        <form onSubmit={handleSubmit} className="space-y-5">
          <Input label="Full Name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
          <Input label="Phone" type="tel" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} required />
          <Input label="Salary" type="number" min="0" value={formData.salary} onChange={(e) => setFormData({ ...formData, salary: e.target.value })} required />
          <Button type="submit" fullWidth>{formData.id ? 'Update Guard' : 'Add Guard'}</Button>
        </form>
      </Modal>
    </div>
  );
};

export default Guards;
