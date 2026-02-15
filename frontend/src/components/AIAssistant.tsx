'use client';

import { useState } from 'react';
import { Sparkles, X, Send, Mail, BarChart3, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { api } from '@/lib/api';
import { useParams } from 'next/navigation';

interface Message {
    role: 'user' | 'assistant';
    content: string;
}

export interface AIAssistantProps {
    defaultOrgId?: string;
}

export function AIAssistant({ defaultOrgId }: AIAssistantProps) {
    const params = useParams();
    const orgId = (params.orgId as string) || defaultOrgId;
    const projectId = params.projectId as string | undefined;
    const [isOpen, setIsOpen] = useState(false);
    const [query, setQuery] = useState('');
    const [messages, setMessages] = useState<Message[]>([
        { role: 'assistant', content: '👋 Hi! I\'m your AI assistant. I can help you:\n\n• Draft professional emails to clients\n• Summarize project status and progress\n• Analyze task workload and priorities\n• Generate project documentation\n• Provide insights on team productivity\n\nWhat can I help you with today?' }
    ]);
    const [isLoading, setIsLoading] = useState(false);
    const [activeFeature, setActiveFeature] = useState<'chat' | 'email' | 'analyze'>('chat');

    const handleSend = async () => {
        if (!query.trim() || isLoading) return;

        if (!orgId) {
            setMessages(prev => [...prev, {
                role: 'user',
                content: query
            }]);
            setIsLoading(true); // Artificial delay to feel natural
            setTimeout(() => {
                setMessages(prev => [...prev, {
                    role: 'assistant',
                    content: '⚠️ Please select an organization from your dashboard or navigate to a project to use Stratis AI.'
                }]);
                setIsLoading(false);
            }, 500);
            setQuery('');
            return;
        }

        const userMessage = query;
        setQuery('');
        setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
        setIsLoading(true);

        try {
            const response = await api.post('/ai/chat', {
                message: userMessage,
                orgId: orgId as string,
                projectId: projectId as string | undefined,
                conversationHistory: messages
            });

            setMessages(prev => [...prev, {
                role: 'assistant',
                content: response.data.data.response
            }]);
        } catch (error: any) {
            console.error('AI Error:', error);
            setMessages(prev => [...prev, {
                role: 'assistant',
                content: '⚠️ ' + (error.response?.data?.message || 'Sorry, I encountered an error. Please try again.')
            }]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleGenerateEmail = async (type: 'update' | 'invoice' | 'onboarding') => {
        setIsLoading(true);
        setMessages(prev => [...prev, {
            role: 'user',
            content: `Generate a ${type} email for the client`
        }]);

        try {
            const response = await api.post('/ai/email', {
                orgId: orgId as string,
                projectId: projectId as string | undefined,
                emailType: type
            });

            setMessages(prev => [...prev, {
                role: 'assistant',
                content: response.data.data.emailContent
            }]);
        } catch (error: any) {
            setMessages(prev => [...prev, {
                role: 'assistant',
                content: '⚠️ Failed to generate email: ' + (error.response?.data?.message || 'Unknown error')
            }]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleAnalyzeProject = async () => {
        if (!projectId) {
            setMessages(prev => [...prev, {
                role: 'assistant',
                content: '⚠️ Please navigate to a specific project to use this feature.'
            }]);
            return;
        }

        setIsLoading(true);
        setMessages(prev => [...prev, {
            role: 'user',
            content: 'Analyze current project health'
        }]);

        try {
            const response = await api.post('/ai/analyze-project', {
                orgId: orgId as string,
                projectId: projectId as string
            });

            setMessages(prev => [...prev, {
                role: 'assistant',
                content: response.data.data.analysis
            }]);
        } catch (error: any) {
            setMessages(prev => [...prev, {
                role: 'assistant',
                content: '⚠️ Failed to analyze project: ' + (error.response?.data?.message || 'Unknown error')
            }]);
        } finally {
            setIsLoading(false);
        }
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
                        className="fixed bottom-24 right-6 w-[500px] max-h-[700px] h-[650px] bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-zinc-800 z-50 flex flex-col overflow-hidden"
                    >
                        <div className="p-4 border-b border-gray-200 dark:border-zinc-800 flex justify-between items-center bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-950/30 dark:to-purple-950/30">
                            <div className="flex items-center gap-2">
                                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-indigo-500 to-purple-600 flex items-center justify-center">
                                    <Sparkles size={16} className="text-white" />
                                </div>
                                <div>
                                    <span className="font-bold text-sm text-gray-900 dark:text-white">Stratis AI</span>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">Powered by Groq</p>
                                </div>
                            </div>
                            <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
                                <X size={18} />
                            </button>
                        </div>

                        {/* Quick Actions */}
                        <div className="px-4 py-3 border-b border-gray-100 dark:border-zinc-800 bg-white dark:bg-zinc-900">
                            <div className="flex gap-2">
                                <button
                                    onClick={() => handleGenerateEmail('update')}
                                    disabled={isLoading}
                                    className="flex-1 px-3 py-2 text-xs font-medium rounded-lg bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors disabled:opacity-50 flex items-center justify-center gap-1"
                                >
                                    <Mail size={14} />
                                    Email Draft
                                </button>
                                <button
                                    onClick={handleAnalyzeProject}
                                    disabled={isLoading || !projectId}
                                    className="flex-1 px-3 py-2 text-xs font-medium rounded-lg bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-400 hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-colors disabled:opacity-50 flex items-center justify-center gap-1"
                                >
                                    <BarChart3 size={14} />
                                    Analyze
                                </button>
                            </div>
                        </div>

                        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50/50 dark:bg-zinc-950/50">
                            {messages.map((msg, i) => (
                                <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                    <div className={`max-w-[85%] p-3 rounded-lg text-sm whitespace-pre-wrap ${msg.role === 'user'
                                        ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-br-none shadow-md'
                                        : 'bg-white dark:bg-zinc-800 text-gray-800 dark:text-gray-200 rounded-bl-none shadow-sm border border-gray-100 dark:border-zinc-700'
                                        }`}>
                                        {msg.content}
                                    </div>
                                </div>
                            ))}
                            {isLoading && (
                                <div className="flex justify-start">
                                    <div className="bg-white dark:bg-zinc-800 p-3 rounded-lg shadow-sm border border-gray-100 dark:border-zinc-700 flex items-center gap-2">
                                        <Loader2 size={16} className="animate-spin text-indigo-600" />
                                        <span className="text-sm text-gray-600 dark:text-gray-400">Thinking...</span>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="p-4 border-t border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
                            <form
                                onSubmit={(e) => { e.preventDefault(); handleSend(); }}
                                className="flex gap-2"
                            >
                                <input
                                    value={query}
                                    onChange={e => setQuery(e.target.value)}
                                    placeholder="Ask AI anything..."
                                    disabled={isLoading}
                                    className="flex-1 bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500 outline-none disabled:opacity-50 transition-all"
                                />
                                <button
                                    type="submit"
                                    disabled={isLoading || !query.trim()}
                                    className="p-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md hover:shadow-lg"
                                >
                                    {isLoading ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
                                </button>
                            </form>
                            <p className="text-xs text-gray-400 dark:text-gray-500 mt-2 text-center">
                                AI can make mistakes. Verify important information.
                            </p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
