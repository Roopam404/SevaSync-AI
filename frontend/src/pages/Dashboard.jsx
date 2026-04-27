import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FileText, Clock, CheckCircle, AlertTriangle } from 'lucide-react';
import { getComplaints } from '../utils/dataStore';

const Dashboard = ({ user }) => {
  const [complaints, setComplaints] = useState([]);

  useEffect(() => {
    const allComplaints = getComplaints();
    // For admin, maybe show all, but dashboard is usually user-specific. Let's show user specific.
    const userComplaints = allComplaints.filter(c => c.email === user.email || c.userId === user.id || c.userName === user.name || (user.email && c.email === user.email));
    
    // Fallback logic for mock data if user is new
    if (userComplaints.length === 0 && user.email === 'citizen@example.com') {
        const defaultData = allComplaints.filter(c => c.userId === 'user1');
        setComplaints(defaultData);
    } else {
        setComplaints(userComplaints);
    }
  }, [user]);

  const stats = {
    total: complaints.length,
    pending: complaints.filter(c => c.status === 'Pending').length,
    inProgress: complaints.filter(c => c.status === 'In Progress').length,
    resolved: complaints.filter(c => c.status === 'Resolved').length
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'Pending': return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/30';
      case 'In Progress': return 'text-blue-400 bg-blue-400/10 border-blue-400/30';
      case 'Resolved': return 'text-green-400 bg-green-400/10 border-green-400/30';
      default: return 'text-gray-400 bg-gray-400/10 border-gray-400/30';
    }
  };

  return (
    <div className="w-full">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Welcome back, {user.name}</h1>
        <p className="text-gray-400">Here is an overview of your citizen service requests.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <motion.div initial={{opacity:0, y:20}} animate={{opacity:1, y:0}} transition={{delay:0.1}} className="glass-panel p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-400 font-medium">Total Reports</h3>
            <FileText className="text-neon" size={20} />
          </div>
          <p className="text-3xl font-bold text-white">{stats.total}</p>
        </motion.div>
        
        <motion.div initial={{opacity:0, y:20}} animate={{opacity:1, y:0}} transition={{delay:0.2}} className="glass-panel p-6 border-yellow-400/20">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-400 font-medium">Pending</h3>
            <AlertTriangle className="text-yellow-400" size={20} />
          </div>
          <p className="text-3xl font-bold text-white">{stats.pending}</p>
        </motion.div>

        <motion.div initial={{opacity:0, y:20}} animate={{opacity:1, y:0}} transition={{delay:0.3}} className="glass-panel p-6 border-blue-400/20">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-400 font-medium">In Progress</h3>
            <Clock className="text-blue-400" size={20} />
          </div>
          <p className="text-3xl font-bold text-white">{stats.inProgress}</p>
        </motion.div>

        <motion.div initial={{opacity:0, y:20}} animate={{opacity:1, y:0}} transition={{delay:0.4}} className="glass-panel p-6 border-green-400/20">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-gray-400 font-medium">Resolved</h3>
            <CheckCircle className="text-green-400" size={20} />
          </div>
          <p className="text-3xl font-bold text-white">{stats.resolved}</p>
        </motion.div>
      </div>

      <motion.div initial={{opacity:0}} animate={{opacity:1}} transition={{delay:0.5}} className="glass-panel overflow-hidden">
        <div className="p-6 border-b border-white/10">
          <h2 className="text-xl font-bold text-white">Recent Reports</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white/5 text-gray-400 text-sm">
                <th className="p-4 font-medium">ID</th>
                <th className="p-4 font-medium">Title</th>
                <th className="p-4 font-medium">Category</th>
                <th className="p-4 font-medium">Date</th>
                <th className="p-4 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {complaints.length > 0 ? (
                complaints.map((complaint) => (
                  <tr key={complaint.id} className="hover:bg-white/5 transition-colors">
                    <td className="p-4 font-mono text-sm text-gray-300">{complaint.id}</td>
                    <td className="p-4 font-medium text-white">{complaint.title}</td>
                    <td className="p-4 text-gray-400">{complaint.type}</td>
                    <td className="p-4 text-gray-400">{complaint.date}</td>
                    <td className="p-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(complaint.status)}`}>
                        {complaint.status}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="p-8 text-center text-gray-500">
                    No reports found. Start by reporting an issue.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
};

export default Dashboard;
