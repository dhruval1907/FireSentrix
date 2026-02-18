import { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2 } from 'lucide-react';
import { clientsService } from '../services/storage';
import { hasPermission } from '../utils/helpers';
import { useAuth } from '../context/AuthContext';
import Button from '../components/common/Button';
import Modal from '../components/common/Modal';
import Input from '../components/common/Input';
import Table from '../components/common/Table';
import Badge from '../components/common/Badge';

const Clients = () => {
  const { user } = useAuth();
  const [clients, setClients] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ name: '', contactPerson: '', phone: '', email: '', status: 'Active' });

  useEffect(() => { setClients(clientsService.getAll()); }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    clientsService.create(formData);
    setClients(clientsService.getAll());
    setShowModal(false);
    setFormData({ name: '', contactPerson: '', phone: '', email: '', status: 'Active' });
  };

  const handleDelete = (id) => {
    if (!hasPermission(user.role, 'delete')) return alert('You do not have permission to delete');
    if (confirm('Delete this client?')) {
      clientsService.delete(id);
      setClients(clientsService.getAll());
    }
  };

  const columns = [
    { header: 'Client Name', accessor: 'name', render: (row) => <span className="font-semibold">{row.name}</span> },
    { header: 'Contact Person', accessor: 'contactPerson' },
    { header: 'Phone', accessor: 'phone', render: (row) => <span className="font-mono">{row.phone}</span> },
    { header: 'Sites', accessor: 'sitesCount' },
    { header: 'Guards', accessor: 'guardsCount' },
    { header: 'Status', render: (row) => <Badge status={row.status}>{row.status}</Badge> },
    { header: 'Actions', render: (row) => (
      <div className="flex gap-2">
        <Button size="sm" variant="secondary" icon={Edit2} />
        {hasPermission(user.role, 'delete') && <Button size="sm" variant="danger" icon={Trash2} onClick={() => handleDelete(row.id)} />}
      </div>
    )},
  ];

  return (
    <div className="w-full min-h-full p-6 lg:p-10">
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-secondary-900">Client & Sites Management</h1>
          <p className="text-sm text-secondary-500 mt-2">Manage your clients and locations</p>
        </div>
        {hasPermission(user.role, 'create') && <Button icon={Plus} onClick={() => setShowModal(true)}>Add Client</Button>}
      </div>

      <div className="bg-white border border-secondary-200 rounded-2xl shadow-sm overflow-hidden">
        <Table columns={columns} data={clients} emptyMessage="No clients yet" />
      </div>

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Add New Client">
        <form onSubmit={handleSubmit} className="space-y-5">
          <Input label="Client Name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
          <Input label="Contact Person" value={formData.contactPerson} onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })} required />
          <Input label="Phone" type="tel" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} required />
          <Input label="Email" type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} required />
          <Button type="submit" fullWidth>Add Client</Button>
        </form>
      </Modal>
    </div>
  );
};

export default Clients;
