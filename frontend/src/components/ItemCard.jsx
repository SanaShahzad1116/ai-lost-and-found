import { Link } from 'react-router-dom';

const ItemCard = ({ item }) => {
  return (
    <div style={{ border: '1px solid #ddd', borderRadius: '10px', padding: '15px', width: '260px' }}>
      {item.imageUrl && (
        <img src={item.imageUrl} alt={item.title} style={{ width: '100%', height: '160px', objectFit: 'cover', borderRadius: '8px' }} />
      )}
      <h3>{item.title}</h3>
      <p style={{ fontSize: '13px', color: item.type === 'lost' ? 'crimson' : 'green', fontWeight: 'bold', textTransform: 'uppercase' }}>
        {item.type}
      </p>
      <p style={{ fontSize: '14px' }}>{item.description.slice(0, 60)}...</p>
      <p style={{ fontSize: '12px', color: '#666' }}>📍 {item.location}</p>
      <Link to={`/item/${item._id}`}>View Details →</Link>
    </div>
  );
};

export default ItemCard;