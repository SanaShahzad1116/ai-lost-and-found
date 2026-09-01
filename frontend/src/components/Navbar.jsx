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
    <nav style={{ display: 'flex', justifyContent: 'space-between', padding: '15px 30px', background: '#1a1a2e', color: '#fff' }}>
      <Link to="/" style={{ color: '#fff', fontWeight: 'bold', textDecoration: 'none' }}>🔍 Lost & Found</Link>
      <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
        <Link to="/" style={{ color: '#fff' }}>Browse</Link>
        {user ? (
          <>
            <Link to="/post" style={{ color: '#fff' }}>Post Item</Link>
            <span>Hi, {user.name}</span>
            <button onClick={handleLogout} style={{ padding: '5px 12px', cursor: 'pointer' }}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/login" style={{ color: '#fff' }}>Login</Link>
            <Link to="/signup" style={{ color: '#fff' }}>Signup</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;