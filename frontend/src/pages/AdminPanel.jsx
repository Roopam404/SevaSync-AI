import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, Filter, Search, Edit2, Check, X, AlertCircle } from 'lucide-react';
import { getComplaints, updateComplaintStatus } from '../utils/dataStore';

const AdminPanel = () => {
  const [complaints, setComplaints] = useState([]);
  const [filter, setFilter] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [newStatus, setNewStatus] = useState('');

  useEffect(() => {
    setComplaints(getComplaints());
  }, []);

  const handleStatusUpdate = (id) => {
    if (newStatus) {
      const updated = updateComplaintStatus(id, newStatus);
      setComplaints(updated);
      setEditingId(null);
      setNewStatus('');
    }
  };

  const filteredComplaints = complaints.filter(c => {
    const matchesFilter = filter === 'All' || c.status === filter;
    const matchesSearch = c.id.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          c.location.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const getStatusColor = (status) => {
    switch(status) {
      case 'Resolved': return 'text-green-400 bg-green-400/10 border-green-400/20';
      case 'In Progress': return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20';
      default: return 'text-red-400 bg-red-400/10 border-red-400/20';
    }
  };

  return (
    <div className="max-w-6xl mx-auto w-full">
      <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-2">
            <Shield className="text-neon" />
            Admin Dashboard
          </h1>
          <p className="text-gray-400">Manage and update citizen complaints.</p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <div className="relative">
            <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
            <input 
              type="text"
              placeholder="Search ID, title, location..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-field pl-10 py-2 w-full sm:w-64"
            />
          </div>
          <div className="relative">
            <Filter size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
            <select 
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="input-field pl-10 py-2 appearance-none bg-dark/80 min-w-[140px]"
            >
              <option value="All">All Status</option>
              <option value="Pending">Pending</option>
              <option value="In Progress">In Progress</option>
              <option value="Resolved">Resolved</option>
            </select>
          </div>
        </div>
      </div>

      <div className="glass-panel overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-dark/50 border-b border-white/10">
                <th className="p-4 text-sm font-semibold text-gray-300">ID & Date</th>
                <th className="p-4 text-sm font-semibold text-gray-300">User Details</th>
                <th className="p-4 text-sm font-semibold text-gray-300">Issue</th>
                <th className="p-4 text-sm font-semibold text-gray-300">Status</th>
                <th className="p-4 text-sm font-semibold text-gray-300 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              <AnimatePresence>
                {filteredComplaints.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="p-8 text-center text-gray-400">
                      <div className="flex flex-col items-center gap-2">
                        <AlertCircle size={32} className="text-gray-500 mb-2" />
                        <p>No complaints found matching your criteria.</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredComplaints.map((complaint) => (
                    <motion.tr 
                      key={complaint.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="border-b border-white/5 hover:bg-white/5 transition-colors"
                    >
                      <td className="p-4 align-top">
                        <div className="font-mono text-neon font-bold">{complaint.id}</div>
                        <div className="text-xs text-gray-500 mt-1">{complaint.date}</div>
                      </td>
                      <td className="p-4 align-top">
                        <div className="text-gray-200">{complaint.userName}</div>
                        <div className="text-xs text-gray-500 mt-1">{complaint.userId}</div>
                      </td>
                      <td className="p-4 align-top max-w-xs">
                        <div className="font-medium text-gray-200">{complaint.title}</div>
                        <div className="text-xs text-neon mt-1 bg-neon/10 inline-block px-2 py-0.5 rounded border border-neon/20">{complaint.type}</div>
                        <div className="text-sm text-gray-400 mt-2 truncate">{complaint.location}</div>
                      </td>
                      <td className="p-4 align-top">
                        {editingId === complaint.id ? (
                          <select 
                            value={newStatus || complaint.status}
                            onChange={(e) => setNewStatus(e.target.value)}
                            className="input-field py-1 px-2 text-sm bg-darker"
                            autoFocus
                          >
                            <option value="Pending">Pending</option>
                            <option value="In Progress">In Progress</option>
                            <option value="Resolved">Resolved</option>
                          </select>
                        ) : (
                          <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium border ${getStatusColor(complaint.status)}`}>
                            {complaint.status}
                          </span>
                        )}
                      </td>
                      <td className="p-4 align-top text-right">
                        {editingId === complaint.id ? (
                          <div className="flex items-center justify-end gap-2">
                            <button 
                              onClick={() => handleStatusUpdate(complaint.id)}
                              className="p-1.5 bg-green-500/20 text-green-400 rounded hover:bg-green-500/30 transition-colors"
                              title="Save"
                            >
                              <Check size={16} />
                            </button>
                            <button 
                              onClick={() => {
                                setEditingId(null);
                                setNewStatus('');
                              }}
                              className="p-1.5 bg-red-500/20 text-red-400 rounded hover:bg-red-500/30 transition-colors"
                              title="Cancel"
                            >
                              <X size={16} />
                            </button>
                          </div>
                        ) : (
                          <button 
                            onClick={() => {
                              setEditingId(complaint.id);
                              setNewStatus(complaint.status);
                            }}
                            className="p-1.5 text-gray-400 hover:text-neon hover:bg-neon/10 rounded transition-colors"
                            title="Edit Status"
                          >
                            <Edit2 size={16} />
                          </button>
                        )}
                      </td>
                    </motion.tr>
                  ))
                )}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
