import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Bot, Shield, Zap, Activity } from 'lucide-react';

const Landing = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" }
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-8rem)] text-center w-full">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="w-full max-w-4xl flex flex-col items-center"
      >
        <motion.div variants={itemVariants} className="inline-block mb-4 px-4 py-1.5 rounded-full glass-panel text-neon text-sm font-medium border-neon/30">
          <span className="flex items-center gap-2">
            <Zap size={14} className="fill-neon" /> 
            Welcome to the Future of Governance
          </span>
        </motion.div>
        
        <motion.h1 variants={itemVariants} className="text-5xl md:text-7xl font-bold mb-6 tracking-tight">
          Next-Gen <span className="text-transparent bg-clip-text bg-gradient-to-r from-neon to-purple-500">Citizen Services</span>
        </motion.h1>
        
        <motion.p variants={itemVariants} className="text-lg md:text-xl text-gray-400 mb-10 max-w-2xl mx-auto leading-relaxed">
          JanaSeva is an AI-powered platform designed to streamline your interactions with government services. Report issues, track progress, and get instant assistance.
        </motion.p>
        
        <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4 justify-center w-full sm:w-auto">
          <Link to="/report" className="neon-button-solid text-center py-3 px-8 text-lg w-full sm:w-auto">
            Report an Issue
          </Link>
          <Link to="/track" className="glass-panel text-white border border-white/10 hover:border-neon/50 px-8 py-3 rounded-lg transition-all duration-300 font-medium text-center w-full sm:w-auto">
            Track Complaint
          </Link>
          <Link to="/login" className="neon-button text-center py-3 px-8 text-lg w-full sm:w-auto">
            Login
          </Link>
        </motion.div>

        <motion.div 
          variants={containerVariants}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-24 w-full text-left"
        >
          <motion.div variants={itemVariants} className="glass-panel p-6 rounded-2xl hover:border-neon/50 transition-all duration-300 group">
            <div className="w-12 h-12 bg-neon/10 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Bot className="text-neon" size={24} />
            </div>
            <h3 className="text-xl font-semibold mb-2 text-white">AI Assistant</h3>
            <p className="text-gray-400 text-sm">Get instant answers to your queries and guidance on filing reports using our advanced AI.</p>
          </motion.div>

          <motion.div variants={itemVariants} className="glass-panel p-6 rounded-2xl hover:border-neon/50 transition-all duration-300 group">
            <div className="w-12 h-12 bg-purple-500/10 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Activity className="text-purple-400" size={24} />
            </div>
            <h3 className="text-xl font-semibold mb-2 text-white">Live Tracking</h3>
            <p className="text-gray-400 text-sm">Monitor the real-time status of your complaints with detailed updates from officials.</p>
          </motion.div>

          <motion.div variants={itemVariants} className="glass-panel p-6 rounded-2xl hover:border-neon/50 transition-all duration-300 group">
            <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
              <Shield className="text-blue-400" size={24} />
            </div>
            <h3 className="text-xl font-semibold mb-2 text-white">Secure Portal</h3>
            <p className="text-gray-400 text-sm">Your data is protected with enterprise-grade security and transparent data handling.</p>
          </motion.div>
        </motion.div>

        {/* Footer */}
        <motion.footer 
          variants={itemVariants}
          className="w-full mt-24 border-t border-white/10 pt-8 pb-4 text-center text-gray-500 text-sm"
        >
          <p>&copy; {new Date().getFullYear()} JanaSeva. All rights reserved.</p>
          <div className="flex justify-center gap-6 mt-4">
            <a href="#" className="hover:text-neon transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-neon transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-neon transition-colors">Contact Support</a>
          </div>
        </motion.footer>

      </motion.div>
    </div>
  );
};

export default Landing;
