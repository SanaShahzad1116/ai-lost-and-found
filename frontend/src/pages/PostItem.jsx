import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import API from '../api/axios';

const PostItem = () => {
  const [form, setForm] = useState({ type: 'lost', title: '', description: '', category: '', location: '' });
  const [imageFile, setImageFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const navigate = useNavigate();

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
    setUploading(true);
    try {
      let imageUrl = '';
      if (imageFile) imageUrl = await uploadImage();
      await API.post('/items', { ...form, imageUrl });
      toast.success('Item posted!');
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to post item');
    } finally {
      setUploading(false);
    }
  };

  const inputClass =
    'w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition';

  return (
    <div className="max-w-lg mx-auto px-4 py-10">
      <div className="bg-white rounded-2xl shadow-xl shadow-slate-200/50 p-8 border border-slate-100">
        <h2 className="text-2xl font-bold text-slate-900 mb-1">Post an Item</h2>
        <p className="text-slate-500 mb-6">Fill in the details below</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex gap-3">
            {['lost', 'found'].map((t) => (
              <button
                type="button"
                key={t}
                onClick={() => setForm({ ...form, type: t })}
                className={`flex-1 py-3 rounded-xl font-semibold capitalize transition ${
                  form.type === t
                    ? t === 'lost'
                      ? 'bg-rose-100 text-rose-700 ring-2 ring-rose-400'
                      : 'bg-emerald-100 text-emerald-700 ring-2 ring-emerald-400'
                    : 'bg-slate-100 text-slate-500'
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          <input type="text" name="title" placeholder="Item title" onChange={handleChange} required className={inputClass} />
          <textarea name="description" placeholder="Description" onChange={handleChange} required rows={3} className={inputClass} />
          <input type="text" name="category" placeholder="Category (e.g. Electronics, Bag)" onChange={handleChange} required className={inputClass} />
          <input type="text" name="location" placeholder="Location" onChange={handleChange} required className={inputClass} />

          <label className="block">
            <span className="text-sm text-slate-500 mb-1 block">Photo (optional)</span>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setImageFile(e.target.files[0])}
              className="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
            />
          </label>

          <button
            type="submit"
            disabled={uploading}
            className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white font-semibold transition"
          >
            {uploading ? 'Posting...' : 'Post Item'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default PostItem;