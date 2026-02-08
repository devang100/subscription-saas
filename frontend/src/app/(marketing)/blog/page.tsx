import { Clock, Tag } from 'lucide-react';
import Link from 'next/link';

export default function BlogPage() {
    return (
        <div className="py-20 container mx-auto px-6">
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-10 text-center">Latest from Stratis</h1>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[1, 2, 3].map((_, i) => (
                    <Link href="/blog/introducing-stratis-2-0" key={i} className="group cursor-pointer flex flex-col h-full">
                        <article className="flex flex-col h-full">
                            <div className="aspect-video rounded-xl mb-4 overflow-hidden relative">
                                <img
                                    src={[
                                        "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80",
                                        "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80",
                                        "https://images.unsplash.com/photo-1553877602-c9d290c0354d?auto=format&fit=crop&w=800&q=80"
                                    ][i]}
                                    alt="Blog cover"
                                    className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
                                />
                                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/20">
                                    <span className="text-white font-bold bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full border border-white/30">Read Article</span>
                                </div>
                            </div>
                            <div className="flex items-center gap-3 text-xs font-medium text-gray-500 mb-2">
                                <span className="flex items-center gap-1 text-indigo-600 font-bold uppercase tracking-wider bg-indigo-50 dark:bg-indigo-900/30 px-2 py-0.5 rounded">
                                    <Tag size={12} /> Product Update
                                </span>
                                <span>•</span>
                                <span className="flex items-center gap-1">
                                    <Clock size={12} /> 5 min read
                                </span>
                            </div>
                            <h3 className="text-xl font-bold mt-2 mb-2 group-hover:text-indigo-600 transition-colors text-gray-900 dark:text-white">Introducing Stratis 2.0</h3>
                            <p className="text-gray-500 dark:text-gray-400 line-clamp-2 text-sm leading-relaxed">We have completely rewritten our core engine to be faster, more reliable, and ready for your biggest projects.</p>
                        </article>
                    </Link>
                ))}
            </div>
        </div>
    );
}
