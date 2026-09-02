import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
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
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingMatches(false);
    }
  };

  if (!item) return <p>Loading...</p>;

  return (
    <div style={{ maxWidth: '500px', margin: '30px auto' }}>
      {item.imageUrl && <img src={item.imageUrl} alt={item.title} style={{ width: '100%', borderRadius: '10px' }} />}
      <h2>{item.title}</h2>
      <p><strong>Type:</strong> {item.type}</p>
      <p><strong>Category:</strong> {item.category}</p>
      <p><strong>Location:</strong> {item.location}</p>
      <p><strong>Description:</strong> {item.description}</p>
      <p><strong>Posted by:</strong> {item.user?.name} ({item.user?.email})</p>
      <p><strong>Status:</strong> {item.status}</p>

      <button onClick={findMatches} disabled={loadingMatches} style={{ marginTop: '15px' }}>
        {loadingMatches ? 'Searching with AI...' : '🔍 Find AI Matches'}
      </button>

      {matches && (
        <div style={{ marginTop: '20px' }}>
          <h3>Possible Matches</h3>
          {matches.length === 0 ? (
            <p>Koi match nahi mila.</p>
          ) : (
            matches.map((m) => (
              <div key={m.id} style={{ border: '1px solid #ddd', borderRadius: '8px', padding: '10px', marginBottom: '10px' }}>
                <strong>{m.title}</strong> — {Math.round(m.similarity * 100)}% match
                <p style={{ fontSize: '14px' }}>{m.description}</p>
                <p style={{ fontSize: '12px', color: '#666' }}>📍 {m.location}</p>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default ItemDetail;