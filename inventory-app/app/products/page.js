"use client";
import { useEffect, useState, useMemo } from "react";
import API from "../../lib/api";
import Link from "next/link";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("default");
  const [purchasedItems, setPurchasedItems] = useState(0);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    API.get("/products")
      .then(res => {
        setProducts(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const handlePurchase = async (id, name) => {
    try {
      const res = await API.patch(`/products/${id}/purchase`);
      setProducts(products.map(p => p.id === id ? res.data : p));
      setPurchasedItems(prev => prev + 1);
      showToast(`Successfully added ${name} to cart!`);
    } catch (err) {
      if (err.response?.status === 400) {
        showToast(`Sorry, ${name} is out of stock!`);
      }
    }
  };

  const filteredAndSortedProducts = useMemo(() => {
    let result = products.filter(p => 
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      p.description.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (sortBy === "price-asc") result.sort((a, b) => a.price - b.price);
    if (sortBy === "price-desc") result.sort((a, b) => b.price - a.price);
    if (sortBy === "name") result.sort((a, b) => a.name.localeCompare(b.name));

    return result;
  }, [products, searchTerm, sortBy]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 p-4 md:p-8 relative overflow-hidden font-sans">
      {/* Live Animated UI Background */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-teal-900/30 blur-[120px] rounded-full animate-blob mix-blend-screen"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-emerald-900/20 blur-[150px] rounded-full animate-blob animation-delay-2000 mix-blend-screen"></div>
        <div className="absolute top-[40%] left-[60%] w-[400px] h-[400px] bg-purple-900/20 blur-[100px] rounded-full animate-blob animation-delay-4000 mix-blend-screen"></div>
        {/* Animated grid overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]"></div>
      </div>

      {/* Floating Toast Notification */}
      {toast && (
        <div className="fixed bottom-8 right-8 z-50 animate-bounce">
          <div className="bg-emerald-500/20 backdrop-blur-md border border-emerald-500/50 text-emerald-300 px-6 py-3 rounded-2xl shadow-[0_0_30px_rgba(16,185,129,0.3)] font-medium flex items-center gap-3">
            <span className="text-xl">🛍️</span> {toast}
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header & Navbar area */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-6 bg-slate-900/40 p-6 rounded-3xl border border-slate-800/60 backdrop-blur-xl shadow-2xl">
          <div>
            <h1 className="text-4xl md:text-5xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-teal-400 via-emerald-400 to-cyan-400 tracking-tight">
              ShopHub Store
            </h1>
            <p className="text-slate-400 mt-2 font-medium tracking-wide">Browse our premium live inventory</p>
          </div>
          
          <div className="flex items-center gap-4 w-full md:w-auto">
            <div className="flex items-center gap-3 bg-slate-950/60 border border-slate-800 px-5 py-2.5 rounded-2xl shadow-inner">
              <span className="text-slate-400 font-medium">🛒 Cart:</span>
              <span className="text-emerald-400 font-bold text-xl">{purchasedItems}</span>
            </div>
            <Link href="/" className="px-6 py-2.5 rounded-2xl border border-slate-700 bg-slate-800 hover:bg-slate-700 hover:border-slate-500 transition-all font-medium whitespace-nowrap shadow-lg active:scale-95">
              Home
            </Link>
          </div>
        </div>

        {/* Search & Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-10 bg-slate-900/30 p-4 rounded-2xl border border-slate-800/50 backdrop-blur-md shadow-xl">
          <div className="relative flex-grow">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <span className="text-slate-500">🔍</span>
            </div>
            <input 
              type="text" 
              placeholder="Search products by name or description..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-950/60 border border-slate-700 rounded-xl pl-12 pr-4 py-3.5 text-white focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all shadow-inner placeholder:text-slate-600"
            />
          </div>
          <div className="min-w-[220px]">
            <select 
              value={sortBy} 
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full bg-slate-950/60 border border-slate-700 rounded-xl px-4 py-3.5 text-white focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all cursor-pointer font-medium"
            >
              <option value="default">Sort by: Default</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="name">Name: A to Z</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col justify-center items-center h-64 gap-6">
            <div className="relative w-24 h-24">
              <div className="absolute inset-0 border-t-4 border-emerald-400 border-solid rounded-full animate-spin"></div>
              <div className="absolute inset-2 border-r-4 border-teal-400 border-solid rounded-full animate-spin animation-delay-2000"></div>
            </div>
            <p className="text-slate-400 uppercase tracking-widest font-bold animate-pulse text-sm">Loading Catalog...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredAndSortedProducts.length === 0 ? (
              <div className="col-span-full text-center text-slate-500 py-24 bg-slate-900/40 rounded-3xl border border-slate-800/50 backdrop-blur-md">
                <div className="text-6xl mb-6 animate-bounce">🔭</div>
                <p className="text-2xl font-bold text-slate-300 mb-2">No matching products</p>
                <p className="text-slate-500">Try adjusting your search or filters.</p>
              </div>
            ) : (
              filteredAndSortedProducts.map(p => {
                const isOutOfStock = p.quantity <= 0;
                const isLowStock = p.quantity > 0 && p.quantity <= 5;

                return (
                <div key={p.id} className={`group relative bg-slate-900/60 backdrop-blur-xl border rounded-3xl overflow-hidden transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_40px_-15px_rgba(52,211,153,0.25)] flex flex-col h-full ${isOutOfStock ? 'border-slate-800 opacity-75' : 'border-slate-700 hover:border-emerald-500/50'}`}>
                  
                  {/* Card Glow Effect */}
                  <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>

                  <div className="p-6 flex flex-col flex-grow relative z-10">
                    <div className="flex justify-between items-start mb-4">
                      <h2 className={`text-2xl font-bold line-clamp-1 transition-colors ${isOutOfStock ? 'text-slate-500' : 'text-white group-hover:text-emerald-400'}`}>
                        {p.name}
                      </h2>
                      {isOutOfStock ? (
                        <span className="bg-red-500/10 text-red-500 border border-red-500/20 px-3 py-1 rounded-xl text-[10px] font-black uppercase tracking-wider whitespace-nowrap shadow-[0_0_10px_rgba(239,68,68,0.2)]">
                          Out of Stock
                        </span>
                      ) : isLowStock ? (
                        <span className="bg-orange-500/10 text-orange-400 border border-orange-500/20 px-3 py-1 rounded-xl text-[10px] font-black uppercase tracking-wider whitespace-nowrap animate-pulse shadow-[0_0_10px_rgba(249,115,22,0.2)]">
                          Only {p.quantity} Left
                        </span>
                      ) : null}
                    </div>
                    
                    <p className={`mb-6 line-clamp-3 text-sm leading-relaxed flex-grow ${isOutOfStock ? 'text-slate-600' : 'text-slate-400'}`}>
                      {p.description}
                    </p>
                    
                    <div className="mt-auto">
                      <div className="flex justify-between items-end mb-6">
                        <div>
                          <p className="text-xs text-slate-500 uppercase tracking-widest mb-1 font-semibold">Price</p>
                          <p className={`text-4xl font-black tracking-tight ${isOutOfStock ? 'text-slate-600' : 'text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400'}`}>
                            ₹{p.price}
                          </p>
                        </div>
                        {!isOutOfStock && !isLowStock && (
                          <div className="bg-slate-950/50 px-3 py-1 rounded-xl border border-slate-800">
                            <p className="text-[10px] uppercase font-black text-slate-500 tracking-widest">Stock <span className="text-emerald-400 ml-1">{p.quantity}</span></p>
                          </div>
                        )}
                      </div>

                      <button 
                        onClick={() => !isOutOfStock && handlePurchase(p.id, p.name)}
                        disabled={isOutOfStock}
                        className={`w-full py-4 rounded-2xl font-black text-sm uppercase tracking-widest transition-all duration-300 shadow-lg flex justify-center items-center gap-2 ${
                          isOutOfStock 
                            ? 'bg-slate-900/50 text-slate-600 cursor-not-allowed border border-slate-800' 
                            : 'bg-emerald-500 text-slate-950 hover:bg-emerald-400 hover:shadow-[0_0_20px_rgba(52,211,153,0.5)] active:scale-[0.98]'
                        }`}
                      >
                        {isOutOfStock ? 'Unavailable' : 'Add to Cart +'}
                      </button>
                    </div>
                  </div>
                </div>
              )})
            )}
          </div>
        )}
      </div>
    </div>
  );
}
