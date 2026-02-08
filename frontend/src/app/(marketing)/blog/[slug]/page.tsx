import Link from 'next/link';
import { ArrowLeft, Clock, Tag, Share2 } from 'lucide-react';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Introducing Stratis 2.0 - Stratis Blog',
    description: 'We have completely rewritten our core engine to be faster, more reliable, and ready for your biggest projects.',
};

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
    await params; // Wait for params (good practice in Next.js 15+)
    return (
        <article className="py-20 bg-white dark:bg-zinc-950 min-h-screen">
            <div className="container mx-auto px-6 max-w-4xl">
                <Link href="/blog" className="inline-flex items-center gap-2 text-gray-500 hover:text-indigo-600 transition-colors mb-8 font-medium">
                    <ArrowLeft size={20} /> Back to Blog
                </Link>

                <header className="mb-12 text-center">
                    <div className="flex items-center justify-center gap-4 text-sm font-medium text-gray-500 mb-6">
                        <span className="flex items-center gap-1 text-indigo-600 font-bold uppercase tracking-wider bg-indigo-50 dark:bg-indigo-900/30 px-3 py-1 rounded-full">
                            <Tag size={14} /> Product Update
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                            <Clock size={14} /> 5 min read
                        </span>
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
                        Introducing Stratis 2.0
                    </h1>
                    <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                        We have completely rewritten our core engine to be faster, more reliable, and ready for your biggest projects.
                    </p>
                </header>

                <div className="aspect-video rounded-2xl overflow-hidden mb-12 relative bg-gradient-to-tr from-gray-100 to-gray-200 dark:from-zinc-800 dark:to-zinc-700">
                    <div className="absolute inset-0 opacity-20 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-500 via-transparent to-transparent" />
                </div>

                <div className="prose prose-lg dark:prose-invert mx-auto">
                    <p>
                        Today we are excited to announce the general availability of Stratis 2.0. This release represents a major milestone in our mission to provide the most powerful and intuitive agency operating system on the market.
                    </p>
                    <h2>Everything New</h2>
                    <p>
                        We went back to the drawing board to reimagine how agencies manage their workflows. The result is a platform that is not only faster but also more flexible.
                    </p>
                    <ul>
                        <li><strong>Performance:</strong> Up to 10x faster page loads and interaction times.</li>
                        <li><strong>Real-time Collaboration:</strong> See who is working on what in real-time.</li>
                        <li><strong>New API:</strong> A completely documented API for building your own integrations.</li>
                    </ul>
                    <blockquote>
                        "Stratis 2.0 completely changed how our team operates. The speed improvements alone are worth the upgrade."
                    </blockquote>
                    <p>
                        We can't wait to see what you build with the new version of Stratis. Assuming you are ready to scale, this is the tool you have been waiting for.
                    </p>
                    <h2>Availability</h2>
                    <p>
                        Stratis 2.0 is available today for all existing customers. If you are new to Stratis, you can get started with our free trial.
                    </p>
                </div>

                <div className="border-t border-gray-100 dark:border-zinc-800 mt-16 pt-8 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gray-200 dark:bg-zinc-800 rounded-full flex items-center justify-center text-xl font-bold text-gray-500">
                            S
                        </div>
                        <div>
                            <p className="font-bold text-gray-900 dark:text-white">Stratis Team</p>
                            <p className="text-sm text-gray-500">Product Engineering</p>
                        </div>
                    </div>

                    <button className="flex items-center gap-2 text-gray-500 hover:text-indigo-600 transition-colors">
                        <Share2 size={20} /> Share
                    </button>
                </div>
            </div>
        </article>
    );
}
