import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import API from '../api/axios';

const MyPosts = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchMine = async () => {
    setLoading(true);
    const { data } = await API.get('/items/mine');
    setItems(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchMine();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this item?')) return;
    try {
      await API.delete(`/items/${id}`);
      toast.success('Item deleted');
      setItems(items.filter((i) => i._id !== id));
    } catch (err) {
      toast.error('Failed to delete');
    }
  };

  const toggleResolved = async (item) => {
    try {
      const newStatus = item.status === 'resolved' ? 'open' : 'resolved';
      await API.put(`/items/${item._id}`, { status: newStatus });
      setItems(items.map((i) => (i._id === item._id ? { ...i, status: newStatus } : i)));
      toast.success(`Marked as ${newStatus}`);
    } catch (err) {
      toast.error('Failed to update status');
    }
  };

  if (loading) {
    return <div className="max-w-4xl mx-auto px-4 py-10 text-slate-500">Loading...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <h2 className="text-2xl font-bold text-slate-900 mb-6">My Posts</h2>

      {items.length === 0 ? (
        <div className="text-center py-20">
          <div className="text-5xl mb-4">📭</div>
          <p className="text-slate-500">You haven't posted anything yet.</p>
          <Link
            to="/post"
            className="inline-block mt-4 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold transition text-sm"
          >
            Post an item
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {items.map((item) => (
            <div key={item._id} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 flex items-center gap-4">
              {item.imageUrl ? (
                <img src={item.imageUrl} alt={item.title} className="w-20 h-20 rounded-xl object-cover shrink-0" />
              ) : (
                <div className="w-20 h-20 rounded-xl bg-slate-100 flex items-center justify-center text-2xl shrink-0">📦</div>
              )}
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="font-semibold text-slate-900 truncate">{item.title}</h3>
                  <span
                    className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                      item.type === 'lost' ? 'bg-rose-100 text-rose-700' : 'bg-emerald-100 text-emerald-700'
                    }`}
                  >
                    {item.type}
                  </span>
                  <span
                    className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                      item.status === 'resolved' ? 'bg-slate-200 text-slate-600' : 'bg-indigo-100 text-indigo-700'
                    }`}
                  >
                    {item.status}
                  </span>
                </div>
                <p className="text-sm text-slate-500 truncate">{item.description}</p>
              </div>
              <div className="flex gap-2 shrink-0">
                <Link
                  to={`/edit/${item._id}`}
                  className="px-3 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-medium transition"
                >
                  Edit
                </Link>
                <button
                  onClick={() => toggleResolved(item)}
                  className="px-3 py-2 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-sm font-medium transition"
                >
                  {item.status === 'resolved' ? 'Reopen' : 'Resolve'}
                </button>
                <button
                  onClick={() => handleDelete(item._id)}
                  className="px-3 py-2 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 text-sm font-medium transition"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyPosts;