'use client';

import { useState } from 'react';
import { Sparkles, X, Send } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function AIAssistant() {
    const [isOpen, setIsOpen] = useState(false);
    const [query, setQuery] = useState('');
    const [messages, setMessages] = useState<{ role: 'user' | 'assistant'; text: string }[]>([
        { role: 'assistant', text: 'Hi! I can help you draft emails, generate project descriptions, or analyze your data. What do you need?' }
    ]);

    const handleSend = () => {
        if (!query.trim()) return;
        setMessages(prev => [...prev, { role: 'user', text: query }]);
        setQuery('');

        // Mock response
        setTimeout(() => {
            setMessages(prev => [...prev, { role: 'assistant', text: "I'm a demo AI. In a real app, I would connect to OpenAI to answer: " + query }]);
        }, 1000);
    };

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                className="fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full shadow-xl flex items-center justify-center text-white hover:scale-110 transition-transform z-50 group"
            >
                <Sparkles size={24} className="group-hover:rotate-12 transition-transform" />
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                        className="fixed bottom-24 right-6 w-96 max-h-[600px] h-[500px] bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-zinc-800 z-50 flex flex-col overflow-hidden"
                    >
                        <div className="p-4 border-b border-gray-100 dark:border-zinc-800 flex justify-between items-center bg-gray-50 dark:bg-zinc-900/50">
                            <div className="flex items-center gap-2">
                                <Sparkles size={16} className="text-indigo-600" />
                                <span className="font-bold text-sm">Stratis AI</span>
                            </div>
                            <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-gray-600">
                                <X size={16} />
                            </button>
                        </div>

                        <div className="flex-1 overflow-y-auto p-4 space-y-4">
                            {messages.map((msg, i) => (
                                <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                    <div className={`max-w-[80%] p-3 rounded-lg text-sm ${msg.role === 'user'
                                            ? 'bg-indigo-600 text-white rounded-br-none'
                                            : 'bg-gray-100 dark:bg-zinc-800 text-gray-800 dark:text-gray-200 rounded-bl-none'
                                        }`}>
                                        {msg.text}
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="p-4 border-t border-gray-100 dark:border-zinc-800">
                            <form
                                onSubmit={(e) => { e.preventDefault(); handleSend(); }}
                                className="flex gap-2"
                            >
                                <input
                                    value={query}
                                    onChange={e => setQuery(e.target.value)}
                                    placeholder="Ask AI..."
                                    className="flex-1 bg-gray-50 dark:bg-zinc-800 border-none rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-indigo-500 outline-none"
                                />
                                <button type="submit" className="p-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
                                    <Send size={16} />
                                </button>
                            </form>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
