import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Bot, Send, User, Sparkles, Loader2 } from 'lucide-react';

const AIAssistant = () => {
  const [messages, setMessages] = useState([
    { id: 1, type: 'bot', text: 'Hello! I am your JanaSeva AI Assistant. How can I help you today? You can ask me about tracking complaints, reporting issues, or general city services.' }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg = { id: Date.now(), type: 'user', text: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    // Simulate AI response based on keywords
    setTimeout(() => {
      let botResponse = '';
      const lowercaseInput = userMsg.text.toLowerCase();

      if (lowercaseInput.includes('track') || lowercaseInput.includes('status')) {
        botResponse = 'You can track your complaint by navigating to the "Track Complaint" page and entering your Complaint ID. Would you like me to guide you there?';
      } else if (lowercaseInput.includes('report') || lowercaseInput.includes('issue') || lowercaseInput.includes('pothole') || lowercaseInput.includes('garbage')) {
        botResponse = 'To report a new issue, please log in and go to the "Report Issue" section. You can upload photos and provide location details for faster resolution.';
      } else if (lowercaseInput.includes('hello') || lowercaseInput.includes('hi')) {
        botResponse = 'Hello there! I am ready to assist you with any JanaSeva services.';
      } else {
        botResponse = 'I understand you are asking about "' + userMsg.text + '". Currently, my knowledge is limited to reporting and tracking complaints. Please contact the helpdesk for more specific queries.';
      }

      setMessages(prev => [...prev, { id: Date.now() + 1, type: 'bot', text: botResponse }]);
      setIsTyping(false);
    }, 1500);
  };

  return (
    <div className="max-w-4xl mx-auto w-full h-[calc(100vh-8rem)] flex flex-col">
      <div className="mb-6 text-center">
        <h1 className="text-3xl font-bold text-white mb-2 flex items-center justify-center gap-2">
          <Bot className="text-neon" size={32} />
          AI Assistant
        </h1>
        <p className="text-gray-400">Get instant answers about government services.</p>
      </div>

      <div className="glass-panel flex-grow flex flex-col overflow-hidden relative">
        {/* Background decorative element */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-neon/5 rounded-full blur-[80px] pointer-events-none"></div>
        
        {/* Chat Area */}
        <div className="flex-grow overflow-y-auto p-4 md:p-6 space-y-6 z-10">
          {messages.map((msg) => (
            <motion.div 
              key={msg.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex gap-3 max-w-[85%] ${msg.type === 'user' ? 'ml-auto flex-row-reverse' : ''}`}
            >
              <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${msg.type === 'user' ? 'bg-neon/20 border border-neon/50 text-neon' : 'bg-darker border border-gray-700 text-gray-300'}`}>
                {msg.type === 'user' ? <User size={16} /> : <Bot size={16} />}
              </div>
              <div className={`p-4 rounded-2xl ${
                msg.type === 'user' 
                  ? 'bg-neon/10 border border-neon/30 text-white rounded-tr-sm' 
                  : 'bg-dark/80 border border-white/10 text-gray-200 rounded-tl-sm'
              }`}>
                {msg.text}
              </div>
            </motion.div>
          ))}
          
          {isTyping && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex gap-3 max-w-[85%]"
            >
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-darker border border-gray-700 text-gray-300 flex items-center justify-center">
                <Bot size={16} />
              </div>
              <div className="p-4 rounded-2xl bg-dark/80 border border-white/10 text-gray-200 rounded-tl-sm flex items-center gap-2">
                <Loader2 size={16} className="animate-spin text-neon" />
                <span className="text-sm">AI is thinking...</span>
              </div>
            </motion.div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-4 bg-dark/80 border-t border-white/10 z-10">
          <form onSubmit={handleSend} className="relative flex items-center">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask me anything..."
              className="w-full bg-darker border border-neon/30 rounded-full pl-5 pr-12 py-4 text-white focus:outline-none focus:border-neon focus:ring-1 focus:ring-neon transition-all duration-300"
            />
            <button
              type="submit"
              disabled={!input.trim() || isTyping}
              className="absolute right-2 p-2.5 rounded-full bg-neon text-darker disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 transition-transform"
            >
              <Send size={18} className={isTyping ? 'opacity-0' : 'opacity-100'} />
              {isTyping && <Sparkles size={18} className="absolute top-2.5 left-2.5 animate-pulse" />}
            </button>
          </form>
          <div className="text-center mt-2">
            <span className="text-xs text-gray-500 flex items-center justify-center gap-1">
              <Sparkles size={10} className="text-neon" />
              Responses are generated by AI and may not be 100% accurate.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIAssistant;
