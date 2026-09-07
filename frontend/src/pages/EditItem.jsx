import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import API from '../api/axios';

const EditItem = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({ title: '', description: '', category: '', location: '' });
  const [imageFile, setImageFile] = useState(null);
  const [currentImage, setCurrentImage] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchItem = async () => {
      const { data } = await API.get(`/items/${id}`);
      setForm({
        title: data.title,
        description: data.description,
        category: data.category,
        location: data.location,
      });
      setCurrentImage(data.imageUrl);
      setLoading(false);
    };
    fetchItem();
  }, [id]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

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
    setSaving(true);
    try {
      let imageUrl = currentImage;
      if (imageFile) imageUrl = await uploadImage();
      await API.put(`/items/${id}`, { ...form, imageUrl });
      toast.success('Item updated');
      navigate('/my-posts');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update item');
    } finally {
      setSaving(false);
    }
  };

  const inputClass =
    'w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition';

  if (loading) {
    return <div className="max-w-lg mx-auto px-4 py-10 text-slate-500">Loading...</div>;
  }

  return (
    <div className="max-w-lg mx-auto px-4 py-10">
      <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/50 p-8 border border-slate-100">
        <h2 className="text-2xl font-bold text-slate-900 mb-6">Edit Item</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input type="text" name="title" value={form.title} onChange={handleChange} required className={inputClass} />
          <textarea name="description" value={form.description} onChange={handleChange} required rows={3} className={inputClass} />
          <input type="text" name="category" value={form.category} onChange={handleChange} required className={inputClass} />
          <input type="text" name="location" value={form.location} onChange={handleChange} required className={inputClass} />

          {currentImage && <img src={currentImage} alt="current" className="w-24 h-24 rounded-xl object-cover" />}

          <label className="block">
            <span className="text-sm text-slate-500 mb-1 block">Replace photo (optional)</span>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setImageFile(e.target.files[0])}
              className="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
            />
          </label>

          <button
            type="submit"
            disabled={saving}
            className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white font-semibold transition"
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditItem;