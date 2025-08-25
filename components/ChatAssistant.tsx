import React, { useState, useRef, useEffect } from 'react';
import type { ChatMessage } from '../types';

interface ChatAssistantProps {
  isOpen: boolean;
  onToggle: () => void;
  messages: ChatMessage[];
  onSendMessage: (message: string) => void;
  isLoading: boolean;
}

const ChatIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
    </svg>
);
const CloseIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
);
const SendIcon: React.FC = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
    </svg>
);

const TypingIndicator: React.FC = () => (
    <div className="flex items-center space-x-1">
        <div className="w-2 h-2 bg-slate-400 rounded-full animate-pulse [animation-delay:-0.3s]"></div>
        <div className="w-2 h-2 bg-slate-400 rounded-full animate-pulse [animation-delay:-0.15s]"></div>
        <div className="w-2 h-2 bg-slate-400 rounded-full animate-pulse"></div>
    </div>
);

// New component to handle markdown formatting
const FormattedMessage: React.FC<{ text: string }> = ({ text }) => {
    // This regex splits the text by code blocks, keeping the delimiters.
    const parts = text.split(/(```[\s\S]*?```)/g);

    return (
        <>
            {parts.map((part, index) => {
                if (part.startsWith('```') && part.endsWith('```')) {
                    // This is a code block.
                    const codeContent = part.replace(/^```[a-z]*\n?/, '').replace(/```$/, '').trim();
                    return (
                        <pre key={index} className="bg-slate-100 dark:bg-slate-900/70 p-3 rounded-md text-xs my-2 overflow-x-auto font-mono">
                            <code>{codeContent}</code>
                        </pre>
                    );
                }

                if (!part) return null; // Skip empty parts from the split

                // This is a regular text part. Process for inline markdown.
                const inlineParts = part.split(/(\*\*.*?\*\*|`.*?`)/g);

                return (
                    <span key={index}>
                        {inlineParts.map((inlinePart, i) => {
                            if (!inlinePart) return null;

                            if (inlinePart.startsWith('**') && inlinePart.endsWith('**')) {
                                return <strong key={i}>{inlinePart.slice(2, -2)}</strong>;
                            }
                            if (inlinePart.startsWith('`') && inlinePart.endsWith('`')) {
                                return (
                                    <code key={i} className="font-mono bg-slate-300 dark:bg-slate-600 text-red-700 dark:text-red-400 px-1 py-0.5 rounded text-[0.9em]">
                                        {inlinePart.slice(1, -1)}
                                    </code>
                                );
                            }
                            return inlinePart;
                        })}
                    </span>
                );
            })}
        </>
    );
};


export const ChatAssistant: React.FC<ChatAssistantProps> = ({ isOpen, onToggle, messages, onSendMessage, isLoading }) => {
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !isLoading) {
      onSendMessage(input);
      setInput('');
    }
  };

  return (
    <div className={`fixed bottom-4 right-4 z-40 flex flex-col items-end ${!isOpen && 'pointer-events-none'}`}>
      {/* Chat Window */}
      <div 
        className={`transition-all duration-300 ease-in-out mb-4 ${isOpen ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 translate-y-4'}`}
        style={{ transformOrigin: 'bottom right' }}
      >
        <div className="w-[24rem] h-[32rem] bg-white dark:bg-slate-800 rounded-lg shadow-2xl flex flex-col border border-slate-200 dark:border-slate-700">
          {/* Header */}
          <div className="flex justify-between items-center p-3 border-b border-slate-200 dark:border-slate-700 flex-shrink-0">
            <h3 className="font-bold text-slate-800 dark:text-slate-100">AI Assistant</h3>
            <button onClick={onToggle} className="p-1 rounded-full text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700">
              <CloseIcon />
            </button>
          </div>
          {/* Messages */}
          <div className="flex-grow p-3 overflow-y-auto space-y-3">
            {messages.length === 0 && (
              <div className="text-center text-sm text-slate-400 h-full flex items-center justify-center">
                <p>Ask me anything about the analysis results!</p>
              </div>
            )}
            {messages.map((msg, index) => (
              <div key={index} className={`flex items-end ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`px-3 py-2 rounded-lg max-w-[85%] text-sm whitespace-pre-wrap break-words ${msg.role === 'user' ? 'bg-red-600 text-white rounded-br-none' : 'bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-bl-none'}`}>
                  <FormattedMessage text={msg.text} />
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="px-3 py-2 rounded-lg bg-slate-200 dark:bg-slate-700 rounded-bl-none">
                  <TypingIndicator />
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
          {/* Input */}
          <div className="p-3 border-t border-slate-200 dark:border-slate-700 flex-shrink-0">
            <form onSubmit={handleSubmit} className="flex gap-2">
              <input 
                type="text" 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask a question..."
                className="flex-grow px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md bg-white dark:bg-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
              />
              <button type="submit" disabled={isLoading || !input.trim()} className="bg-red-600 text-white p-2 rounded-md hover:bg-red-700 disabled:bg-red-400 disabled:cursor-not-allowed flex-shrink-0">
                <SendIcon />
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Toggle Button */}
      <button 
        onClick={onToggle} 
        className="bg-red-600 text-white rounded-full p-4 shadow-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-slate-800 focus:ring-red-500 transition-transform duration-200 hover:scale-110 pointer-events-auto"
        aria-label="Toggle chat assistant"
      >
        <ChatIcon />
      </button>
    </div>
  );
};
