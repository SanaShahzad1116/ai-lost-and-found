import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import API from '../api/axios';

const ItemDetail = () => {
  const { id } = useParams();
  const [item, setItem] = useState(null);
  const [matches, setMatches] = useState(null);
  const [loadingMatches, setLoadingMatches] = useState(false);

  useEffect(() => {
    const fetchItem = async () => {
      const { data } = await API.get(`/items/${id}`);
      setItem(data);
    };
    fetchItem();
  }, [id]);

  const findMatches = async () => {
    setLoadingMatches(true);
    try {
      const { data } = await API.get(`/items/${id}/matches`);
      setMatches(data.matches);
      if (data.matches.length === 0) toast('No matches found yet', { icon: '🔍' });
    } catch (error) {
      toast.error('Could not fetch matches');
    } finally {
      setLoadingMatches(false);
    }
  };

  if (!item) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-10 animate-pulse space-y-4">
        <div className="h-64 bg-slate-200 rounded-2xl" />
        <div className="h-6 bg-slate-200 rounded w-2/3" />
        <div className="h-4 bg-slate-200 rounded w-1/2" />
      </div>
    );
  }

  const isLost = item.type === 'lost';

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        {item.imageUrl && <img src={item.imageUrl} alt={item.title} className="w-full h-72 object-cover" />}

        <div className="p-6">
          <span
            className={`inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide mb-3 ${
              isLost ? 'bg-rose-100 text-rose-700' : 'bg-emerald-100 text-emerald-700'
            }`}
          >
            {item.type}
          </span>

          <h2 className="text-2xl font-bold text-slate-900">{item.title}</h2>
          <p className="text-slate-600 mt-2">{item.description}</p>

          <div className="grid grid-cols-2 gap-4 mt-6 text-sm">
            <div>
              <p className="text-slate-400">Category</p>
              <p className="font-medium text-slate-800">{item.category}</p>
            </div>
            <div>
              <p className="text-slate-400">Location</p>
              <p className="font-medium text-slate-800">📍 {item.location}</p>
            </div>
            <div>
              <p className="text-slate-400">Posted by</p>
              <p className="font-medium text-slate-800">{item.user?.name}</p>
            </div>
            <div>
              <p className="text-slate-400">Status</p>
              <p className="font-medium text-slate-800 capitalize">{item.status}</p>
            </div>
          </div>

          <button
            onClick={findMatches}
            disabled={loadingMatches}
            className="w-full mt-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white font-semibold transition"
          >
            {loadingMatches ? 'Searching with AI...' : '🔍 Find AI Matches'}
          </button>

          {matches && matches.length > 0 && (
            <div className="mt-6 space-y-3">
              <h3 className="font-semibold text-slate-900">Possible Matches</h3>
              {matches.map((m) => (
                <div key={m.id} className="p-4 rounded-xl border border-slate-100 bg-slate-50">
                  <div className="flex items-center justify-between">
                    <strong className="text-slate-900">{m.title}</strong>
                    <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-1 rounded-full">
                      {Math.round(m.similarity * 100)}% match
                    </span>
                  </div>
                  <p className="text-sm text-slate-500 mt-1">{m.description}</p>
                  <p className="text-xs text-slate-400 mt-2">📍 {m.location}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ItemDetail;