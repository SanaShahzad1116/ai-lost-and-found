import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import PostItem from './pages/PostItem';
import ItemDetail from './pages/ItemDetail';

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/item/:id" element={<ItemDetail />} />
        <Route
          path="/post"
          element={
            <ProtectedRoute>
              <PostItem />
            </ProtectedRoute>
          }
        />
      </Routes>
    </>
  );
}

export default App;