import { useState, useEffect } from 'react';
import API from '../api/axios';
import ItemCard, { ItemCardSkeleton } from '../components/ItemCard';

const Home = () => {
  const [items, setItems] = useState([]);
  const [filters, setFilters] = useState({ type: '', category: '', location: '' });
  const [loading, setLoading] = useState(true);

  const fetchItems = async () => {
    setLoading(true);
    const params = {};
    if (filters.type) params.type = filters.type;
    if (filters.category) params.category = filters.category;
    if (filters.location) params.location = filters.location;

    const { data } = await API.get('/items', { params });
    setItems(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchItems();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters]);

  return (
    <div>
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-indigo-600 via-indigo-600 to-violet-700 text-white">
        <div className="max-w-6xl mx-auto px-6 py-16 text-center">
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
            Lost something? <span className="text-indigo-200">Found something?</span>
          </h1>
          <p className="mt-4 text-indigo-100 text-base sm:text-lg max-w-xl mx-auto">
            Post it here — our AI automatically matches lost items with found ones so you can reconnect faster.
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-10">
        {/* Filters */}
        <div className="flex flex-wrap gap-3 mb-8 bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
          <select
            onChange={(e) => setFilters({ ...filters, type: e.target.value })}
            className="px-4 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="">All Types</option>
            <option value="lost">Lost</option>
            <option value="found">Found</option>
          </select>
          <input
            type="text"
            placeholder="Category"
            onChange={(e) => setFilters({ ...filters, category: e.target.value })}
            className="px-4 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <input
            type="text"
            placeholder="Location"
            onChange={(e) => setFilters({ ...filters, location: e.target.value })}
            className="px-4 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <ItemCardSkeleton key={i} />
            ))}
          </div>
        ) : items.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-5xl mb-4">🕵️</div>
            <p className="text-slate-500 font-medium">No items found. Try adjusting the filters.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {items.map((item) => (
              <ItemCard key={item._id} item={item} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;