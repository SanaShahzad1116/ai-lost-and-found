import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import API from '../api/axios';

const ItemDetail = () => {
  const { id } = useParams();
  const [item, setItem] = useState(null);

  useEffect(() => {
    const fetchItem = async () => {
      const { data } = await API.get(`/items/${id}`);
      setItem(data);
    };
    fetchItem();
  }, [id]);

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
    </div>
  );
};

export default ItemDetail;