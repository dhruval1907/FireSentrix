import { useState, useEffect } from 'react';
import { Plus } from 'lucide-react';
import { equipmentService } from '../services/storage';
import { isMaintenanceOverdue, formatDate } from '../utils/helpers';
import Button from '../components/common/Button';
import Modal from '../components/common/Modal';
import Input from '../components/common/Input';
import Table from '../components/common/Table';
import Badge from '../components/common/Badge';

const Equipment = () => {
  const [equipment, setEquipment] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ name: '', quantity: '', location: '', installDate: '', maintenanceInterval: 6 });

  useEffect(() => { setEquipment(equipmentService.getAll()); }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    equipmentService.create(formData);
    setEquipment(equipmentService.getAll());
    setShowModal(false);
    setFormData({ name: '', quantity: '', location: '', installDate: '', maintenanceInterval: 6 });
  };

  const columns = [
    { header: 'Equipment', accessor: 'name', render: (row) => <span className="font-semibold">{row.name}</span> },
    { header: 'Qty', accessor: 'quantity', render: (row) => <span className="font-mono">{row.quantity}</span> },
    { header: 'Location', accessor: 'location' },
    { header: 'Install Date', render: (row) => <span className="font-mono">{formatDate(row.installDate)}</span> },
    { header: 'Next Maintenance', render: (row) => {
      const overdue = isMaintenanceOverdue(row.nextMaintenance);
      return <span className={`font-mono ${overdue ? 'text-red-600 font-bold' : ''}`}>{formatDate(row.nextMaintenance)} {overdue && '(Overdue)'}</span>;
    }},
    { header: 'Status', render: (row) => <Badge status={isMaintenanceOverdue(row.nextMaintenance) ? 'Overdue' : row.status}>{isMaintenanceOverdue(row.nextMaintenance) ? 'Overdue' : row.status}</Badge> },
  ];

  return (
    <div className="w-full min-h-full p-6 lg:p-10">
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-secondary-900">Fire Equipment</h1>
          <p className="text-sm text-secondary-500 mt-2">Track equipment and maintenance</p>
        </div>
        <Button icon={Plus} onClick={() => setShowModal(true)}>Add Equipment</Button>
      </div>

      <div className="bg-white border border-secondary-200 rounded-2xl shadow-sm overflow-hidden">
        <Table columns={columns} data={equipment} emptyMessage="No equipment yet" />
      </div>

      <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Add Equipment">
        <form onSubmit={handleSubmit} className="space-y-5">
          <Input label="Equipment Name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
          <Input label="Quantity" type="number" min="1" value={formData.quantity} onChange={(e) => setFormData({ ...formData, quantity: e.target.value })} required />
          <Input label="Location" value={formData.location} onChange={(e) => setFormData({ ...formData, location: e.target.value })} required />
          <Input label="Install Date" type="date" value={formData.installDate} onChange={(e) => setFormData({ ...formData, installDate: e.target.value })} required />
          <Input label="Maintenance Interval (months)" type="number" min="1" value={formData.maintenanceInterval} onChange={(e) => setFormData({ ...formData, maintenanceInterval: e.target.value })} required />
          <Button type="submit" fullWidth>Add Equipment</Button>
        </form>
      </Modal>
    </div>
  );
};

export default Equipment;
