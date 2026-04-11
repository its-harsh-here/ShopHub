import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-950 flex flex-col items-center justify-center relative overflow-hidden">
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-purple-600 rounded-full mix-blend-multiply filter blur-[128px] opacity-50 animate-blob"></div>
      <div className="absolute top-[20%] right-[-10%] w-96 h-96 bg-cyan-600 rounded-full mix-blend-multiply filter blur-[128px] opacity-50 animate-blob animation-delay-2000"></div>
      <div className="absolute bottom-[-20%] left-[20%] w-96 h-96 bg-pink-600 rounded-full mix-blend-multiply filter blur-[128px] opacity-50 animate-blob animation-delay-4000"></div>
      
      <div className="z-10 text-center px-6 backdrop-blur-sm bg-white/5 border border-white/10 rounded-3xl p-12 shadow-2xl max-w-2xl w-full mx-4 transition-all duration-500 hover:bg-white/10">
        <h1 className="text-5xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-cyan-400 mb-6 tracking-tight">
          ShopHub
        </h1>
        <p className="text-slate-300 text-lg mb-10 leading-relaxed font-light">
          Experience seamless, lightning-fast inventory tracking built for modern businesses. Real-time updates with an intuitive dashboard.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/products" className="group relative px-8 py-4 font-semibold text-white transition-all duration-300 ease-in-out bg-purple-600 rounded-full hover:bg-purple-500 hover:shadow-[0_0_20px_rgba(168,85,247,0.6)] hover:-translate-y-1">
            <span>View Products</span>
          </Link>
          <Link href="/login" className="group relative px-8 py-4 font-semibold text-white transition-all duration-300 ease-in-out bg-white/10 rounded-full hover:bg-white/20 border border-white/10 hover:border-white/30 hover:-translate-y-1">
            <span>Admin Login</span>
          </Link>
        </div>
      </div>
    </main>
  );
}
