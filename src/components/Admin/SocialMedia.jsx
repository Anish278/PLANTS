import React, { useState, useEffect } from 'react';
import { FaInstagram, FaTrash, FaPlus, FaLink, FaImage, FaHeart, FaExternalLinkAlt, FaVideo, FaInfoCircle } from 'react-icons/fa';
import { getSocialMediaPosts, addSocialMediaPost, deleteSocialMediaPost } from '../../firebase/firestore';
import { toast } from 'react-toastify';

const SocialMedia = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    videoUrl: '',
    imageUrl: '',
    caption: '',
    likes: '',
    link: 'https://www.instagram.com/plant_vigor/'
  });

  useEffect(() => { fetchPosts(); }, []);

  const fetchPosts = async () => {
    setLoading(true);
    const data = await getSocialMediaPosts();
    setPosts(data);
    setLoading(false);
  };

  const handleChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!form.caption) {
      toast.error('Caption required hai!');
      return;
    }
    if (!form.videoUrl && !form.imageUrl) {
      toast.error('Video URL ya Image URL mein se ek zaroori hai!');
      return;
    }
    if (posts.length >= 4) {
      toast.error('Maximum 4 posts ho sakte hain. Pehle koi purana delete karo.');
      return;
    }
    try {
      setSaving(true);
      await addSocialMediaPost({
        videoUrl: form.videoUrl.trim(),
        imageUrl: form.imageUrl.trim(),
        caption: form.caption.trim(),
        likes: form.likes.trim() || '0',
        link: form.link.trim() || 'https://www.instagram.com/plant_vigor/'
      });
      toast.success('Post successfully add ho gaya! 🎉');
      setForm({ videoUrl: '', imageUrl: '', caption: '', likes: '', link: 'https://www.instagram.com/plant_vigor/' });
      fetchPosts();
    } catch (err) {
      toast.error('Error: ' + err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Kya aap is post ko delete karna chahte hain?')) return;
    try {
      await deleteSocialMediaPost(id);
      toast.success('Post delete ho gaya!');
      fetchPosts();
    } catch (err) {
      toast.error('Delete karte waqt error aaya');
    }
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '900px' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
        <div style={{ width: 48, height: 48, background: 'linear-gradient(135deg, #f09433 0%,#e6683c 25%,#dc2743 50%,#cc2366 75%,#bc1888 100%)', borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <FaInstagram style={{ color: 'white', fontSize: 24 }} />
        </div>
        <div>
          <h2 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 900, color: '#143324' }}>Social Media Management</h2>
          <p style={{ margin: 0, fontSize: '0.8rem', color: '#888', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Homepage Instagram Feed ({posts.length}/4 posts)</p>
        </div>
      </div>

      {/* Info Banner */}
      <div style={{ background: '#fffbeb', border: '1px solid #fde68a', borderRadius: 16, padding: '1rem 1.25rem', marginBottom: '2rem' }}>
        <div style={{ display: 'flex', gap: '0.6rem', alignItems: 'flex-start' }}>
          <FaInfoCircle style={{ color: '#d97706', marginTop: 2, flexShrink: 0 }} />
          <div style={{ fontSize: '0.82rem', color: '#92400e', lineHeight: 1.7 }}>
            <strong>Video Reel kaise add karein:</strong>
            <ol style={{ margin: '0.4rem 0 0', paddingLeft: '1.2rem' }}>
              <li>Cloudinary mein apna video upload karo (ya koi direct .mp4 link)</li>
              <li><strong>Video URL</strong> field mein paste karo (e.g. <code style={{background:'#fef3c7',padding:'1px 4px',borderRadius:4}}>https://res.cloudinary.com/.../video.mp4</code>)</li>
              <li>Thumbnail ke liye <strong>Image URL</strong> bhi daalo (optional)</li>
              <li>Caption aur likes fill karo → Add karo → Homepage pe automatically play hoga 🎬</li>
            </ol>
          </div>
        </div>
      </div>

      {/* Add Form */}
      <div style={{ background: 'white', borderRadius: 20, padding: '1.5rem', boxShadow: '0 4px 20px rgba(0,0,0,0.06)', marginBottom: '2rem', border: '1px solid #f0f0f0' }}>
        <h3 style={{ margin: '0 0 1.25rem', fontSize: '1rem', fontWeight: 800, color: '#143324', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <FaPlus size={14} /> Naya Reel/Post Add Karo
        </h3>
        <form onSubmit={handleAdd}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>

            {/* Video URL — full width, highlighted */}
            <div style={{ gridColumn: '1 / -1', background: '#f0fdf4', borderRadius: 12, padding: '1rem', border: '1px solid #bbf7d0' }}>
              <label style={{ ...labelStyle, color: '#16a34a' }}><FaVideo size={11} /> 🎬 Video URL (MP4 — Cloudinary ya direct link) — <em>Reel ke liye yahi use karo</em></label>
              <input
                name="videoUrl"
                value={form.videoUrl}
                onChange={handleChange}
                placeholder="https://res.cloudinary.com/drzgk4yba/video/upload/v.../myvideo.mp4"
                style={{ ...inputStyle, border: '2px solid #bbf7d0', background: 'white' }}
              />
            </div>

            {/* Image URL */}
            <div style={{ gridColumn: '1 / -1' }}>
              <label style={labelStyle}><FaImage size={11} /> Thumbnail / Image URL (optional — video nahi hai to yahi dikhega)</label>
              <input
                name="imageUrl"
                value={form.imageUrl}
                onChange={handleChange}
                placeholder="https://res.cloudinary.com/... ya https://images.unsplash.com/..."
                style={inputStyle}
              />
            </div>

            {/* Caption */}
            <div style={{ gridColumn: '1 / -1' }}>
              <label style={labelStyle}>📝 Caption *</label>
              <input
                name="caption"
                value={form.caption}
                onChange={handleChange}
                placeholder="Monstera ko ghar le aao 🌿 Link in bio!"
                style={inputStyle}
                required
              />
            </div>

            {/* Likes */}
            <div>
              <label style={labelStyle}><FaHeart size={11} /> Likes Count (e.g. 2.4K)</label>
              <input
                name="likes"
                value={form.likes}
                onChange={handleChange}
                placeholder="2.4K"
                style={inputStyle}
              />
            </div>

            {/* Link */}
            <div>
              <label style={labelStyle}><FaLink size={11} /> Post Link</label>
              <input
                name="link"
                value={form.link}
                onChange={handleChange}
                placeholder="https://www.instagram.com/plant_vigor/"
                style={inputStyle}
              />
            </div>
          </div>

          {/* Preview */}
          {(form.videoUrl || form.imageUrl) && (
            <div style={{ marginBottom: '1rem' }}>
              <label style={labelStyle}>Preview</label>
              <div style={{ width: 100, height: 160, borderRadius: 12, overflow: 'hidden', border: '2px solid #e5e7eb', background: '#000' }}>
                {form.videoUrl ? (
                  <video
                    src={form.videoUrl}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    muted
                    autoPlay
                    loop
                    playsInline
                    onError={e => e.target.style.display = 'none'}
                  />
                ) : (
                  <img src={form.imageUrl} alt="preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={e => e.target.style.display = 'none'} />
                )}
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={saving || posts.length >= 4}
            style={{ background: posts.length >= 4 ? '#ccc' : '#143324', color: 'white', border: 'none', borderRadius: 12, padding: '0.75rem 1.75rem', fontWeight: 800, fontSize: '0.85rem', cursor: posts.length >= 4 ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}
          >
            <FaPlus size={12} /> {saving ? 'Adding...' : posts.length >= 4 ? 'Max 4 Posts Limit' : 'Add Post'}
          </button>
        </form>
      </div>

      {/* Existing Posts */}
      <div>
        <h3 style={{ margin: '0 0 1rem', fontSize: '1rem', fontWeight: 800, color: '#143324' }}>
          Live Posts ({posts.length}/4)
        </h3>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '2rem', color: '#888' }}>Loading posts...</div>
        ) : posts.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '2rem', background: '#fafafa', borderRadius: 16, border: '2px dashed #e5e7eb', color: '#888' }}>
            <FaInstagram size={32} style={{ marginBottom: '0.5rem', opacity: 0.3 }} />
            <p style={{ margin: 0, fontWeight: 700, fontSize: '0.9rem' }}>Abhi koi post nahi hai</p>
            <p style={{ margin: '0.25rem 0 0', fontSize: '0.8rem' }}>Upar se pehla reel/post add karo!</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem' }}>
            {posts.map((post) => (
              <div key={post.id} style={{ background: 'white', borderRadius: 16, overflow: 'hidden', boxShadow: '0 2px 12px rgba(0,0,0,0.06)', border: '1px solid #f0f0f0' }}>
                {/* Media preview */}
                <div style={{ position: 'relative', aspectRatio: '9/16', background: '#111' }}>
                  {post.videoUrl ? (
                    <video
                      src={post.videoUrl}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      muted autoPlay loop playsInline
                    />
                  ) : (
                    <img
                      src={post.imageUrl}
                      alt={post.caption}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                  )}
                  {/* Video badge */}
                  {post.videoUrl && (
                    <div style={{ position: 'absolute', top: 8, left: 8, background: 'rgba(0,0,0,0.6)', borderRadius: 6, padding: '2px 6px', color: 'white', fontSize: '0.6rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: 3 }}>
                      <FaVideo size={9} /> VIDEO
                    </div>
                  )}
                  <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 50%)' }} />
                  <div style={{ position: 'absolute', bottom: 8, left: 8, right: 8 }}>
                    <p style={{ margin: 0, color: 'white', fontSize: '0.7rem', fontWeight: 600, lineHeight: 1.4 }}>{post.caption}</p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 4 }}>
                      <FaHeart style={{ color: '#f87171', fontSize: 10 }} />
                      <span style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.65rem', fontWeight: 700 }}>{post.likes}</span>
                    </div>
                  </div>
                </div>
                {/* Actions */}
                <div style={{ padding: '0.6rem', display: 'flex', gap: '0.5rem' }}>
                  <a
                    href={post.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ flex: 1, background: '#f0fdf4', color: '#16a34a', border: 'none', borderRadius: 8, padding: '0.4rem', fontSize: '0.7rem', fontWeight: 700, textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4, textTransform: 'uppercase' }}
                  >
                    <FaExternalLinkAlt size={9} /> View
                  </a>
                  <button
                    onClick={() => handleDelete(post.id)}
                    style={{ background: '#fef2f2', color: '#ef4444', border: 'none', borderRadius: 8, padding: '0.4rem 0.6rem', cursor: 'pointer', fontSize: '0.7rem' }}
                  >
                    <FaTrash size={11} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const labelStyle = {
  display: 'flex', alignItems: 'center', gap: '0.35rem',
  fontSize: '0.72rem', fontWeight: 800, color: '#666',
  textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.4rem'
};

const inputStyle = {
  width: '100%', border: '2px solid #f0f0f0', borderRadius: 10,
  padding: '0.65rem 0.9rem', fontSize: '0.85rem', fontWeight: 500,
  outline: 'none', background: '#fafafa', boxSizing: 'border-box', fontFamily: 'inherit'
};

export default SocialMedia;
