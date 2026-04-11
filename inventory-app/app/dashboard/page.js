"use client";
import { useEffect, useState } from "react";
import API from "../../lib/api";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Dashboard() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ name: "", description: "", price: 0, quantity: 0 });
  const [editingId, setEditingId] = useState(null);
  const router = useRouter();

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = () => {
    setLoading(true);
    API.get("/products")
      .then(res => {
        setProducts(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        if (err.response?.status === 401) {
          router.push("/login");
        } else {
          setLoading(false);
        }
      });
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/login");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...form,
        price: parseFloat(form.price),
        quantity: parseInt(form.quantity)
      };

      if (editingId) {
        await API.put(`/products/${editingId}`, payload);
      } else {
        await API.post("/products", payload);
      }
      setForm({ name: "", description: "", price: 0, quantity: 0 });
      setEditingId(null);
      loadProducts();
    } catch (err) {
      alert("Error saving product: " + (err.response?.data?.msg || err.message));
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this product?")) return;
    try {
      await API.delete(`/products/${id}`);
      loadProducts();
    } catch (err) {
      alert("Error deleting product");
    }
  };

  const handleEdit = (p) => {
    setEditingId(p.id);
    setForm({ name: p.name, description: p.description, price: p.price, quantity: p.quantity });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleStockUpdate = async (p, amount) => {
    const newQuantity = p.quantity + amount;
    if (newQuantity < 0) return;
    try {
      await API.put(`/products/${p.id}`, { ...p, quantity: newQuantity });
      loadProducts();
    } catch (err) {
      alert("Error updating stock: " + (err.response?.data?.msg || err.message));
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200">
      <nav className="bg-slate-900 border-b border-slate-800 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <h1 className="text-xl font-bold text-white tracking-wide">ShopHub <span className="text-purple-500">Dashboard</span></h1>
            <div className="flex gap-4">
              <Link href="/products" className="text-slate-400 hover:text-white transition-colors py-2 text-sm">View Store</Link>
              <button onClick={handleLogout} className="px-4 py-1.5 rounded-lg border border-slate-700 bg-slate-800 hover:bg-red-500/20 hover:border-red-500/50 hover:text-red-400 transition-all font-medium text-sm">
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form Section */}
          <div className="lg:col-span-1">
            <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800 p-6 rounded-2xl sticky top-24">
              <h2 className="text-xl font-semibold text-white mb-6">
                {editingId ? "Edit Product" : "Add New Product"}
              </h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm text-slate-400 mb-1">Name</label>
                  <input required className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-purple-500 transition-colors" value={form.name} onChange={e => setForm({...form, name: e.target.value})} />
                </div>
                <div>
                  <label className="block text-sm text-slate-400 mb-1">Description</label>
                  <textarea required rows="3" className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-purple-500 transition-colors resize-none" value={form.description} onChange={e => setForm({...form, description: e.target.value})} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-slate-400 mb-1">Price (₹)</label>
                    <input type="number" step="0.01" required className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-purple-500 transition-colors" value={form.price} onChange={e => setForm({...form, price: e.target.value})} />
                  </div>
                  <div>
                    <label className="block text-sm text-slate-400 mb-1">Stock</label>
                    <input type="number" required className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:border-purple-500 transition-colors" value={form.quantity} onChange={e => setForm({...form, quantity: e.target.value})} />
                  </div>
                </div>
                <div className="pt-4 flex gap-3">
                  <button type="submit" className="flex-1 bg-purple-600 hover:bg-purple-500 text-white py-2 rounded-lg font-medium transition-colors shadow-[0_0_15px_rgba(168,85,247,0.3)]">
                    {editingId ? "Update" : "Add"}
                  </button>
                  {editingId && (
                    <button type="button" onClick={() => { setEditingId(null); setForm({ name: "", description: "", price: 0, quantity: 0 }); }} className="px-4 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg font-medium transition-colors">
                      Cancel
                    </button>
                  )}
                </div>
              </form>
            </div>
          </div>

          {/* Table Section */}
          <div className="lg:col-span-2">
            <div className="bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-2xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-800/80 border-b border-slate-700">
                      <th className="px-6 py-4 text-sm font-semibold text-slate-300 tracking-wider">Product Info</th>
                      <th className="px-6 py-4 text-sm font-semibold text-slate-300 tracking-wider">Pricing details</th>
                      <th className="px-6 py-4 text-sm font-semibold text-slate-300 tracking-wider text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/50">
                    {loading ? (
                      <tr><td colSpan="3" className="px-6 py-12 text-center text-slate-500">Loading products...</td></tr>
                    ) : products.length === 0 ? (
                      <tr><td colSpan="3" className="px-6 py-12 text-center text-slate-500">No products found. Start by adding one.</td></tr>
                    ) : (
                      products.map(p => (
                        <tr key={p.id} className="hover:bg-slate-800/30 transition-colors group">
                          <td className="px-6 py-4">
                            <p className="font-medium text-white mb-1 group-hover:text-purple-400 transition-colors">{p.name}</p>
                            <p className="text-sm text-slate-500 line-clamp-1">{p.description}</p>
                          </td>
                          <td className="px-6 py-4">
                            <p className="font-semibold text-emerald-400">₹{p.price}</p>
                            <div className="flex items-center mt-1">
                              <p className="text-xs text-slate-500 uppercase tracking-wider">Stock: <span className="text-slate-300 font-medium">{p.quantity}</span></p>
                              <div className="flex bg-slate-800/80 backdrop-blur-sm rounded-md overflow-hidden opacity-0 group-hover:opacity-100 transition-opacity ml-3 border border-slate-700/50">
                                <button onClick={() => handleStockUpdate(p, -1)} disabled={p.quantity <= 0} className="px-2.5 py-0.5 hover:bg-slate-700 text-slate-400 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors" title="Decrease Stock">
                                  -
                                </button>
                                <button onClick={() => handleStockUpdate(p, 1)} className="px-2.5 py-0.5 hover:bg-slate-700 text-slate-400 hover:text-white border-l border-slate-700/50 transition-colors" title="Increase Stock">
                                  +
                                </button>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                              <button onClick={() => handleEdit(p)} className="p-2 text-blue-400 hover:bg-blue-500/10 rounded-lg transition-colors" title="Edit">
                                ✎
                              </button>
                              <button onClick={() => handleDelete(p.id)} className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors" title="Delete">
                                🗑
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
