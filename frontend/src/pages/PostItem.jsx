import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import API from '../api/axios';

const PostItem = () => {
  const [form, setForm] = useState({ type: 'lost', title: '', description: '', category: '', location: '' });
  const [imageFile, setImageFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  // Cloudinary par direct image upload (unsigned preset)
  const uploadImage = async () => {
    const data = new FormData();
    data.append('file', imageFile);
    data.append('upload_preset', import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET);

    const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
    const res = await axios.post(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, data);
    return res.data.secure_url;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setUploading(true);
    try {
      let imageUrl = '';
      if (imageFile) {
        imageUrl = await uploadImage();
      }
      await API.post('/items', { ...form, imageUrl });
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to post item');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div style={{ maxWidth: '450px', margin: '40px auto' }}>
      <h2>Post an Item</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        <select name="type" value={form.type} onChange={handleChange}>
          <option value="lost">Lost</option>
          <option value="found">Found</option>
        </select>
        <input type="text" name="title" placeholder="Item title" onChange={handleChange} required />
        <textarea name="description" placeholder="Description" onChange={handleChange} required />
        <input type="text" name="category" placeholder="Category (e.g. Electronics, Bag)" onChange={handleChange} required />
        <input type="text" name="location" placeholder="Location" onChange={handleChange} required />
        <input type="file" accept="image/*" onChange={(e) => setImageFile(e.target.files[0])} />
        <button type="submit" disabled={uploading}>{uploading ? 'Posting...' : 'Post Item'}</button>
      </form>
    </div>
  );
};

export default PostItem;