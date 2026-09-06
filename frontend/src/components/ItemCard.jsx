import { Link } from 'react-router-dom';

const ItemCard = ({ item }) => {
  const isLost = item.type === 'lost';

  return (
    <Link
      to={`/item/${item._id}`}
      className="group block bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-200 overflow-hidden"
    >
      <div className="relative h-44 bg-slate-100 overflow-hidden">
        {item.imageUrl ? (
          <img
            src={item.imageUrl}
            alt={item.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-4xl">📦</div>
        )}
        <span
          className={`absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${
            isLost ? 'bg-rose-100 text-rose-700' : 'bg-emerald-100 text-emerald-700'
          }`}
        >
          {item.type}
        </span>
      </div>

      <div className="p-4">
        <h3 className="font-semibold text-slate-900 truncate">{item.title}</h3>
        <p className="text-sm text-slate-500 mt-1 line-clamp-2">{item.description}</p>
        <p className="text-xs text-slate-400 mt-3 flex items-center gap-1">
          📍 {item.location}
        </p>
      </div>
    </Link>
  );
};

export const ItemCardSkeleton = () => (
  <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden animate-pulse">
    <div className="h-44 bg-slate-200" />
    <div className="p-4 space-y-3">
      <div className="h-4 bg-slate-200 rounded w-3/4" />
      <div className="h-3 bg-slate-200 rounded w-full" />
      <div className="h-3 bg-slate-200 rounded w-1/2" />
    </div>
  </div>
);

export default ItemCard;