import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const AiBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Hi there! I am your Dream2Build assistant. How can I help you today?' }
  ]);
  const [input, setInput] = useState('');
  
  const blobRef = useRef<HTMLDivElement>(null);
  const [eyeTransform, setEyeTransform] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!blobRef.current) return;
      const rect = blobRef.current.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      
      const deltaX = e.clientX - centerX;
      const deltaY = e.clientY - centerY;
      
      const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
      const maxEyeMove = 6; // max pixels the eye can move
      const maxDistance = 500; // distance at which eye movement maxes out
      
      const moveRatio = Math.min(distance / maxDistance, 1);
      
      const moveX = (deltaX / distance) * maxEyeMove * moveRatio || 0;
      const moveY = (deltaY / distance) * maxEyeMove * moveRatio || 0;
      
      setEyeTransform({ x: moveX, y: moveY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const handleSend = () => {
    if (!input.trim()) return;
    setMessages([...messages, { role: 'user', content: input }]);
    setInput('');
    setTimeout(() => {
      setMessages(prev => [...prev, { role: 'assistant', content: 'This is a demo response from the AI bot!' }]);
    }, 1000);
  };

  return (
    <>
      <style>
        {`
          .ai-bot-blob {
            width: 64px;
            height: 64px;
            background: linear-gradient(135deg, #D97A3F 0%, #c66a30 100%);
            animation: blob-bounce 5s infinite cubic-bezier(0.4, 0, 0.2, 1);
            border-radius: 40% 60% 70% 30% / 40% 50% 60% 50%;
            position: relative;
            display: flex;
            justify-content: center;
            align-items: center;
            overflow: hidden;
            box-shadow: inset 5px 5px 15px rgba(255, 255, 255, 0.3),
                        inset -5px -5px 15px rgba(0, 0, 0, 0.3),
                        0 10px 25px -5px rgba(217, 122, 63, 0.5);
            cursor: pointer;
            transition: transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          }

          .ai-bot-blob:hover {
            transform: scale(1.1);
          }

          .eye-container {
            position: absolute;
            top: 35%;
            width: 8px;
            height: 12px;
            transition: transform 0.1s ease-out;
          }

          .eye-left {
            left: 28%;
          }

          .eye-right {
            right: 28%;
          }

          .ai-bot-eye {
            width: 100%;
            height: 100%;
            background-color: #FAF8F3;
            border-radius: 50%;
            animation: blink 4s infinite cubic-bezier(0.4, 0, 0.2, 1);
          }

          @keyframes blob-bounce {
            0% {
              border-radius: 40% 60% 70% 30% / 40% 50% 60% 50%;
              transform: translateY(0) rotate(0deg);
            }
            33% {
              border-radius: 70% 30% 50% 50% / 30% 30% 70% 70%;
              transform: translateY(-5px) rotate(5deg) scaleX(1.05);
            }
            66% {
              border-radius: 100% 60% 60% 100% / 100% 100% 60% 60%;
              transform: translateY(5px) rotate(-5deg) scaleX(0.95);
            }
            100% {
              border-radius: 40% 60% 70% 30% / 40% 50% 60% 50%;
              transform: translateY(0) rotate(0deg);
            }
          }

          @keyframes blink {
            0%, 48%, 52%, 100% {
              transform: scaleY(1);
            }
            50% {
              transform: scaleY(0.1);
            }
          }
        `}
      </style>

      {/* Floating Blob Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className="fixed bottom-6 left-6 z-50 md:bottom-8 md:left-8"
            onClick={() => setIsOpen(true)}
          >
            <div className="ai-bot-blob" ref={blobRef}>
              <div 
                className="eye-container eye-left"
                style={{ transform: \`translate(\${eyeTransform.x}px, \${eyeTransform.y}px)\` }}
              >
                <div className="ai-bot-eye"></div>
              </div>
              <div 
                className="eye-container eye-right"
                style={{ transform: \`translate(\${eyeTransform.x}px, \${eyeTransform.y}px)\` }}
              >
                <div className="ai-bot-eye"></div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed bottom-4 left-4 z-50 flex h-[85vh] max-h-[600px] w-[calc(100vw-2rem)] flex-col overflow-hidden rounded-3xl border border-[#1E2A22]/10 bg-[#FAF8F3]/95 shadow-2xl backdrop-blur-xl sm:w-[400px] md:bottom-8 md:left-8"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-[#1E2A22]/10 bg-[#2F6F4E]/5 px-5 py-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#D97A3F]">
                  <div className="relative flex h-full w-full items-center justify-center">
                    <div className="h-3 w-2 rounded-full bg-[#FAF8F3] absolute left-[30%]"></div>
                    <div className="h-3 w-2 rounded-full bg-[#FAF8F3] absolute right-[30%]"></div>
                  </div>
                </div>
                <div>
                  <h3 className="font-serif text-lg font-medium tracking-tight text-[#1E2A22]">DreamBot<span className="text-[#D97A3F]">.</span></h3>
                  <p className="font-mono text-xs text-[#1E2A22]/60 uppercase tracking-wider">Online</p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-full text-[#1E2A22]/60 hover:bg-[#1E2A22]/10 hover:text-[#1E2A22]"
                onClick={() => setIsOpen(false)}
              >
                <X className="h-5 w-5" />
              </Button>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-5 space-y-4">
              {messages.map((msg, idx) => (
                <div key={idx} className={\`flex \${msg.role === 'user' ? 'justify-end' : 'justify-start'}\`}>
                  <div
                    className={\`max-w-[80%] rounded-2xl px-4 py-3 text-sm \${
                      msg.role === 'user'
                        ? 'bg-[#1E2A22] text-[#FAF8F3] rounded-tr-sm'
                        : 'bg-white border border-[#1E2A22]/10 text-[#1E2A22] shadow-sm rounded-tl-sm'
                    }\`}
                  >
                    {msg.content}
                  </div>
                </div>
              ))}
            </div>

            {/* Input Area */}
            <div className="border-t border-[#1E2A22]/10 bg-white/50 p-4">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSend();
                }}
                className="flex items-center gap-2"
              >
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Type a message..."
                  className="flex-1 rounded-full border-[#1E2A22]/15 bg-white px-4 py-6 focus-visible:ring-[#2F6F4E] shadow-sm"
                />
                <Button
                  type="submit"
                  size="icon"
                  className="h-12 w-12 shrink-0 rounded-full bg-[#D97A3F] text-white hover:bg-[#c66a30] shadow-md transition-transform hover:scale-105 active:scale-95"
                >
                  <Send className="h-5 w-5 ml-1" />
                </Button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default AiBot;
