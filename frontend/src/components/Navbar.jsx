import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 text-xl font-extrabold text-slate-900">
          <span className="text-2xl">🔍</span>
          <span>Lost<span className="text-indigo-600">Found</span></span>
        </Link>

        <div className="flex items-center gap-2 sm:gap-6">
          <Link to="/" className="text-slate-600 hover:text-indigo-600 font-medium transition text-sm sm:text-base">
            Browse
          </Link>

          {user ? (
            <>
              <Link to="/post" className="text-slate-600 hover:text-indigo-600 font-medium transition text-sm sm:text-base">
                Post Item
              </Link>
              <div className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center text-sm font-semibold">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <button
                onClick={handleLogout}
                className="px-3 py-2 sm:px-4 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium transition text-sm"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-slate-600 hover:text-indigo-600 font-medium transition text-sm sm:text-base">
                Login
              </Link>
              <Link
                to="/signup"
                className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-medium transition text-sm sm:text-base"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;