import { Link } from 'react-router-dom';

const NotFound = () => (
  <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4">
    <div className="text-6xl mb-4">🧭</div>
    <h1 className="text-2xl font-bold text-slate-900">Page not found</h1>
    <p className="text-slate-500 mt-2">The page you're looking for doesn't exist.</p>
    <Link
      to="/"
      className="mt-6 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold transition text-sm"
    >
      Go back home
    </Link>
  </div>
);

export default NotFound;