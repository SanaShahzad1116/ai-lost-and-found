import { useState, useEffect } from 'react';
import API from '../api/axios';
import ItemCard from '../components/ItemCard';

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
    <div style={{ padding: '20px 30px' }}>
      <h2>Browse Items</h2>
      <div style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
        <select onChange={(e) => setFilters({ ...filters, type: e.target.value })}>
          <option value="">All Types</option>
          <option value="lost">Lost</option>
          <option value="found">Found</option>
        </select>
        <input type="text" placeholder="Filter by category" onChange={(e) => setFilters({ ...filters, category: e.target.value })} />
        <input type="text" placeholder="Filter by location" onChange={(e) => setFilters({ ...filters, location: e.target.value })} />
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
          {items.length === 0 ? <p>No items found.</p> : items.map((item) => <ItemCard key={item._id} item={item} />)}
        </div>
      )}
    </div>
  );
};

export default Home;