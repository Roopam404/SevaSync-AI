import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, FileText, Tag, Upload, CheckCircle } from 'lucide-react';
import { saveComplaint } from '../utils/dataStore';
import { useNavigate } from 'react-router-dom';

const ReportIssue = ({ user }) => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [complaintId, setComplaintId] = useState('');
  
  const [formData, setFormData] = useState({
    title: '',
    type: 'Infrastructure',
    location: '',
    description: ''
  });

  const issueTypes = [
    'Infrastructure',
    'Electricity',
    'Sanitation',
    'Water Supply',
    'Public Safety',
    'Other'
  ];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      const newId = 'CMP' + Math.floor(1000 + Math.random() * 9000);
      const complaint = {
        id: newId,
        userId: user.id,
        userName: user.name,
        email: user.email,
        ...formData,
        status: 'Pending',
        date: new Date().toISOString().split('T')[0]
      };
      
      saveComplaint(complaint);
      setComplaintId(newId);
      setIsSubmitting(false);
      setShowSuccess(true);
      
      setTimeout(() => {
        navigate('/dashboard');
      }, 3000);
    }, 1500);
  };

  return (
    <div className="max-w-2xl mx-auto w-full">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-white mb-2">Report an Issue</h1>
        <p className="text-gray-400">Help us improve the city by reporting problems in your area.</p>
      </div>

      <AnimatePresence>
        {showSuccess && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="mb-6 p-4 rounded-lg bg-green-500/10 border border-green-500/30 flex items-center gap-3 text-green-400"
          >
            <CheckCircle size={24} />
            <div>
              <p className="font-medium">Issue Reported Successfully!</p>
              <p className="text-sm opacity-80">Your tracking ID is <span className="font-mono font-bold text-white">{complaintId}</span></p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-panel p-6 md:p-8"
      >
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Issue Title</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FileText size={18} className="text-gray-500" />
              </div>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                className="input-field pl-10"
                placeholder="Brief description of the problem"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Category</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Tag size={18} className="text-gray-500" />
                </div>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  className="input-field pl-10 appearance-none bg-dark/80"
                >
                  {issueTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Location</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MapPin size={18} className="text-gray-500" />
                </div>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  required
                  className="input-field pl-10"
                  placeholder="Street name, landmark"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Detailed Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              rows="4"
              className="input-field resize-none"
              placeholder="Provide as much detail as possible..."
            ></textarea>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Attach Photo (Optional)</label>
            <div className="border-2 border-dashed border-gray-600 rounded-lg p-6 text-center hover:border-neon/50 transition-colors cursor-pointer bg-dark/30">
              <Upload size={24} className="mx-auto text-gray-400 mb-2" />
              <p className="text-sm text-gray-400">Click to upload or drag and drop</p>
              <p className="text-xs text-gray-500 mt-1">SVG, PNG, JPG or GIF (max. 5MB)</p>
            </div>
          </div>

          <button 
            type="submit" 
            disabled={isSubmitting}
            className={`neon-button-solid w-full py-3 text-lg ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center gap-2">
                <div className="w-5 h-5 border-2 border-darker border-t-transparent rounded-full animate-spin"></div>
                Submitting...
              </span>
            ) : 'Submit Report'}
          </button>
        </form>
      </motion.div>
    </div>
  );
};

export default ReportIssue;
