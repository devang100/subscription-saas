import Link from 'next/link';
import { Book, Code, Terminal, Zap } from 'lucide-react';

export default function DocsPage() {
    return (
        <div className="py-20 container mx-auto px-6 max-w-6xl">
            <div className="text-center mb-16">
                <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Documentation</h1>
                <p className="text-xl text-gray-500 dark:text-gray-400">Everything you need to build with Stratis.</p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                <div className="col-span-1 lg:col-span-2 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-2xl p-8 text-white relative overflow-hidden">
                    <div className="relative z-10">
                        <h2 className="text-3xl font-bold mb-4">Quick Start Guide</h2>
                        <p className="text-indigo-100 mb-8 max-w-lg">
                            Get up and running with Stratis in less than 5 minutes. Learn the core concepts and basic setup.
                        </p>
                        <button className="bg-white text-indigo-600 px-6 py-3 rounded-lg font-bold hover:bg-indigo-50 transition-colors">
                            Read Guide
                        </button>
                    </div>
                </div>

                <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-2xl p-8 hover:border-indigo-500 transition-colors cursor-pointer group">
                    <div className="w-12 h-12 bg-gray-100 dark:bg-zinc-800 rounded-lg flex items-center justify-center text-gray-900 dark:text-white mb-6 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                        <Terminal size={24} />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">API Reference</h3>
                    <p className="text-gray-500 dark:text-gray-400 text-sm">
                        Detailed endpoints, request bodies, and response examples for our REST API.
                    </p>
                </div>

                <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-2xl p-8 hover:border-indigo-500 transition-colors cursor-pointer group">
                    <div className="w-12 h-12 bg-gray-100 dark:bg-zinc-800 rounded-lg flex items-center justify-center text-gray-900 dark:text-white mb-6 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                        <Code size={24} />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">SDKs & Libraries</h3>
                    <p className="text-gray-500 dark:text-gray-400 text-sm">
                        Official libraries for Node.js, Python, and React to speed up development.
                    </p>
                </div>

                <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-2xl p-8 hover:border-indigo-500 transition-colors cursor-pointer group">
                    <div className="w-12 h-12 bg-gray-100 dark:bg-zinc-800 rounded-lg flex items-center justify-center text-gray-900 dark:text-white mb-6 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                        <Zap size={24} />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Integrations</h3>
                    <p className="text-gray-500 dark:text-gray-400 text-sm">
                        Connect Stratis with your favorite tools like Slack, GitHub, and Jira.
                    </p>
                </div>

                <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-2xl p-8 hover:border-indigo-500 transition-colors cursor-pointer group">
                    <div className="w-12 h-12 bg-gray-100 dark:bg-zinc-800 rounded-lg flex items-center justify-center text-gray-900 dark:text-white mb-6 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                        <Book size={24} />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Guides & Tutorials</h3>
                    <p className="text-gray-500 dark:text-gray-400 text-sm">
                        Deep dive into advanced features and best practices.
                    </p>
                </div>
            </div>
        </div>
    );
}
