export default function AboutPage() {
    return (
        <div className="py-20 relative overflow-hidden">
            {/* Background Details */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-50 dark:bg-zinc-900 rounded-full blur-[100px] -z-10 translate-x-1/2 -translate-y-1/2" />

            <div className="container mx-auto px-6">
                <div className="max-w-4xl mx-auto mb-20">
                    <span className="text-indigo-600 dark:text-indigo-400 font-semibold tracking-wide uppercase text-sm mb-4 block">About Us</span>
                    <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
                        We're building the future of agency work.
                    </h1>
                    <p className="text-xl text-gray-600 dark:text-gray-400 leading-relaxed">
                        Stratis was born from a desire to simplify the complex world of client management. We believe that great software should feel invisible, empowering you to focus on your craft.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-16 mb-24 items-center">
                    <div>
                        <div className="aspect-square bg-gradient-to-br from-indigo-500 to-violet-600 rounded-2xl overflow-hidden relative flex items-center justify-center p-8 shadow-2xl skew-y-3">
                            {/* Abstract Decorative Elements */}
                            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150"></div>
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-white/20 blur-2xl rounded-full animate-pulse"></div>

                            <div className="relative z-10 text-white text-center">
                                <div className="text-6xl mb-4 font-bold tracking-tighter">Stratis</div>
                                <div className="text-white/80 font-mono text-sm tracking-widest uppercase">Operating System</div>
                            </div>

                            {/* Floating Cards */}
                            <div className="absolute top-10 right-10 w-16 h-16 bg-white/10 backdrop-blur-md rounded-lg border border-white/20 rotate-12"></div>
                            <div className="absolute bottom-10 left-10 w-20 h-20 bg-white/10 backdrop-blur-md rounded-lg border border-white/20 -rotate-6"></div>
                        </div>
                    </div>
                    <div>
                        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Designed for Speed</h2>
                        <div className="prose dark:prose-invert text-lg text-gray-600 dark:text-gray-400 space-y-6">
                            <p>
                                We noticed that modern agencies are slowed down by tools that don't talk to each other. Stratis changes that by unifying your entire workflow into one intuitive interface.
                            </p>
                            <p>
                                Our philosophy is simple: innovative design meets robust functionality. Whether you are a solo freelancer or a scaling team, Stratis adapts to your needs without the bloat.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20 text-center">
                    <div className="p-8 bg-white dark:bg-zinc-900 rounded-2xl shadow-sm border border-gray-100 dark:border-zinc-800">
                        <div className="text-4xl font-bold text-indigo-600 mb-2">∞</div>
                        <div className="text-gray-600 dark:text-gray-400">Unlimited Possibilities</div>
                    </div>
                    <div className="p-8 bg-white dark:bg-zinc-900 rounded-2xl shadow-sm border border-gray-100 dark:border-zinc-800">
                        <div className="text-4xl font-bold text-indigo-600 mb-2">24/7</div>
                        <div className="text-gray-600 dark:text-gray-400">Always Connected</div>
                    </div>
                    <div className="p-8 bg-white dark:bg-zinc-900 rounded-2xl shadow-sm border border-gray-100 dark:border-zinc-800">
                        <div className="text-4xl font-bold text-indigo-600 mb-2">100%</div>
                        <div className="text-gray-600 dark:text-gray-400">Secure & Private</div>
                    </div>
                </div>
            </div>
        </div>
    );
}
