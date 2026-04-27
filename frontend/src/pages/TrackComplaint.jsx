import { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, MapPin, Calendar, CheckCircle, Clock, AlertTriangle } from 'lucide-react';
import { getComplaints } from '../utils/dataStore';

const TrackComplaint = () => {
  const [searchId, setSearchId] = useState('');
  const [result, setResult] = useState(null);
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchId.trim()) return;

    const complaints = getComplaints();
    const found = complaints.find(c => c.id.toLowerCase() === searchId.toLowerCase().trim());
    
    setResult(found || null);
    setHasSearched(true);
  };

  const getStatusIcon = (status) => {
    switch(status) {
      case 'Resolved': return <CheckCircle className="text-green-400 w-12 h-12" />;
      case 'In Progress': return <Clock className="text-blue-400 w-12 h-12" />;
      default: return <AlertTriangle className="text-yellow-400 w-12 h-12" />;
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'Resolved': return 'text-green-400 bg-green-400/10 border-green-400/30';
      case 'In Progress': return 'text-blue-400 bg-blue-400/10 border-blue-400/30';
      default: return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/30';
    }
  };

  return (
    <div className="max-w-3xl mx-auto w-full">
      <div className="mb-10 text-center">
        <h1 className="text-3xl font-bold text-white mb-2">Track Complaint</h1>
        <p className="text-gray-400">Enter your complaint ID to check the real-time status.</p>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-panel p-6 mb-8"
      >
        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-grow">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search size={20} className="text-neon" />
            </div>
            <input
              type="text"
              value={searchId}
              onChange={(e) => setSearchId(e.target.value)}
              className="input-field pl-12 py-4 text-lg"
              placeholder="e.g. CMP1001"
            />
          </div>
          <button type="submit" className="neon-button-solid py-4 px-8 text-lg whitespace-nowrap">
            Track Status
          </button>
        </form>
      </motion.div>

      {hasSearched && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mt-8"
        >
          {result ? (
            <div className="glass-panel overflow-hidden relative">
              <div className={`absolute top-0 left-0 w-full h-2 ${
                result.status === 'Resolved' ? 'bg-green-500' : 
                result.status === 'In Progress' ? 'bg-blue-500' : 'bg-yellow-500'
              }`}></div>
              
              <div className="p-8">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-8">
                  <div className="flex items-center gap-4">
                    <div className={`p-4 rounded-full bg-dark/50 shadow-inner`}>
                      {getStatusIcon(result.status)}
                    </div>
                    <div>
                      <p className="text-sm text-gray-400 font-mono mb-1">ID: {result.id}</p>
                      <h2 className="text-2xl font-bold text-white">{result.title}</h2>
                    </div>
                  </div>
                  <div className={`px-4 py-2 rounded-full border ${getStatusColor(result.status)} font-bold text-lg`}>
                    {result.status}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-dark/30 p-6 rounded-xl border border-white/5">
                  <div>
                    <h3 className="text-sm text-gray-500 mb-1 flex items-center gap-2">
                      <Tag size={16} /> Category
                    </h3>
                    <p className="text-white font-medium">{result.type}</p>
                  </div>
                  <div>
                    <h3 className="text-sm text-gray-500 mb-1 flex items-center gap-2">
                      <MapPin size={16} /> Location
                    </h3>
                    <p className="text-white font-medium">{result.location}</p>
                  </div>
                  <div>
                    <h3 className="text-sm text-gray-500 mb-1 flex items-center gap-2">
                      <Calendar size={16} /> Reported On
                    </h3>
                    <p className="text-white font-medium">{result.date}</p>
                  </div>
                  <div>
                    <h3 className="text-sm text-gray-500 mb-1 flex items-center gap-2">
                      <FileText size={16} /> Description
                    </h3>
                    <p className="text-white font-medium">{result.description}</p>
                  </div>
                </div>
                
                {/* Timeline Visualization */}
                <div className="mt-8 pt-8 border-t border-white/10">
                  <h3 className="text-lg font-bold text-white mb-6">Progress Timeline</h3>
                  <div className="relative flex justify-between">
                    <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-800 -translate-y-1/2 z-0"></div>
                    <div className={`absolute top-1/2 left-0 h-1 transition-all duration-1000 -translate-y-1/2 z-0 ${
                      result.status === 'Resolved' ? 'w-full bg-neon' : 
                      result.status === 'In Progress' ? 'w-1/2 bg-neon' : 'w-0'
                    }`}></div>
                    
                    <div className="relative z-10 flex flex-col items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-neon flex items-center justify-center border-4 border-card shadow-[0_0_10px_rgba(0,240,255,0.5)]">
                        <CheckCircle size={14} className="text-darker" />
                      </div>
                      <span className="text-xs font-medium text-neon">Reported</span>
                    </div>
                    
                    <div className="relative z-10 flex flex-col items-center gap-2">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center border-4 border-card transition-colors duration-500 ${
                        result.status !== 'Pending' ? 'bg-neon shadow-[0_0_10px_rgba(0,240,255,0.5)]' : 'bg-gray-800'
                      }`}>
                         {result.status !== 'Pending' && <CheckCircle size={14} className="text-darker" />}
                      </div>
                      <span className={`text-xs font-medium ${result.status !== 'Pending' ? 'text-neon' : 'text-gray-500'}`}>In Progress</span>
                    </div>
                    
                    <div className="relative z-10 flex flex-col items-center gap-2">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center border-4 border-card transition-colors duration-500 ${
                        result.status === 'Resolved' ? 'bg-neon shadow-[0_0_10px_rgba(0,240,255,0.5)]' : 'bg-gray-800'
                      }`}>
                        {result.status === 'Resolved' && <CheckCircle size={14} className="text-darker" />}
                      </div>
                      <span className={`text-xs font-medium ${result.status === 'Resolved' ? 'text-neon' : 'text-gray-500'}`}>Resolved</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="glass-panel p-10 text-center">
              <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertTriangle className="text-red-400" size={32} />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Complaint Not Found</h3>
              <p className="text-gray-400">We couldn't find any complaint matching ID "{searchId}". Please check the ID and try again.</p>
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
};

export default TrackComplaint;
