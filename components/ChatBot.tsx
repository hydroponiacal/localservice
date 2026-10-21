
import React, { useState, useRef, useEffect } from 'react';
import { chatWithGemini } from '../services/gemini';

const ChatBot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{role: string, text: string}[]>([
    { role: 'model', text: "Hi there! I'm Mo, your neighborly guide. Looking for a hand with something around the house?" }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg = { role: 'user', text: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    try {
      const history = messages.concat(userMsg).map(m => ({
        role: m.role,
        parts: [{ text: m.text }]
      }));
      const response = await chatWithGemini(history);
      setMessages(prev => [...prev, { role: 'model', text: response }]);
    } catch (err) {
      setMessages(prev => [...prev, { role: 'model', text: "Sorry, neighbor! My brain's a bit foggy today. Try asking again?" }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {isOpen ? (
        <div className="bg-white w-80 md:w-96 h-[500px] rounded-2xl shadow-2xl flex flex-col border border-stone-200 overflow-hidden">
          <div className="bg-red-600 p-4 text-white flex justify-between items-center">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center font-bold">M</div>
              <span className="font-bold">Ask Mo</span>
            </div>
            <button onClick={() => setIsOpen(false)} className="hover:bg-red-700 p-1 rounded transition-colors">
              <i className="fa-solid fa-xmark"></i>
            </button>
          </div>
          
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 bg-stone-50">
            {messages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] p-3 rounded-2xl text-sm ${
                  msg.role === 'user' 
                    ? 'bg-red-600 text-white rounded-tr-none' 
                    : 'bg-white text-stone-800 border border-stone-200 rounded-tl-none'
                }`}>
                  {msg.text}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-white p-3 rounded-2xl text-sm border border-stone-200 rounded-tl-none text-stone-400 italic">
                  Mo is thinking...
                </div>
              </div>
            )}
          </div>

          <div className="p-4 border-t border-stone-100 bg-white">
            <div className="flex gap-2">
              <input 
                type="text" 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Ask Mo anything..."
                className="flex-1 text-sm outline-none p-2 border border-stone-200 rounded-lg focus:border-red-600"
              />
              <button onClick={handleSend} className="bg-red-600 text-white p-2 rounded-lg hover:bg-red-700 transition-colors">
                <i className="fa-solid fa-paper-plane"></i>
              </button>
            </div>
          </div>
        </div>
      ) : (
        <button 
          onClick={() => setIsOpen(true)}
          className="bg-red-600 hover:bg-red-700 text-white w-14 h-14 rounded-full shadow-xl flex items-center justify-center text-2xl transition-all transform hover:scale-110"
        >
          <i className="fa-solid fa-comment-dots"></i>
        </button>
      )}
    </div>
  );
};

export default ChatBot;
